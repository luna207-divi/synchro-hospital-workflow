import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { supabase } from '../lib/supabase';
import { useWorkflow } from '../context/WorkflowContext';

export const useNotifications = (userId) => {
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (isDemoMode) {
        // Return notifications from centralized workflow demo data
        return workflow.notifications.filter(n => !n.is_dismissed && (!userId || n.user_id === userId)).sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,20);
      }
      const res = await notificationService.getAll({
        filters: userId ? { user_id: userId, is_dismissed: false } : { is_dismissed: false },
        orderBy: { column: 'created_at', ascending: false },
        limit: 20
      });
      if (res.error) throw res.error;
      return res.data;
    },
    refetchInterval: 10000,
  });
};

export const useUnreadCount = (userId) => {
  return useQuery({
    queryKey: ['unread-notifications-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const res = await notificationService.getUnreadCount(userId);
      if (res.error) throw res.error;
      return res.count;
    },
    enabled: !!userId,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useMutation({
    mutationFn: async (id) => {
      if (isDemoMode) {
        workflow.markNotificationRead(id);
        return { id, is_read: true };
      }
      const res = await notificationService.markAsRead(id);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const workflow = useWorkflow();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');
  return useMutation({
    mutationFn: async (userId) => {
      if (isDemoMode) {
        workflow.markAllNotificationsRead(userId);
        return { ok: true };
      }
      const res = await notificationService.markAllAsRead(userId);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    },
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*, department:departments (name, pillar_color)')
        .eq('status', 'ACTIVE')
        .order('raised_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000,
  });
};
