import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowEngine, WORKFLOW_EVENTS, DEPARTMENTS } from '../services/workflowEngine';
import { useAuth } from '../context/AuthContext';

/* ============================================================
   SYNCHRO — Unified Workflow Engine React Hook
   Connects components to the single source of truth workflow state.
   ============================================================ */

export const useWorkflowEngine = (options = {}) => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const [liveEvents, setLiveEvents] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);

  const { patientId, surgeryId, department, limit = 50 } = options;

  // 1. Fetch persistent workflow history from database via TanStack Query
  const historyQuery = useQuery({
    queryKey: ['workflow-events', { patientId, surgeryId, department, limit }],
    queryFn: async () => {
      const res = await workflowEngine.getWorkflowHistory({ patientId, surgeryId, department, limit });
      if (res.error) throw res.error;
      return res.data;
    },
    refetchInterval: 15000,
  });

  // 2. Realtime listener with RBAC authorization filtering
  useEffect(() => {
    const unsub = workflowEngine.subscribe({
      role: role?.name || 'HOSPITAL_ADMIN',
      userId: user?.id || null,
      callback: (event) => {
        setLastEvent(event);
        setLiveEvents((prev) => [event, ...prev.slice(0, 49)]);

        // Invalidate relevant query keys so all dashboards update immediately
        queryClient.invalidateQueries({ queryKey: ['workflow-events'] });
        queryClient.invalidateQueries({ queryKey: ['surgeries'] });
        queryClient.invalidateQueries({ queryKey: ['cssd-packs'] });
        queryClient.invalidateQueries({ queryKey: ['theatres'] });
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['analytics'] });
      }
    });

    return () => unsub();
  }, [role, user, queryClient]);

  // Combined timeline of historical + live realtime events
  const timeline = [...liveEvents, ...(historyQuery.data || [])].filter((evt, idx, self) =>
    idx === self.findIndex((e) => e.event_id === evt.event_id)
  );

  // Transition Helper Handlers
  const dispatchPackToOT = useCallback(async (packId, theatreId, surgeryId = null) => {
    return workflowEngine.onPackDispatched(packId, theatreId, surgeryId, user?.id);
  }, [user]);

  const startSurgery = useCallback(async (surgeryId, theatreId = null) => {
    return workflowEngine.onSurgeryStarted(surgeryId, theatreId, user?.id);
  }, [user]);

  const completeSurgery = useCallback(async (surgeryId, theatreId = null) => {
    return workflowEngine.onSurgeryCompleted(surgeryId, theatreId, user?.id);
  }, [user]);

  const completeTurnover = useCallback(async (theatreId) => {
    return workflowEngine.onOTReady(theatreId, user?.id);
  }, [user]);

  return {
    events: timeline,
    lastEvent,
    isLoading: historyQuery.isLoading,
    refetchHistory: historyQuery.refetch,
    pendingOfflineCount: workflowEngine.pendingOfflineCount,
    
    // Core Workflow Pipeline Triggers
    recordEvent: workflowEngine.recordEvent.bind(workflowEngine),
    onPatientRegistered: workflowEngine.onPatientRegistered.bind(workflowEngine),
    onPatientAdmitted: workflowEngine.onPatientAdmitted.bind(workflowEngine),
    onTriageCompleted: workflowEngine.onTriageCompleted.bind(workflowEngine),
    onReadinessUpdated: workflowEngine.onReadinessUpdated.bind(workflowEngine),
    onConsultationCompleted: workflowEngine.onConsultationCompleted.bind(workflowEngine),
    onSurgeryScheduled: workflowEngine.onSurgeryScheduled.bind(workflowEngine),
    dispatchPackToOT,
    startSurgery,
    completeSurgery,
    completeTurnover,
    WORKFLOW_EVENTS,
    DEPARTMENTS
  };
};
