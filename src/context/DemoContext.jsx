import React, { createContext, useContext, useState } from 'react';

/* ============================================================
   SYNCHRO — DEMO MODE STATE PROVIDER
   Connected End-to-End Scenario:
   Patient P-1024 • Lap Cholecystectomy • OT-02
   Initial: OT-02 BLOCKED (Pack #00421 stuck in Autoclave Cooldown)
   Re-assign Pack #00428 -> OT-02 READY -> Start Surgery -> SURGERY -> Analytics
   ============================================================ */

const DemoContext = createContext();

export const INITIAL_DEMO_STATE = {
  patientId: '',
  patientName: '',
  procedure: '',
  surgeon: '',
  assignedOT: '',
  patientReady: false,
  consentVerified: false,
  preOpCleared: false,
  
  // OT-02 Status: 'AVAILABLE' | 'BLOCKED' | 'READY' | 'SURGERY'
  ot2Status: 'AVAILABLE',
  ot2Pack: null,
  ot2BlockReason: null,
  
  // Available valid packs in CSSD
  availablePacks: [],

  // Animation & Toast State
  dispatchToast: null,
  isDispatching: false,

  // Analytics Metrics
  delaysAvoidedCount: 0,
  timeSavedMinutes: 0
};

export const DemoProvider = ({ children }) => {
  const [demoState, setDemoState] = useState(INITIAL_DEMO_STATE);

  // Action 1: Assign valid pack (CSSD-00428) to OT-02
  const assignPackToOT2 = (packId = 'CSSD-00428') => {
    setDemoState(prev => ({
      ...prev,
      isDispatching: true,
      dispatchToast: `🚀 DISPATCH ANIMATION: Pack ${packId} dispatched from CSSD Sterile Bay 2 → OT-02!`
    }));

    setTimeout(() => {
      setDemoState(prev => ({
        ...prev,
        ot2Status: 'READY',
        ot2Pack: packId,
        ot2BlockReason: null,
        isDispatching: false,
        delaysAvoidedCount: 1,
        timeSavedMinutes: 28,
        dispatchToast: `✓ OT-02 AUTOMATICALLY UPDATED TO READY — Pack ${packId} Verified in OT-02`
      }));
    }, 1200);
  };

  // Action 2: Start Surgery on OT-02
  const startSurgeryOT2 = () => {
    setDemoState(prev => ({
      ...prev,
      ot2Status: 'SURGERY',
      dispatchToast: `⚡ SURGERY STARTED: OT-02 status changed to IN SURGERY (Dr. K. Patel • Lap Cholecystectomy)`
    }));
  };

  // Action 3: Reset Demo Scenario
  const resetDemo = () => {
    setDemoState(INITIAL_DEMO_STATE);
  };

  const clearToast = () => {
    setDemoState(prev => ({ ...prev, dispatchToast: null }));
  };

  return (
    <DemoContext.Provider value={{
      demoState,
      assignPackToOT2,
      startSurgeryOT2,
      resetDemo,
      clearToast
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
