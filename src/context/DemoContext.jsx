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
  patientId: 'P-1024',
  patientName: 'E. Rostova',
  procedure: 'Laparoscopic Cholecystectomy',
  surgeon: 'Dr. K. Patel',
  assignedOT: 'OT-02',
  patientReady: true,
  consentVerified: true,
  preOpCleared: true,
  
  // OT-02 Status: 'BLOCKED' | 'READY' | 'SURGERY'
  ot2Status: 'BLOCKED',
  ot2Pack: 'CSSD-00421',
  ot2BlockReason: 'Sterile pack #CSSD-00421 stuck in Autoclave #2 cooldown (18 min remaining)',
  
  // Available valid packs in CSSD
  availablePacks: [
    {
      id: 'CSSD-00428',
      name: 'Laparoscopic Cholecystectomy Pack B',
      status: 'STERILE',
      location: 'CSSD Sterile Bay 2',
      autoclave: 'Autoclave #1 Verified',
      expiry: 'Valid (22h left)',
      available: true
    },
    {
      id: 'CSSD-00435',
      name: 'General Abdominal Tray',
      status: 'STERILE',
      location: 'CSSD Sterile Bay 4',
      autoclave: 'Autoclave #3 Verified',
      expiry: 'Valid (36h left)',
      available: true
    }
  ],

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
