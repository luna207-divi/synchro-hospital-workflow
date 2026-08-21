import { QueryClient } from '@tanstack/react-query';

/* ============================================================
   SYNCHRO — TanStack Query Client Configuration
   
   Defaults tuned for hospital workflow data:
   - 30s staleTime: OT/CSSD data refreshes frequently
   - refetchOnWindowFocus: re-sync when staff returns to tab
   - 2 retries with exponential backoff
   ============================================================ */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
      retry: 2,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
