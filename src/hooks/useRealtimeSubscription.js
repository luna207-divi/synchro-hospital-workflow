import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/* ============================================================
   SYNCHRO — Realtime Subscription Hook
   Subscribes to PostgreSQL database changes via Supabase Realtime
   and automatically invalidates target React Query caches when changes occur.
   ============================================================ */

export const useRealtimeSubscription = (table, queryKeysToInvalidate = [], event = '*') => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // If Supabase client isn't configured, skip gracefully
    if (!supabase || !supabase.channel) return;

    const channelName = `realtime_${table}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event, schema: 'public', table },
        (payload) => {
          // Invalidate relevant queries so UI re-renders with live DB state
          queryKeysToInvalidate.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Live sync connected
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryKeysToInvalidate, event, queryClient]);
};
