import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';

/* ============================================================
   SYNCHRO — Doctor-Specific Data Hooks
   
   Scoped queries filtered to the logged-in doctor's profile.
   - useDoctorProfile: resolves doctor record from auth profile
   - useDoctorPatients: patients assigned to this doctor
   - useDoctorSurgeries: surgeries where this doctor is lead surgeon
   - useDoctorAlerts: alerts relevant to doctor's departments/OTs
   ============================================================ */

// Get doctor record for the current authenticated user
export const useDoctorProfile = () => {
  const { user } = useAuth();
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['doctor-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      if (isDemoMode) {
        const doc = workflow.getDoctorByProfileId(user.id);
        if (!doc) return null;
        return { ...doc, profile: { display_name: doc.display_name } };
      }
      const { data, error } = await supabase
        .from('doctors')
        .select('*, profile:profiles(*)')
        .eq('profile_id', user.id)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });
};

// Get patients assigned to the logged-in doctor
export const useDoctorPatients = (doctorId) => {
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['doctor-patients', doctorId],
    queryFn: async () => {
      if (!doctorId) return [];
      if (isDemoMode) {
        const byDoctor = workflow.getPatientsByDoctor(doctorId) || [];
        // If no patients specifically assigned, fall back to full patient list for demo visibility
        if (byDoctor.length === 0) return workflow.patients || [];
        return byDoctor;
      }
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          assigned_bed:beds (
            bed_number,
            room:rooms (room_number, room_type, floor, wing)
          ),
          admissions:admissions (
            id, status, diagnosis, admitted_at
          ),
          consents:consents (
            id, consent_type, status, signed_at
          )
        `)
        .eq('assigned_doctor_id', doctorId)
        .neq('admission_status', 'DISCHARGED')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!doctorId,
    refetchInterval: 15000,
  });
};

// Get today's surgeries for the logged-in doctor
export const useDoctorSurgeries = (doctorId) => {
  const today = new Date().toISOString().split('T')[0];
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['doctor-surgeries', doctorId, today],
    queryFn: async () => {
      if (!doctorId) return [];
      if (isDemoMode) {
        const byDoctor = workflow.getSurgeriesByDoctor(doctorId) || [];
        if (byDoctor.length === 0) return workflow.surgeries || [];
        return byDoctor;
      }
      const { data, error } = await supabase
        .from('surgeries')
        .select(`
          *,
          patient:patients (id, patient_code, first_name, last_name, allergies, blood_group),
          theatre:operating_theatres (id, suite_code, name, status),
          cssd_packs:cssd_packs (id, pack_code, status)
        `)
        .eq('lead_surgeon_id', doctorId)
        .eq('scheduled_date', today)
        .order('scheduled_start', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!doctorId,
    refetchInterval: 10000,
  });
};

// Get alerts relevant to the doctor (their surgeries / OTs / departments)
export const useDoctorAlerts = (doctorId) => {
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['doctor-alerts', doctorId],
    queryFn: async () => {
      if (!doctorId) return [];
      if (isDemoMode) {
        const byDoctor = workflow.getAlertsForDoctor(doctorId) || [];
        if (byDoctor.length === 0) return workflow.alerts || [];
        return byDoctor;
      }
      // Get the doctor's active surgery theatre IDs
      const today = new Date().toISOString().split('T')[0];
      const { data: surgeries } = await supabase
        .from('surgeries')
        .select('theatre_id, patient_id')
        .eq('lead_surgeon_id', doctorId)
        .eq('scheduled_date', today);

      const theatreIds = (surgeries || []).map(s => s.theatre_id).filter(Boolean);
      const patientIds = (surgeries || []).map(s => s.patient_id).filter(Boolean);

      // Get alerts related to those theatres, patients, or OT department
      let query = supabase
        .from('alerts')
        .select('*, department:departments(name, pillar_color)')
        .in('status', ['ACTIVE', 'ACKNOWLEDGED'])
        .order('raised_at', { ascending: false })
        .limit(10);

      const { data, error } = await query;
      if (error) throw error;

      // Filter to relevant alerts
      const relevant = (data || []).filter(alert => {
        if (alert.related_entity_type === 'operating_theatre' && theatreIds.includes(alert.related_entity_id)) return true;
        if (alert.related_entity_type === 'patient' && patientIds.includes(alert.related_entity_id)) return true;
        if (alert.severity === 'CRITICAL') return true;
        if (alert.alert_type === 'OT_BLOCK' || alert.alert_type === 'CSSD_DELAY') return true;
        return false;
      });

      return relevant;
    },
    enabled: !!doctorId,
    refetchInterval: 10000,
  });
};

// Acknowledge an alert
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useMutation({
    mutationFn: async (alertId) => {
      if (isDemoMode) {
        workflow.acknowledgeAlert(alertId);
        return { id: alertId, status: 'ACKNOWLEDGED' };
      }
      const { data, error } = await supabase
        .from('alerts')
        .update({ status: 'ACKNOWLEDGED', acknowledged_at: new Date().toISOString() })
        .eq('id', alertId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
