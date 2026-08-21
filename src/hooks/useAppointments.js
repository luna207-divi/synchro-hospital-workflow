import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';

export const useAppointments = (filters = {}) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      const res = await appointmentService.getAppointmentsDetailed(filters);
      if (res.error) throw res.error;
      return res.data;
    },
  });
};
