import { supabase } from '../lib/supabase';

/* ============================================================
   SYNCHRO — Central Workflow Engine (Single Source of Truth)
   
   Connects every portal through one shared workflow state:
     FRONT DESK → Patient registered → Admission
     ↓
     NURSING → Triage → Readiness
     ↓
     DOCTOR → Consultation → Surgery scheduled
     ↓
     NURSING / OT → OT preparation
     ↓
     CSSD → Required pack identified → Pack sterilized & verified
     ↓
     OT → Instrument ready (CSSD assigns pack to OT)
     ↓
     DOCTOR → Notification sent
     ↓
     SURGERY → Started → Completed
     ↓
     TURNOVER → OT READY
     ↓
     BILLING → Procedure charge
     ↓
     ADMIN → Analytics updated

   Event Structure (10 required fields):
     - event_id
     - patient_id
     - surgery_id
     - department
     - event_type
     - previous_status
     - new_status
     - timestamp
     - user_id
     - metadata
   ============================================================ */

export const WORKFLOW_EVENTS = {
  PATIENT_REGISTERED: 'PATIENT_REGISTERED',
  PATIENT_ADMITTED: 'PATIENT_ADMITTED',
  TRIAGE_COMPLETED: 'TRIAGE_COMPLETED',
  READINESS_UPDATED: 'READINESS_UPDATED',
  CONSULTATION_COMPLETED: 'CONSULTATION_COMPLETED',
  SURGERY_SCHEDULED: 'SURGERY_SCHEDULED',
  OT_PREPARATION: 'OT_PREPARATION',
  PACK_IDENTIFIED: 'PACK_IDENTIFIED',
  PACK_STERILIZED: 'PACK_STERILIZED',
  INSTRUMENT_READY: 'INSTRUMENT_READY',
  NOTIFICATION_SENT: 'NOTIFICATION_SENT',
  SURGERY_STARTED: 'SURGERY_STARTED',
  SURGERY_COMPLETED: 'SURGERY_COMPLETED',
  TURNOVER_STARTED: 'TURNOVER_STARTED',
  OT_READY: 'OT_READY',
  BILLING_CHARGE_CREATED: 'BILLING_CHARGE_CREATED',
  ANALYTICS_UPDATED: 'ANALYTICS_UPDATED',
};

// Department identifiers
export const DEPARTMENTS = {
  FRONT_DESK: 'FRONT_DESK',
  NURSING: 'NURSING',
  DOCTOR: 'DOCTOR',
  CSSD: 'CSSD',
  OT: 'OT',
  BILLING: 'BILLING',
  ADMIN: 'ADMIN',
};

// Storage key for persistent offline event queue
const OFFLINE_QUEUE_KEY = 'synchro_offline_workflow_events';

class WorkflowEngine {
  constructor() {
    this.subscribers = new Set();
    this.realtimeChannel = null;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    // Load offline queue from localStorage
    this.offlineQueue = this._loadOfflineQueue();

    // Bind window online/offline listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('[WorkflowEngine] Network online. Flushing offline queue...');
        this.flushOfflineQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.warn('[WorkflowEngine] Network offline. Events will be queued locally.');
      });
    }

    // Initialize realtime subscription channel
    this._initRealtimeChannel();
  }

  // ─── Local Storage Helper Functions ───────────────────────
  _loadOfflineQueue() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const saved = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  }

  _saveOfflineQueue() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.offlineQueue));
      }
    } catch (_) { /* ignore */ }
  }

  // ─── Realtime Engine Setup ────────────────────────────────
  _initRealtimeChannel() {
    if (!supabase || !supabase.channel) return;

    try {
      this.realtimeChannel = supabase.channel('synchro_workflow_events', {
        config: { broadcast: { self: true } }
      });

      // Listen for broadcast events across open browser windows/tabs
      this.realtimeChannel.on('broadcast', { event: 'workflow_event' }, ({ payload }) => {
        if (payload) {
          this._notifySubscribers(payload);
        }
      });

      // Listen for database inserts on workflow_events table
      this.realtimeChannel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'workflow_events' },
        (payload) => {
          if (payload?.new) {
            const formatted = this._formatEventFromDb(payload.new);
            this._notifySubscribers(formatted);
          }
        }
      );

      this.realtimeChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[WorkflowEngine] Realtime workflow subscription active.');
        }
      });
    } catch (err) {
      console.warn('[WorkflowEngine] Error initializing realtime channel:', err.message);
    }
  }

  // Format database record to standard 10-field event object
  _formatEventFromDb(dbRow) {
    return {
      event_id: dbRow.id || dbRow.event_id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      patient_id: dbRow.patient_id || dbRow.metadata?.patient_id || null,
      surgery_id: dbRow.surgery_id || dbRow.metadata?.surgery_id || null,
      department: dbRow.department || dbRow.metadata?.department || DEPARTMENTS.ADMIN,
      event_type: dbRow.event_type || WORKFLOW_EVENTS.ANALYTICS_UPDATED,
      previous_status: dbRow.previous_status || dbRow.from_status || null,
      new_status: dbRow.new_status || dbRow.to_status || null,
      timestamp: dbRow.event_timestamp || dbRow.event_at || dbRow.created_at || new Date().toISOString(),
      user_id: dbRow.user_id || dbRow.performed_by || null,
      metadata: dbRow.metadata || {}
    };
  }

  // ─── Subscriptions & RBAC Authorization Filtering ─────────
  /**
   * Subscribe to workflow events with role-based access filtering.
   * @param {Object} options - { role, userId, callback }
   * @returns {Function} unsubscribe cleanup function
   */
  subscribe({ role = 'HOSPITAL_ADMIN', userId = null, callback }) {
    if (typeof callback !== 'function') return () => {};

    const subscription = { role, userId, callback };
    this.subscribers.add(subscription);

    return () => {
      this.subscribers.delete(subscription);
    };
  }

  // Broadcast event to internal subscribers enforcing RBAC filtering
  _notifySubscribers(eventPayload) {
    this.subscribers.forEach((sub) => {
      if (this.isAuthorizedForEvent(sub.role, sub.userId, eventPayload)) {
        try {
          sub.callback(eventPayload);
        } catch (err) {
          console.error('[WorkflowEngine] Subscriber error:', err);
        }
      }
    });
  }

  /**
   * RBAC Authorization Check: Determines if a given role/user can receive the event.
   */
  isAuthorizedForEvent(role, userId, event) {
    if (!role || role === 'HOSPITAL_ADMIN' || role === 'ADMIN') return true;

    const dept = event.department;
    const type = event.event_type;

    switch (role) {
      case 'SURGEON':
      case 'DOCTOR':
        // Doctor receives Doctor dept events, OT readiness, surgery state changes, and notifications aimed at them
        if (dept === DEPARTMENTS.DOCTOR) return true;
        if ([WORKFLOW_EVENTS.INSTRUMENT_READY, WORKFLOW_EVENTS.SURGERY_STARTED, WORKFLOW_EVENTS.SURGERY_COMPLETED, WORKFLOW_EVENTS.NOTIFICATION_SENT].includes(type)) return true;
        if (event.metadata?.surgeon_id && event.metadata.surgeon_id === userId) return true;
        return false;

      case 'NURSE':
      case 'NURSING':
        // Nursing receives Nursing, Front Desk intake, OT prep/instrument ready, surgery status
        if ([DEPARTMENTS.NURSING, DEPARTMENTS.FRONT_DESK, DEPARTMENTS.OT].includes(dept)) return true;
        if ([WORKFLOW_EVENTS.INSTRUMENT_READY, WORKFLOW_EVENTS.PACK_STERILIZED, WORKFLOW_EVENTS.TURNOVER_STARTED, WORKFLOW_EVENTS.OT_READY].includes(type)) return true;
        return false;

      case 'CSSD_MANAGER':
      case 'CSSD_TECH':
      case 'CSSD':
        // CSSD receives CSSD events, Surgery scheduled, OT requirements
        if (dept === DEPARTMENTS.CSSD) return true;
        if ([WORKFLOW_EVENTS.SURGERY_SCHEDULED, WORKFLOW_EVENTS.OT_PREPARATION, WORKFLOW_EVENTS.INSTRUMENT_READY].includes(type)) return true;
        return false;

      case 'BILLING':
      case 'ADMISSIONS_STAFF':
        // Billing receives Front Desk registration/admission, Surgery completion, Billing charge
        if ([DEPARTMENTS.BILLING, DEPARTMENTS.FRONT_DESK].includes(dept)) return true;
        if ([WORKFLOW_EVENTS.SURGERY_COMPLETED, WORKFLOW_EVENTS.BILLING_CHARGE_CREATED].includes(type)) return true;
        return false;

      default:
        return true;
    }
  }

  // ─── Core: Record a Workflow Event (Single Source of Truth) ───
  async recordEvent({
    patientId = null,
    surgeryId = null,
    department = DEPARTMENTS.ADMIN,
    eventType,
    previousStatus = null,
    newStatus = null,
    userId = null,
    metadata = {}
  }) {
    const timestamp = new Date().toISOString();
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Build exact 10-field event object
    const event = {
      event_id: eventId,
      patient_id: patientId,
      surgery_id: surgeryId,
      department,
      event_type: eventType,
      previous_status: previousStatus,
      new_status: newStatus,
      timestamp,
      user_id: userId,
      metadata: { ...metadata, recorded_at: timestamp }
    };

    // 1. Immediately notify local subscribers (optimistic UI update)
    this._notifySubscribers(event);

    // 2. Broadcast via Supabase Realtime channel
    if (this.realtimeChannel) {
      try {
        this.realtimeChannel.send({
          type: 'broadcast',
          event: 'workflow_event',
          payload: event
        });
      } catch (err) {
        console.warn('[WorkflowEngine] Broadcast error:', err);
      }
    }

    // 3. Persist to PostgreSQL database (or offline queue if disconnected)
    const dbPayload = {
      entity_type: surgeryId ? 'surgery' : patientId ? 'patient' : 'system',
      entity_id: surgeryId || patientId || '00000000-0000-0000-0000-000000000000',
      event_type: eventType,
      from_status: previousStatus,
      to_status: newStatus,
      performed_by: userId,
      patient_id: patientId,
      surgery_id: surgeryId,
      department,
      previous_status: previousStatus,
      new_status: newStatus,
      user_id: userId,
      event_timestamp: timestamp,
      metadata: event.metadata,
      notes: `${eventType}: ${previousStatus || 'N/A'} → ${newStatus || 'N/A'}`
    };

    try {
      const { data, error } = await supabase
        .from('workflow_events')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return { data: this._formatEventFromDb(data), error: null };
    } catch (err) {
      console.warn('[WorkflowEngine] DB persist failed. Queuing event offline:', err.message || err);
      this.offlineQueue.push(event);
      this._saveOfflineQueue();
      return { data: event, error: err, queued: true };
    }
  }

  // ─── Connection Recovery & Offline Sync ───────────────────
  async flushOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    const queueToFlush = [...this.offlineQueue];
    this.offlineQueue = [];
    this._saveOfflineQueue();

    console.log(`[WorkflowEngine] Synchronizing ${queueToFlush.length} queued offline events...`);

    const dbBatch = queueToFlush.map(evt => ({
      entity_type: evt.surgery_id ? 'surgery' : evt.patient_id ? 'patient' : 'system',
      entity_id: evt.surgery_id || evt.patient_id || '00000000-0000-0000-0000-000000000000',
      event_type: evt.event_type,
      from_status: evt.previous_status,
      to_status: evt.new_status,
      performed_by: evt.user_id,
      patient_id: evt.patient_id,
      surgery_id: evt.surgery_id,
      department: evt.department,
      previous_status: evt.previous_status,
      new_status: evt.new_status,
      user_id: evt.user_id,
      event_timestamp: evt.timestamp,
      metadata: evt.metadata,
      notes: `[Offline Sync] ${evt.event_type}: ${evt.previous_status || 'N/A'} → ${evt.new_status || 'N/A'}`
    }));

    try {
      const { error } = await supabase.from('workflow_events').insert(dbBatch);
      if (error) throw error;
      console.log('[WorkflowEngine] Offline events successfully synchronized to database.');
    } catch (err) {
      console.error('[WorkflowEngine] Failed to flush offline queue, re-queuing:', err);
      this.offlineQueue = [...queueToFlush, ...this.offlineQueue];
      this._saveOfflineQueue();
    }
  }

  // ─── Targeted Role Notification Helper ────────────────────
  async sendNotification({
    userId = null,
    roleTarget = null,
    severity = 'INFORMATION',
    title,
    description,
    department = null,
    relatedEntityType = null,
    relatedEntityId = null,
    actionUrl = null
  }) {
    try {
      // 1. Direct user notification
      if (userId) {
        await supabase.from('notifications').insert([{
          user_id: userId,
          severity,
          title,
          description,
          department,
          related_entity_type: relatedEntityType,
          related_entity_id: relatedEntityId,
          action_url: actionUrl,
        }]);
      }

      // 2. Role notification (broadcast to active users with role)
      if (roleTarget) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, roles:role_id (name)')
          .limit(50);

        if (profiles && profiles.length > 0) {
          const targets = profiles.filter(p => p.roles?.name === roleTarget || p.roles?.name === 'HOSPITAL_ADMIN');
          for (const p of targets) {
            if (p.id !== userId) {
              await supabase.from('notifications').insert([{
                user_id: p.id,
                severity,
                title,
                description,
                department,
                related_entity_type: relatedEntityType,
                related_entity_id: relatedEntityId,
                action_url: actionUrl,
              }]).catch(() => {});
            }
          }
        }
      }
    } catch (err) {
      console.warn('[WorkflowEngine] sendNotification warning:', err.message || err);
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  PIPELINE TRANSITION HANDLERS (Connect Every Portal)
  // ═══════════════════════════════════════════════════════════

  // 1. FRONT DESK: Patient Registered
  async onPatientRegistered(patientId, userId = null, metadata = {}) {
    return this.recordEvent({
      patientId,
      department: DEPARTMENTS.FRONT_DESK,
      eventType: WORKFLOW_EVENTS.PATIENT_REGISTERED,
      previousStatus: null,
      newStatus: 'REGISTERED',
      userId,
      metadata
    });
  }

  // 2. FRONT DESK: Admission
  async onPatientAdmitted(patientId, admissionId = null, userId = null, metadata = {}) {
    const res = await this.recordEvent({
      patientId,
      department: DEPARTMENTS.FRONT_DESK,
      eventType: WORKFLOW_EVENTS.PATIENT_ADMITTED,
      previousStatus: 'REGISTERED',
      newStatus: 'ADMITTED',
      userId,
      metadata: { ...metadata, admission_id: admissionId }
    });

    await this.sendNotification({
      roleTarget: 'NURSE',
      severity: 'INFORMATION',
      title: 'New Patient Admitted',
      description: `Patient ${patientId} admitted and waiting in pre-op ward for triage.`,
      department: DEPARTMENTS.NURSING,
      relatedEntityType: 'patient',
      relatedEntityId: patientId
    });

    return res;
  }

  // 3. NURSING: Triage Completed
  async onTriageCompleted(patientId, userId = null, metadata = {}) {
    return this.recordEvent({
      patientId,
      department: DEPARTMENTS.NURSING,
      eventType: WORKFLOW_EVENTS.TRIAGE_COMPLETED,
      previousStatus: 'ADMITTED',
      newStatus: 'TRIAGED',
      userId,
      metadata
    });
  }

  // 4. NURSING: Readiness Updated (5-gate checklist cleared)
  async onReadinessUpdated(patientId, surgeryId = null, userId = null, metadata = {}) {
    const res = await this.recordEvent({
      patientId,
      surgeryId,
      department: DEPARTMENTS.NURSING,
      eventType: WORKFLOW_EVENTS.READINESS_UPDATED,
      previousStatus: 'TRIAGED',
      newStatus: 'PATIENT_READY',
      userId,
      metadata
    });

    // Cascade update to surgery record if linked
    if (surgeryId) {
      await supabase
        .from('surgeries')
        .update({ status: 'PATIENT_READY', updated_at: new Date().toISOString() })
        .eq('id', surgeryId)
        .catch(() => {});
    }

    return res;
  }

  // 5. DOCTOR: Consultation Completed
  async onConsultationCompleted(patientId, doctorId = null, userId = null, metadata = {}) {
    return this.recordEvent({
      patientId,
      department: DEPARTMENTS.DOCTOR,
      eventType: WORKFLOW_EVENTS.CONSULTATION_COMPLETED,
      previousStatus: 'PATIENT_READY',
      newStatus: 'CONSULTED',
      userId,
      metadata: { ...metadata, doctor_id: doctorId }
    });
  }

  // 6. DOCTOR: Surgery Scheduled
  async onSurgeryScheduled(surgeryId, patientId, doctorId = null, theatreId = null, userId = null, metadata = {}) {
    const res = await this.recordEvent({
      patientId,
      surgeryId,
      department: DEPARTMENTS.DOCTOR,
      eventType: WORKFLOW_EVENTS.SURGERY_SCHEDULED,
      previousStatus: 'CONSULTED',
      newStatus: 'SCHEDULED',
      userId,
      metadata: { ...metadata, doctor_id: doctorId, theatre_id: theatreId }
    });

    // Notify CSSD to prepare required sterile pack
    await this.sendNotification({
      roleTarget: 'CSSD_MANAGER',
      severity: 'ATTENTION',
      title: 'Surgery Scheduled — Sterilization Pack Required',
      description: `Surgery scheduled for patient ${patientId}. Please verify and assign sterile pack.`,
      department: DEPARTMENTS.CSSD,
      relatedEntityType: 'surgery',
      relatedEntityId: surgeryId
    });

    return res;
  }

  // 7. NURSING / OT: OT Preparation
  async onOTPreparation(surgeryId, theatreId = null, userId = null, metadata = {}) {
    return this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.OT,
      eventType: WORKFLOW_EVENTS.OT_PREPARATION,
      previousStatus: 'SCHEDULED',
      newStatus: 'OT_PREP',
      userId,
      metadata: { ...metadata, theatre_id: theatreId }
    });
  }

  // 8. CSSD: Required Pack Identified
  async onPackIdentified(packId, surgeryId = null, userId = null, metadata = {}) {
    return this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.CSSD,
      eventType: WORKFLOW_EVENTS.PACK_IDENTIFIED,
      previousStatus: 'STORAGE',
      newStatus: 'IDENTIFIED',
      userId,
      metadata: { ...metadata, pack_id: packId }
    });
  }

  // 9. CSSD: Pack Sterilized & Verified
  async onPackSterilized(packId, userId = null, metadata = {}) {
    return this.recordEvent({
      department: DEPARTMENTS.CSSD,
      eventType: WORKFLOW_EVENTS.PACK_STERILIZED,
      previousStatus: 'IN_STERILIZATION',
      newStatus: 'STERILE',
      userId,
      metadata: { ...metadata, pack_id: packId }
    });
  }

  // 10. OT & CSSD: Pack Dispatched → OT Instrument Ready (Crucial Sync Example)
  async onPackDispatched(packId, theatreId, surgeryId = null, userId = null, metadata = {}) {
    // 10a. CSSD Dispatch Event
    await this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.CSSD,
      eventType: WORKFLOW_EVENTS.PACK_STERILIZED,
      previousStatus: 'STERILE',
      newStatus: 'DISPATCHED',
      userId,
      metadata: { ...metadata, pack_id: packId, theatre_id: theatreId }
    });

    // 10b. OT Instrument Ready Event (NURSING OT Board & DOCTOR receive this!)
    const res = await this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.OT,
      eventType: WORKFLOW_EVENTS.INSTRUMENT_READY,
      previousStatus: 'OT_PREP',
      newStatus: 'INSTRUMENT_READY',
      userId,
      metadata: { ...metadata, pack_id: packId, theatre_id: theatreId }
    });

    // Fetch theatre suite code for clear display
    let suiteCode = 'OT';
    try {
      const { data: t } = await supabase.from('operating_theatres').select('suite_code').eq('id', theatreId).single();
      if (t?.suite_code) suiteCode = t.suite_code;
    } catch (_) {}

    // 10c. DOCTOR Notification: OT instruments ready notification sent
    await this.sendNotification({
      roleTarget: 'SURGEON',
      severity: 'ATTENTION',
      title: `${suiteCode} Instruments Ready`,
      description: `Sterile pack ${packId} verified & dispatched to ${suiteCode}. Surgical team may proceed.`,
      department: DEPARTMENTS.DOCTOR,
      relatedEntityType: 'operating_theatre',
      relatedEntityId: theatreId
    });

    // 10d. Record NOTIFICATION_SENT event
    await this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.DOCTOR,
      eventType: WORKFLOW_EVENTS.NOTIFICATION_SENT,
      previousStatus: null,
      newStatus: 'NOTIFIED',
      userId,
      metadata: { title: `${suiteCode} Instruments Ready`, pack_id: packId }
    });

    // 10e. ADMIN & ANALYTICS: OT readiness updated
    await this.recordEvent({
      department: DEPARTMENTS.ADMIN,
      eventType: WORKFLOW_EVENTS.ANALYTICS_UPDATED,
      previousStatus: 'PENDING_READINESS',
      newStatus: 'OT_READY',
      userId,
      metadata: { theatre_id: theatreId, suite_code: suiteCode }
    });

    return res;
  }

  // 11. SURGERY: Started
  async onSurgeryStarted(surgeryId, theatreId = null, userId = null, metadata = {}) {
    const res = await this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.OT,
      eventType: WORKFLOW_EVENTS.SURGERY_STARTED,
      previousStatus: 'INSTRUMENT_READY',
      newStatus: 'IN_SURGERY',
      userId,
      metadata: { ...metadata, theatre_id: theatreId }
    });

    // Cascade update to Surgery & OT records
    if (surgeryId) {
      await supabase.from('surgeries').update({
        status: 'IN_SURGERY',
        actual_start: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', surgeryId).catch(() => {});
    }

    if (theatreId) {
      await supabase.from('operating_theatres').update({
        status: 'IN_SURGERY',
        updated_at: new Date().toISOString()
      }).eq('id', theatreId).catch(() => {});
    }

    return res;
  }

  // 12. SURGERY: Completed → Auto-trigger Turnover & Billing Charge
  async onSurgeryCompleted(surgeryId, theatreId = null, userId = null, metadata = {}) {
    // 12a. Surgery Completed Event
    const res = await this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.OT,
      eventType: WORKFLOW_EVENTS.SURGERY_COMPLETED,
      previousStatus: 'IN_SURGERY',
      newStatus: 'COMPLETED',
      userId,
      metadata: { ...metadata, theatre_id: theatreId }
    });

    // Update Surgery record
    if (surgeryId) {
      await supabase.from('surgeries').update({
        status: 'COMPLETED',
        actual_end: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', surgeryId).catch(() => {});
    }

    // 12b. Auto Turnover Started
    await this.onTurnoverStarted(theatreId, surgeryId, userId, metadata);

    // 12c. Auto BILLING: Procedure charge creation
    await this._createSurgeryBillingCharge(surgeryId, userId);

    // 12d. ADMIN: Analytics updated
    await this.recordEvent({
      department: DEPARTMENTS.ADMIN,
      eventType: WORKFLOW_EVENTS.ANALYTICS_UPDATED,
      previousStatus: 'SURGERY_IN_PROGRESS',
      newStatus: 'CASE_COMPLETED',
      userId,
      metadata: { surgery_id: surgeryId }
    });

    return res;
  }

  // 13. TURNOVER: Turnover Started
  async onTurnoverStarted(theatreId, surgeryId = null, userId = null, metadata = {}) {
    if (theatreId) {
      await supabase.from('operating_theatres').update({
        status: 'TURNOVER',
        updated_at: new Date().toISOString()
      }).eq('id', theatreId).catch(() => {});
    }

    return this.recordEvent({
      surgeryId,
      department: DEPARTMENTS.OT,
      eventType: WORKFLOW_EVENTS.TURNOVER_STARTED,
      previousStatus: 'COMPLETED',
      newStatus: 'TURNOVER',
      userId,
      metadata: { ...metadata, theatre_id: theatreId }
    });
  }

  // 14. OT READY: Turnover Completed
  async onOTReady(theatreId, userId = null, metadata = {}) {
    if (theatreId) {
      await supabase.from('operating_theatres').update({
        status: 'READY',
        block_reason: null,
        updated_at: new Date().toISOString()
      }).eq('id', theatreId).catch(() => {});
    }

    return this.recordEvent({
      department: DEPARTMENTS.OT,
      eventType: WORKFLOW_EVENTS.OT_READY,
      previousStatus: 'TURNOVER',
      newStatus: 'READY',
      userId,
      metadata: { ...metadata, theatre_id: theatreId }
    });
  }

  // 15. BILLING: Procedure Charge Created
  async _createSurgeryBillingCharge(surgeryId, userId = null) {
    try {
      const { data: surgery } = await supabase
        .from('surgeries')
        .select('*, patient:patients(*)')
        .eq('id', surgeryId)
        .single();

      if (!surgery || !surgery.patient_id) return;

      const patientId = surgery.patient_id;
      const chargeAmount = 45000; // Procedure base charge

      // Record BILLING_CHARGE_CREATED event
      await this.recordEvent({
        patientId,
        surgeryId,
        department: DEPARTMENTS.BILLING,
        eventType: WORKFLOW_EVENTS.BILLING_CHARGE_CREATED,
        previousStatus: 'PENDING_BILLING',
        newStatus: 'CHARGE_CREATED',
        userId,
        metadata: {
          procedure_name: surgery.procedure_name,
          amount: chargeAmount,
          currency: 'INR'
        }
      });

      // Send notification to Billing department
      await this.sendNotification({
        roleTarget: 'BILLING',
        severity: 'INFORMATION',
        title: 'New Procedure Charge',
        description: `Procedure charge ₹${chargeAmount.toLocaleString()} logged for ${surgery.procedure_name}.`,
        department: DEPARTMENTS.BILLING,
        relatedEntityType: 'surgery',
        relatedEntityId: surgeryId
      });
    } catch (err) {
      console.warn('[WorkflowEngine] _createSurgeryBillingCharge warning:', err.message || err);
    }
  }

  // ─── Querying Event History ───────────────────────────────
  async getWorkflowHistory({ patientId, surgeryId, department, limit = 50 } = {}) {
    try {
      let query = supabase
        .from('workflow_events')
        .select('*')
        .order('event_timestamp', { ascending: false })
        .limit(limit);

      if (patientId) query = query.eq('patient_id', patientId);
      if (surgeryId) query = query.eq('surgery_id', surgeryId);
      if (department) query = query.eq('department', department);

      const { data, error } = await query;
      if (error) throw error;

      return { data: (data || []).map(row => this._formatEventFromDb(row)), error: null };
    } catch (err) {
      console.warn('[WorkflowEngine] getWorkflowHistory error:', err);
      return { data: [], error: err };
    }
  }

  // Helper count of pending offline events
  get pendingOfflineCount() {
    return this.offlineQueue.length;
  }
}

export const workflowEngine = new WorkflowEngine();
