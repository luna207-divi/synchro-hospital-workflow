import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';

class AppointmentService extends BaseService {
  constructor() {
    super('appointments');
  }

  async getAppointmentsDetailed({ date, doctorId, patientId } = {}) {
    try {
      let query = supabase.from('appointments').select(`
        *,
        patient:patients (patient_code, full_name, first_name, last_name, contact_phone),
        doctor:doctors (
          id,
          specialty,
          profile:profiles (display_name, job_title)
        ),
        department:departments (name, code)
      `).order('scheduled_start', { ascending: true });

      if (date) query = query.eq('scheduled_date', date);
      if (doctorId) query = query.eq('doctor_id', doctorId);
      if (patientId) query = query.eq('patient_id', patientId);

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[AppointmentService] getAppointmentsDetailed error:', err);
      return { data: [], error: err };
    }
  }
}

export const appointmentService = new AppointmentService();
