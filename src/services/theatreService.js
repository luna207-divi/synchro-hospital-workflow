import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';

class TheatreService extends BaseService {
  constructor() {
    super('operating_theatres');
  }

  // Get all theatres with active surgery and assigned CSSD packs
  async getTheatresDetailed() {
    try {
      const { data, error } = await supabase
        .from('operating_theatres')
        .select(`
          *,
          current_surgeries:surgeries (
            id,
            surgery_code,
            procedure_name,
            status,
            scheduled_start,
            scheduled_end,
            actual_start,
            patient:patients (patient_code, full_name, first_name, last_name),
            lead_surgeon:doctors (
              id,
              profile:profiles (display_name)
            )
          ),
          assigned_packs:cssd_packs (
            id,
            pack_code,
            pack_name,
            status,
            sterile_expiry,
            autoclave_id
          )
        `)
        .order('suite_code', { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[TheatreService] getTheatresDetailed error:', err);
      return { data: [], error: err };
    }
  }

  // Update suite status (READY, IN_SURGERY, TURNOVER, BLOCKED)
  async updateStatus(theatreId, status, blockReason = null) {
    try {
      const { data, error } = await supabase
        .from('operating_theatres')
        .update({
          status,
          block_reason: status === 'BLOCKED' ? blockReason : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', theatreId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[TheatreService] updateStatus error:', err);
      return { data: null, error: err };
    }
  }
}

export const theatreService = new TheatreService();
