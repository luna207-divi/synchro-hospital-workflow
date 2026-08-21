import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';

class AdmissionService extends BaseService {
  constructor() {
    super('admissions');
  }

  async getAdmissionsDetailed({ status } = {}) {
    try {
      let query = supabase.from('admissions').select(`
        *,
        patient:patients (*),
        admitting_doctor:doctors (
          id,
          profile:profiles (display_name)
        ),
        bed:beds (
          id,
          bed_number,
          room:rooms (room_number, room_type, floor, wing)
        )
      `).order('admitted_at', { ascending: false });

      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[AdmissionService] getAdmissionsDetailed error:', err);
      return { data: [], error: err };
    }
  }
}

export const admissionService = new AdmissionService();
