import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';

/* ============================================================
   SYNCHRO — Audit Trail Service
   Records & retrieves operational audit events:
   - who (user display name & role)
   - what (action description)
   - when (timestamp)
   - related record (entity type & ID)
   - action (category e.g., CSSD_ASSIGNED_PACK, DOCTOR_ACKNOWLEDGED_ALERT, etc.)
   ============================================================ */

class AuditService extends BaseService {
  constructor() {
    super('audit_logs');
  }

  // Get audit logs with joined profile info or fallback mock data
  async getAuditLogs({ limit = 50, action = 'ALL', search = '' } = {}) {
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          user:profiles (display_name, job_title, avatar_initials)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (action && action !== 'ALL') {
        query = query.eq('action', action);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formatted = (data || []).map(row => ({
        id: row.id,
        who: row.user?.display_name || 'System / Staff',
        role: row.user?.job_title || 'Hospital Staff',
        action: row.action || 'OPERATION',
        what: row.new_values?.description || row.old_values?.description || `Action: ${row.action}`,
        relatedRecord: row.entity_type ? `${row.entity_type.toUpperCase()}: ${row.entity_id?.slice(0, 8)}` : 'System',
        when: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + new Date(row.created_at).toLocaleDateString() : 'Just now',
        raw: row
      }));

      return { data: formatted, error: null };
    } catch (err) {
      console.warn('[AuditService] getAuditLogs error:', err);
      return { data: [], error: null };
    }
  }

  // Record an audit entry
  async logAction(userId, action, entityType, entityId, details = {}) {
    try {
      const { data, error } = await supabase.from('audit_logs').insert([{
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        new_values: details,
        created_at: new Date().toISOString()
      }]).select().single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.warn('[AuditService] logAction failed:', err);
      return { data: null, error: err };
    }
  }

  getMockAuditLogs() {
    return [];
  }
}

export const auditService = new AuditService();
