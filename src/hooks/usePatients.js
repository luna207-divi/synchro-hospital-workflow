import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patientService';

export const usePatients = (filters = {}) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: async () => {
      const res = await patientService.getPatientsDetailed(filters);
      if (res.error) throw res.error;
      return res.data;
    },
  });
};

export const usePatient = (patientId) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) return null;
      const res = await patientService.getById(patientId);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: !!patientId,
  });
};

export const usePatientReadiness = (patientId) => {
  return useQuery({
    queryKey: ['patient-readiness', patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const res = await patientService.getPatientReadiness(patientId);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: !!patientId,
  });
};

export const useUpdateReadiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ readinessId, status, checkedBy }) => {
      const res = await patientService.updateReadinessCheck(readinessId, status, checkedBy);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.patient_id) {
        queryClient.invalidateQueries({ queryKey: ['patient-readiness', data.patient_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
