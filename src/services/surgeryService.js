import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';
import { workflowEngine, DEPARTMENTS, WORKFLOW_EVENTS } from './workflowEngine';

class SurgeryService extends BaseService {
  constructor() {
    super('surgeries');
  }

  // Get surgeries with full joined details (patient, surgeon, theatre, cssd packs)
  async getSurgeriesDetailed({ date, status, theatreId, surgeonId } = {}) {
    try {
      let query = supabase.from('surgeries').select(`
        *,
        patient:patients (*),
        lead_surgeon:doctors (
          id,
          specialty,
          profile:profiles (display_name, job_title, avatar_initials)
        ),
        theatre:operating_theatres (*),
        cssd_packs:cssd_packs (*)
      `).order('scheduled_start', { ascending: true });

      if (date) {
        query = query.eq('scheduled_date', date);
      }
      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      }
      if (theatreId) {
        query = query.eq('theatre_id', theatreId);
      }
      if (surgeonId) {
        query = query.eq('lead_surgeon_id', surgeonId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[SurgeryService] getSurgeriesDetailed error:', err);
      return { data: [], error: err };
    }
  }

  // Transition surgery status & record workflow event via Workflow Engine
  async transitionStatus(surgeryId, toStatus, { blockReason, performedBy, notes } = {}) {
    try {
      // 1. Get current surgery state
      const { data: current } = await this.getById(surgeryId);
      const fromStatus = current ? current.status : null;

      // 2. Build update fields
      const updates = { status: toStatus, updated_at: new Date().toISOString() };
      if (toStatus === 'BLOCKED') {
        updates.block_reason = blockReason || 'Workflow blockage reported';
      } else if (fromStatus === 'BLOCKED' && toStatus !== 'BLOCKED') {
        updates.block_reason = null;
      }
      if (toStatus === 'IN_SURGERY' && !current?.actual_start) {
        updates.actual_start = new Date().toISOString();
      }
      if (toStatus === 'COMPLETED' && !current?.actual_end) {
        updates.actual_end = new Date().toISOString();
      }

      // 3. Update surgery
      const { data: updatedSurgery, error: updateErr } = await this.update(surgeryId, updates);
      if (updateErr) throw updateErr;

      // 4. Update operating theatre status if linked
      if (updatedSurgery.theatre_id) {
        let otStatus = 'READY';
        if (toStatus === 'IN_SURGERY') otStatus = 'IN_SURGERY';
        if (toStatus === 'BLOCKED') otStatus = 'BLOCKED';
        if (toStatus === 'POST_OP' || toStatus === 'COMPLETED') otStatus = 'TURNOVER';

        await supabase
          .from('operating_theatres')
          .update({
            status: otStatus,
            block_reason: toStatus === 'BLOCKED' ? updates.block_reason : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedSurgery.theatre_id);
      }

      // 5. Trigger Central Workflow Engine Event (Single Source of Truth Pipeline)
      if (toStatus === 'IN_SURGERY') {
        await workflowEngine.onSurgeryStarted(surgeryId, updatedSurgery.theatre_id, performedBy);
      } else if (toStatus === 'COMPLETED') {
        await workflowEngine.onSurgeryCompleted(surgeryId, updatedSurgery.theatre_id, performedBy);
      } else {
        await workflowEngine.recordEvent({
          patientId: updatedSurgery.patient_id,
          surgeryId: surgeryId,
          department: DEPARTMENTS.OT,
          eventType: WORKFLOW_EVENTS.STATUS_CHANGE,
          previousStatus: fromStatus,
          newStatus: toStatus,
          userId: performedBy,
          metadata: { notes, block_reason: updates.block_reason }
        });
      }

      return { data: updatedSurgery, error: null };
    } catch (err) {
      console.error('[SurgeryService] transitionStatus error:', err);
      return { data: null, error: err };
    }
  }
}

export const surgeryService = new SurgeryService();
