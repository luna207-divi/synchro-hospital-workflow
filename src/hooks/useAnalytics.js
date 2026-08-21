import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useAnalytics = (dateRange = 'Last 7 Days', theatreFilter = 'All Theatres') => {
  return useQuery({
    queryKey: ['analytics', dateRange, theatreFilter],
    queryFn: async () => {
      // 1. Fetch OT utilization summary
      const { data: otData } = await supabase
        .from('operating_theatres')
        .select('id, suite_code, name, specialty, utilization, status');

      // 2. Fetch recent workflow delays
      const { data: alerts } = await supabase
        .from('alerts')
        .select('alert_type, title, severity')
        .limit(10);

      // Return synthesized analytics structure matching UI components
      return {
        otUtilization: otData || [],
        delayAlerts: alerts || [],
        hospitalAvgUtilization: 84.3,
        turnaroundAvgMinutes: 21.4,
        delaysAvoidedCount: 1,
        timeSavedMinutes: 28,
      };
    },
    refetchInterval: 30000,
  });
};
