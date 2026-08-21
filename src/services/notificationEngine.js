import { supabase } from '../lib/supabase';
import { workflowEngine, WORKFLOW_EVENTS, DEPARTMENTS } from './workflowEngine';
import { adapters } from './notificationAdapters';

/* ============================================================
   SYNCHRO — Central Notification Engine
   
   Proactively alerts employees about vital hospital workflow changes
   without requiring constant dashboard manual polling.

   Supports:
   - In-app toasts & bell panel
   - Native Web Browser Push notifications (+ HIPAA PHI privacy masking)
   - Preference management & priority filtering
   - Notification history, read/unread, acknowledge, and dismiss
   - Integration-ready adapters for SMS, Email, Pager, and MS Teams
   - Deep-linking to specific OT suites, ward beds, or billing invoices
   ============================================================ */

export const NOTIFICATION_PRIORITIES = {
  CRITICAL: 'CRITICAL', // Red alert — immediate action required (e.g., Cardiac Arrest, Anoxia, Missing Consent)
  HIGH: 'HIGH',         // Amber alert — workflow lag / OT instrument ready / OT delayed
  MEDIUM: 'MEDIUM',     // Teal alert — operational status update (e.g., Patient Ready, Pack Sterilized)
  LOW: 'LOW'            // Grey alert — informational log
};

const PREFERENCES_KEY = 'synchro_notification_preferences';

const DEFAULT_PREFERENCES = {
  channels: {
    inApp: true,
    browserPush: true,
    sms: false,
    email: true,
    pager: false,
    enterpriseTeams: false,
  },
  minPriority: NOTIFICATION_PRIORITIES.LOW,
  maskPHIOnExternalBanners: true,
  quietHours: false,
};

class NotificationEngine {
  constructor() {
    this.preferences = this._loadPreferences();
    this.inMemoryStore = [];
    this.subscribers = new Set();

    // Listen to WorkflowEngine events for automated notification generation
    this._connectToWorkflowEngine();
  }

  // ─── Preferences Storage Helper ────────────────────────────
  _loadPreferences() {
    try {
      if (typeof localStorage === 'undefined') return DEFAULT_PREFERENCES;
      const saved = localStorage.getItem(PREFERENCES_KEY);
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch (_) {
      return DEFAULT_PREFERENCES;
    }
  }

  savePreferences(newPrefs) {
    this.preferences = { ...this.preferences, ...newPrefs };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));
      }
    } catch (_) {}
    this._notifySubscribers();
  }

  // ─── Connect to Central Workflow Engine ────────────────────
  _connectToWorkflowEngine() {
    workflowEngine.subscribe({
      role: 'ALL',
      callback: (event) => {
        this.handleWorkflowEvent(event);
      }
    });
  }

  /**
   * Translates WorkflowEngine pipeline events into targeted notifications.
   */
  async handleWorkflowEvent(event) {
    const { event_type, metadata, department, patient_id, surgery_id } = event;

    // Example 1: Nurse dispatches CSSD pack → Notify Doctor & Nursing
    if (event_type === WORKFLOW_EVENTS.INSTRUMENT_READY || (event_type === WORKFLOW_EVENTS.PACK_STERILIZED && metadata?.to_status === 'DISPATCHED')) {
      const suiteCode = metadata?.suite_code || 'OT-405';
      const packCode = metadata?.pack_code || metadata?.pack_id || 'TKR Pack B';

      await this.notify({
        title: `🔔 ${suiteCode} Instruments Ready`,
        message: `Sterile instrument pack ${packCode} verified and assigned to ${suiteCode}.`,
        priority: NOTIFICATION_PRIORITIES.HIGH,
        department: DEPARTMENTS.DOCTOR,
        relatedOT: suiteCode,
        relatedPatient: patient_id,
        actionLabel: `Go to ${suiteCode}`,
        actionRoute: `/theatres?ot=${suiteCode}`,
        actionUrl: `/theatres?ot=${suiteCode}`,
        roleTarget: 'SURGEON'
      });
    }

    // Example 2: Patient Ready → Notify Nurse
    if (event_type === WORKFLOW_EVENTS.READINESS_UPDATED || (event_type === WORKFLOW_EVENTS.STATUS_CHANGE && event.new_status === 'PATIENT_READY')) {
      await this.notify({
        title: `✓ Patient Ready in Ward`,
        message: `Pre-operative 5-gate readiness checklist cleared for Patient ${patient_id || 'P-1024'}.`,
        priority: NOTIFICATION_PRIORITIES.MEDIUM,
        department: DEPARTMENTS.NURSING,
        relatedPatient: patient_id,
        actionLabel: 'View Ward Board',
        actionRoute: '/nursing',
        actionUrl: '/nursing',
        roleTarget: 'NURSE'
      });
    }

    // Example 3: Surgery Completed → Notify Billing & Admin
    if (event_type === WORKFLOW_EVENTS.SURGERY_COMPLETED) {
      await this.notify({
        title: `💳 Surgery Completed — Procedure Charge Created`,
        message: `Surgery ${surgery_id || 'Case'} completed. Automatic billing procedure charge generated.`,
        priority: NOTIFICATION_PRIORITIES.MEDIUM,
        department: DEPARTMENTS.BILLING,
        relatedPatient: patient_id,
        actionLabel: 'View Billing Account',
        actionRoute: '/billing',
        actionUrl: '/billing',
        roleTarget: 'BILLING'
      });
    }

    // Example 4: Critical Bottleneck / OT Blocked → Notify Admin
    if (event_type === WORKFLOW_EVENTS.STATUS_CHANGE && event.new_status === 'BLOCKED') {
      await this.notify({
        title: `⚠️ OT Delay Alert: ${metadata?.block_reason || 'Sterile Pack Cooldown Hold'}`,
        message: `Operating Theatre blocked. Immediate administrative resolution recommended.`,
        priority: NOTIFICATION_PRIORITIES.CRITICAL,
        department: DEPARTMENTS.ADMIN,
        relatedOT: metadata?.suite_code || 'OT-02',
        actionLabel: 'Open Intelligence Dashboard',
        actionRoute: '/workflow-intelligence',
        actionUrl: '/workflow-intelligence',
        roleTarget: 'HOSPITAL_ADMIN'
      });
    }
  }

  // ─── Core Notification Dispatcher ──────────────────────────
  /**
   * Main method to send a notification across enabled channels.
   */
  async notify({
    userId = null,
    roleTarget = null,
    title,
    message,
    priority = NOTIFICATION_PRIORITIES.MEDIUM,
    department = DEPARTMENTS.ADMIN,
    relatedPatient = null,
    relatedOT = null,
    actionLabel = 'View Details',
    actionRoute = '/dashboard',
    actionUrl = '/dashboard',
    metadata = {}
  }) {
    const timestamp = new Date().toISOString();
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const notificationPayload = {
      id,
      user_id: userId,
      title,
      message,
      description: message, // Alias for component compatibility
      priority,
      severity: priority === 'CRITICAL' ? 'CRITICAL' : priority === 'HIGH' ? 'ATTENTION' : 'INFORMATION',
      department,
      deptPillar: department === 'CSSD' ? 'teal' : department === 'OT' || department === 'DOCTOR' ? 'indigo' : department === 'BILLING' ? 'purple' : 'blue',
      group: priority === 'CRITICAL' ? 'Critical' : priority === 'HIGH' ? 'Attention' : 'Information',
      relatedPatient,
      relatedOT,
      related_entity_type: relatedOT ? 'operating_theatre' : relatedPatient ? 'patient' : 'system',
      related_entity_id: relatedOT || relatedPatient || id,
      actionLabel,
      actionRoute,
      actionUrl,
      action_url: actionUrl,
      is_read: false,
      is_acknowledged: false,
      is_dismissed: false,
      timestamp,
      created_at: timestamp,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata
    };

    // 1. Store in memory for instant reactivity
    this.inMemoryStore = [notificationPayload, ...this.inMemoryStore.slice(0, 99)];

    // 2. Persist to PostgreSQL database (if available)
    try {
      await supabase.from('notifications').insert([{
        user_id: userId,
        title,
        description: message,
        severity: notificationPayload.severity,
        department,
        related_entity_type: notificationPayload.related_entity_type,
        related_entity_id: notificationPayload.related_entity_id,
        action_url: actionUrl,
      }]).catch(() => {});
    } catch (_) {}

    // 3. Dispatch to Enabled Channel Adapters
    if (this.preferences.channels.inApp) {
      await adapters.inApp.send(notificationPayload, { userId });
    }

    if (this.preferences.channels.browserPush) {
      await adapters.browserPush.send(notificationPayload, { userId });
    }

    if (this.preferences.channels.sms) {
      await adapters.sms.send(notificationPayload, { userId });
    }

    if (this.preferences.channels.email) {
      await adapters.email.send(notificationPayload, { userId });
    }

    if (this.preferences.channels.pager) {
      await adapters.pager.send(notificationPayload, { userId });
    }

    if (this.preferences.channels.enterpriseTeams) {
      await adapters.enterpriseTeams.send(notificationPayload, { userId });
    }

    // 4. Notify React UI subscribers
    this._notifySubscribers();

    return notificationPayload;
  }

  // ─── Actions: Read, Acknowledge, Dismiss ──────────────────
  async markAsRead(notificationId) {
    const notif = this.inMemoryStore.find(n => n.id === notificationId);
    if (notif) {
      notif.is_read = true;
      notif.read_at = new Date().toISOString();
    }

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .catch(() => {});
    } catch (_) {}

    this._notifySubscribers();
  }

  async markAllAsRead(userId = null) {
    this.inMemoryStore.forEach(n => {
      n.is_read = true;
      n.read_at = new Date().toISOString();
    });

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('is_read', false)
        .catch(() => {});
    } catch (_) {}

    this._notifySubscribers();
  }

  async acknowledge(notificationId, note = null) {
    const notif = this.inMemoryStore.find(n => n.id === notificationId);
    if (notif) {
      notif.is_acknowledged = true;
      notif.is_read = true;
      notif.acknowledged_at = new Date().toISOString();
      notif.acknowledgement_note = note;
    }

    this._notifySubscribers();
    return notif;
  }

  async dismiss(notificationId) {
    const notif = this.inMemoryStore.find(n => n.id === notificationId);
    if (notif) {
      notif.is_dismissed = true;
    }

    this.inMemoryStore = this.inMemoryStore.filter(n => n.id !== notificationId);
    this._notifySubscribers();
  }

  // ─── Subscriptions & History Queries ──────────────────────
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.subscribers.add(callback);
      callback(this.inMemoryStore);
      return () => this.subscribers.delete(callback);
    }
    return () => {};
  }

  _notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb([...this.inMemoryStore]);
      } catch (err) {
        console.error('[NotificationEngine] Subscriber notification error:', err);
      }
    });
  }

  getHistory({ status = 'ALL', priority = 'ALL', department = 'ALL', search = '' } = {}) {
    let items = [...this.inMemoryStore];

    if (status === 'UNREAD') items = items.filter(n => !n.is_read && !n.is_dismissed);
    if (status === 'READ') items = items.filter(n => n.is_read && !n.is_dismissed);
    if (status === 'ACKNOWLEDGED') items = items.filter(n => n.is_acknowledged);
    if (status === 'DISMISSED') items = items.filter(n => n.is_dismissed);

    if (priority !== 'ALL') items = items.filter(n => n.priority === priority);
    if (department !== 'ALL') items = items.filter(n => n.department === department);

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(n =>
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.message && n.message.toLowerCase().includes(q)) ||
        (n.relatedOT && n.relatedOT.toLowerCase().includes(q))
      );
    }

    return items;
  }

  get unreadCount() {
    return this.inMemoryStore.filter(n => !n.is_read && !n.is_dismissed).length;
  }

  // Trigger Native Browser Push Permission Request
  async requestBrowserPushPermission() {
    return adapters.browserPush.requestPermission();
  }

  get browserPushPermissionState() {
    return adapters.browserPush.permissionState;
  }
}

export const notificationEngine = new NotificationEngine();
