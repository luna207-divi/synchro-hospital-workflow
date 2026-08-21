import { useQuery } from '@tanstack/react-query';
import { admissionService } from '../services/admissionService';

export const useAdmissions = (filters = {}) => {
  return useQuery({
    queryKey: ['admissions', filters],
    queryFn: async () => {
      const res = await admissionService.getAdmissionsDetailed(filters);
      if (res.error) throw res.error;
      return res.data;
    },
  });
};
