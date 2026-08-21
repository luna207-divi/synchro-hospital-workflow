import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surgeryService } from '../services/surgeryService';

export const useSurgeries = (filters = {}) => {
  return useQuery({
    queryKey: ['surgeries', filters],
    queryFn: async () => {
      const res = await surgeryService.getSurgeriesDetailed(filters);
      if (res.error) throw res.error;
      return res.data;
    },
    refetchInterval: 15000,
  });
};

export const useSurgery = (surgeryId) => {
  return useQuery({
    queryKey: ['surgery', surgeryId],
    queryFn: async () => {
      if (!surgeryId) return null;
      const res = await surgeryService.getById(surgeryId);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: !!surgeryId,
  });
};

export const useTransitionSurgery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ surgeryId, toStatus, blockReason, performedBy, notes }) => {
      const res = await surgeryService.transitionStatus(surgeryId, toStatus, {
        blockReason,
        performedBy,
        notes
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surgeries'] });
      queryClient.invalidateQueries({ queryKey: ['theatres'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
