import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cssdService } from '../services/cssdService';
import { useWorkflow } from '../context/WorkflowContext';

export const useCssdPacks = (filters = {}) => {
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['cssd-packs', filters],
    queryFn: async () => {
      if (isDemoMode) {
        // support simple filters like status
        let data = workflow.cssd_packs || [];
        if (filters.status) data = data.filter(p => p.status === filters.status);
        return data;
      }
      const res = await cssdService.getPacksDetailed(filters);
      if (res.error) throw res.error;
      return res.data;
    },
  });
};

export const useDispatchPack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ packId, theatreId, surgeryId, performedBy }) => {
      const res = await cssdService.dispatchPack(packId, theatreId, surgeryId, performedBy);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cssd-packs'] });
      queryClient.invalidateQueries({ queryKey: ['theatres'] });
      queryClient.invalidateQueries({ queryKey: ['surgeries'] });
    },
  });
};
