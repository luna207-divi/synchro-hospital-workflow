import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';
import { workflowEngine } from './workflowEngine';

class PatientService extends BaseService {
  constructor() {
    super('patients');
  }

  // Create new patient & trigger Front Desk workflow events
  async create(recordData) {
    const res = await super.create(recordData);
    if (res.data) {
      const patient = res.data;
      await workflowEngine.onPatientRegistered(patient.id, patient.assigned_doctor_id, {
        patient_code: patient.patient_code,
        full_name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
      });

      if (patient.admission_status === 'ADMITTED') {
        await workflowEngine.onPatientAdmitted(patient.id, null, patient.assigned_doctor_id, {
          patient_code: patient.patient_code
        });
      }
    } else {
      // Fallback workflow trigger
      await workflowEngine.onPatientRegistered(recordData.patient_code || 'P-NEW', null, recordData);
    }
    return res;
  }

  // Get patients with joined doctor and bed info
  async getPatientsDetailed({ status, doctorId, search } = {}) {
    try {
      let query = supabase.from('patients').select(`
        *,
        assigned_doctor:doctors (
          id,
          specialty,
          profile:profiles (display_name, job_title)
        ),
        assigned_bed:beds (
          id,
          bed_number,
          room:rooms (room_number, room_type, floor, wing)
        )
      `).order('updated_at', { ascending: false });

      if (status && status !== 'ALL') {
        query = query.eq('admission_status', status);
      }
      if (doctorId) {
        query = query.eq('assigned_doctor_id', doctorId);
      }
      if (search) {
        query = query.or(`patient_code.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[PatientService] getPatientsDetailed error:', err);
      return { data: [], error: err };
    }
  }

  // Get single patient readiness checklist
  async getPatientReadiness(patientId) {
    try {
      const { data, error } = await supabase
        .from('patient_readiness')
        .select('*')
        .eq('patient_id', patientId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[PatientService] getPatientReadiness error:', err);
      return { data: [], error: err };
    }
  }

  // Update readiness item & trigger READINESS_UPDATED event
  async updateReadinessCheck(readinessId, status, checkedBy) {
    try {
      const { data, error } = await supabase
        .from('patient_readiness')
        .update({
          status,
          checked_by: checkedBy,
          checked_at: new Date().toISOString()
        })
        .eq('id', readinessId)
        .select()
        .single();

      if (error) throw error;

      if (data?.patient_id) {
        await workflowEngine.onReadinessUpdated(data.patient_id, null, checkedBy, { readiness_item: data.check_name });
      }

      return { data, error: null };
    } catch (err) {
      console.error('[PatientService] updateReadinessCheck error:', err);
      return { data: null, error: err };
    }
  }
}

export const patientService = new PatientService();
