import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { theatreService } from '../services/theatreService';
import { useWorkflow } from '../context/WorkflowContext';

export const useTheatres = () => {
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['theatres'],
    queryFn: async () => {
      if (isDemoMode) return workflow.operatingTheatres || [];
      const res = await theatreService.getTheatresDetailed();
      if (res.error) throw res.error;
      return res.data;
    },
    refetchInterval: 10000, // 10s polling safety net
  });
};

export const useTheatre = (theatreId) => {
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['theatre', theatreId],
    queryFn: async () => {
      if (!theatreId) return null;
      if (isDemoMode) return workflow.operatingTheatres.find(t => t.id === theatreId) || null;
      const res = await theatreService.getById(theatreId);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: !!theatreId,
  });
};

export const useUpdateTheatreStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ theatreId, status, blockReason }) => {
      const res = await theatreService.updateStatus(theatreId, status, blockReason);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theatres'] });
      queryClient.invalidateQueries({ queryKey: ['surgeries'] });
    },
  });
};
