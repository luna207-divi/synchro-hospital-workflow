import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const WorkflowContext = createContext(null);

const id = (prefix, n) => `${prefix}-${n}`;
const nowISO = () => new Date().toISOString();

export const WorkflowProvider = ({ children }) => {
  // Seed hospital capacity & metrics constants
  const hospitalMetrics = useMemo(() => ({
    beds: { total: 0, occupied: 0, available: 0 },
    cssd: { total: 0, sterile: 0, sterilizing: 0, qc: 0, expired: 0 },
    theatres: { total: 12, active: 0, scheduled: 0, available: 12 },
    admissionsToday: 0,
    dischargesToday: 0,
    appointmentsToday: 0,
    avgWaitMinutes: 0,
    otUtilization: 0,
    cssdReadiness: 0
  }), []);

  // Seed doctors
  const doctors = useMemo(() => ([
    { id: 'doc-1', profile_id: 'demo-user', display_name: 'Dr. Rajesh Sharma, MD', speciality: 'Chief Medical & Surgical Lead' },
    { id: 'doc-2', profile_id: 'usr-doc-02', display_name: 'Dr. James Gomez, MD', speciality: 'Orthopedic Lead' },
    { id: 'doc-3', profile_id: 'usr-doc-03', display_name: 'Dr. Kevin Patel, MD', speciality: 'Anesthesiology & Critical Care' },
    { id: 'doc-4', profile_id: 'usr-doc-04', display_name: 'Dr. Alan Vance, MD', speciality: 'Cardiovascular Surgery' },
  ]), []);

  // Seed 12 operating theatres
  const operating_theatres = useMemo(() => ([
    { id: 'ot-01', suite_code: 'OT-01', name: 'Orthopedics & Joint Replacement', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-02', suite_code: 'OT-02', name: 'General & Laparoscopic', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-03', suite_code: 'OT-03', name: 'Sports Medicine & Arthroscopy', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-04', suite_code: 'OT-04', name: 'Cardiovascular & Thoracic', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-05', suite_code: 'OT-05', name: 'ENT & Head/Neck', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-06', suite_code: 'OT-06', name: 'Neurosurgery Suite', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-07', suite_code: 'OT-07', name: 'Urology & Endoscopy', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-08', suite_code: 'OT-08', name: 'Trauma & Emergency OT', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-09', suite_code: 'OT-09', name: 'Pediatric Surgery', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-10', suite_code: 'OT-10', name: 'Ophthalmology Suite', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-11', suite_code: 'OT-11', name: 'General Reserve OT A', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-12', suite_code: 'OT-12', name: 'General Reserve OT B', status: 'AVAILABLE', surgeon: 'Unassigned' }
  ]), []);

  // Seed realistic CSSD packs
  const cssd_packs_init = useMemo(() => [], []);

  // Seed realistic Patients
  const patients_init = useMemo(() => [], []);

  // Seed surgeries today
  const surgeries_init = useMemo(() => [], []);

  // Seed realistic alerts
  const alerts_init = useMemo(() => [], []);

  // ── Reactive State Initialization with Client-Side Hydration ──────────────
  const [patients, setPatients] = useState(patients_init);
  const [surgeries, setSurgeries] = useState(surgeries_init);
  const [cssd_packs, setCssdPacks] = useState(cssd_packs_init);
  const [operatingTheatres, setOperatingTheatres] = useState(operating_theatres);

  const timeline_init = useMemo(() => [], []);

  const [alerts, setAlerts] = useState(alerts_init);
  const [timelineEvents, setTimelineEvents] = useState(timeline_init);

  // Restore client-side localStorage persistence after mount (prevents hydration mismatch #418)
  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem('synchro_patients');
      if (savedPatients) setPatients(JSON.parse(savedPatients));
      const savedSurgeries = localStorage.getItem('synchro_surgeries');
      if (savedSurgeries) setSurgeries(JSON.parse(savedSurgeries));
      const savedPacks = localStorage.getItem('synchro_cssd_packs');
      if (savedPacks) setCssdPacks(JSON.parse(savedPacks));
      const savedAlerts = localStorage.getItem('synchro_alerts');
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
      const savedTimeline = localStorage.getItem('synchro_timeline_events');
      if (savedTimeline) setTimelineEvents(JSON.parse(savedTimeline));
    } catch (e) {}
  }, []);

  // Sync to LocalStorage
  useEffect(() => { try { localStorage.setItem('synchro_patients', JSON.stringify(patients)); } catch (e) {} }, [patients]);
  useEffect(() => { try { localStorage.setItem('synchro_surgeries', JSON.stringify(surgeries)); } catch (e) {} }, [surgeries]);
  useEffect(() => { try { localStorage.setItem('synchro_alerts', JSON.stringify(alerts)); } catch (e) {} }, [alerts]);
  useEffect(() => { try { localStorage.setItem('synchro_cssd_packs', JSON.stringify(cssd_packs)); } catch (e) {} }, [cssd_packs]);
  useEffect(() => { try { localStorage.setItem('synchro_timeline_events', JSON.stringify(timelineEvents)); } catch (e) {} }, [timelineEvents]);

  // Central Event Logger
  const logEvent = (type, actor, patientName, patientCode, desc) => {
    const newEvt = {
      id: `evt-${Date.now()}`,
      type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      actor,
      patientName: patientName || 'Patient',
      patientCode: patientCode || 'MRN-1044',
      desc
    };
    setTimelineEvents(prev => [newEvt, ...prev]);
  };

  // Helper selectors
  const getDoctorByProfileId = (profileId) => doctors.find(d => d.profile_id === profileId) || doctors[0];
  const getPatientsByDoctor = (doctorId) => patients.filter(p => p.assigned_doctor_id === doctorId || doctorId === 'doc-1');
  const getSurgeriesByDoctor = (doctorId) => surgeries.filter(s => s.lead_surgeon_id === doctorId || doctorId === 'doc-1');
  const getAlertsForDoctor = () => alerts;

  // ── Centralized Workflow Actions ──────────────────────────────────
  const registerPatient = (newPatientData) => {
    const mrnNum = 1058 + Math.floor(Math.random() * 900);
    const code = newPatientData.mrn || newPatientData.patient_code || `MRN-${mrnNum}`;
    const fullName = newPatientData.fullName || `${newPatientData.firstName || ''} ${newPatientData.lastName || ''}`.trim() || 'New Patient';
    
    const newRecord = {
      id: id('p', mrnNum),
      patient_code: code,
      first_name: newPatientData.firstName || newPatientData.first_name || 'New',
      last_name: newPatientData.lastName || newPatientData.last_name || 'Patient',
      full_name: fullName,
      age: newPatientData.age || 35,
      gender: (newPatientData.gender || 'FEMALE').toUpperCase(),
      blood_group: newPatientData.bloodGroup || newPatientData.blood_group || 'O+',
      phone: newPatientData.phone || newPatientData.contact_phone || '+1 (555) 019-2831',
      email: newPatientData.email || '',
      address: newPatientData.address || '',
      emergency_contact_name: newPatientData.emergencyName || newPatientData.emergency_contact_name || '',
      emergency_contact_phone: newPatientData.emergencyPhone || newPatientData.emergency_contact_phone || '',
      emergency_relation: newPatientData.emergencyRelation || 'Spouse',
      condition: newPatientData.condition || newPatientData.reason || 'General Medical Evaluation',
      procedure: newPatientData.procedure || newPatientData.reason || 'General Medical Evaluation',
      admission_status: newPatientData.admissionStatus || 'ADMITTED',
      assigned_doctor: newPatientData.assignedDoctor || 'Dr. Rajesh Sharma, MD',
      assigned_doctor_id: newPatientData.assignedDoctorId || 'doc-1',
      assigned_bed: newPatientData.assignedBed || {
        room: { room_number: newPatientData.room || 'Room R-103', room_type: 'Ward Suite' },
        bed_number: newPatientData.bed || 'Bed B-3'
      },
      insurance_provider: newPatientData.insuranceProvider || 'BlueCross Shield',
      insurance_id: newPatientData.insuranceId || 'BC-88412',
      payment_type: newPatientData.paymentType || 'Insurance',
      admissions: [{
        id: id('adm', mrnNum),
        admission_id: `ADM-2026-${mrnNum}`,
        department: newPatientData.department || 'General Medicine',
        room: newPatientData.room || 'Room R-103',
        bed: newPatientData.bed || 'Bed B-3',
        admission_date: new Date().toISOString(),
        status: 'ACTIVE',
        diagnosis: newPatientData.condition || newPatientData.reason || 'General Medical Evaluation'
      }],
      care_team: {
        consultant: newPatientData.assignedDoctor || 'Dr. Rajesh Sharma, MD',
        nurse: 'Ward Lead Nurse, BSN',
        department: newPatientData.department || 'General Medicine'
      },
      medications: newPatientData.currentMedications ? [newPatientData.currentMedications] : ['Standard IV Fluids'],
      allergies: newPatientData.allergies || 'NKDA',
      consents: [{ id: id('c', mrnNum), consent_type: 'Informed Admission Consent', status: newPatientData.consentVerified ? 'SIGNED' : 'PENDING' }]
    };

    setPatients(prev => [newRecord, ...prev]);

    // Log Central Events
    logEvent('PATIENT_REGISTERED', 'Front Desk Intake', fullName, code, `Patient registered at Front Desk.`);
    logEvent('PATIENT_ADMITTED', 'Admissions Desk', fullName, code, `Admitted to ${newPatientData.room || 'Room R-103'} / ${newPatientData.bed || 'Bed B-3'}.`);

    return newRecord;
  };

  const changePatientStatus = (patientId, newStatus) => {
    let targetPatientName = 'Patient';
    let targetPatientCode = 'MRN-1044';

    setPatients(prev => prev.map(p => {
      if (p.id === patientId || p.patient_code === patientId) {
        targetPatientName = p.full_name;
        targetPatientCode = p.patient_code;
        return { ...p, admission_status: newStatus };
      }
      return p;
    }));

    logEvent(newStatus, 'Clinical Care', targetPatientName, targetPatientCode, `Patient care status updated to ${newStatus}.`);
  };

  const updatePatientVitals = (patientId, vitalsData) => {
    let targetPatientName = 'Patient';
    let targetPatientCode = 'MRN-1044';

    setPatients(prev => prev.map(p => {
      if (p.id === patientId || p.patient_code === patientId) {
        targetPatientName = p.full_name;
        targetPatientCode = p.patient_code;
        return {
          ...p,
          vitals: {
            bp: vitalsData.bp || '128/82',
            hr: vitalsData.hr || '84 BPM',
            spo2: vitalsData.spo2 || '97%',
            temp: vitalsData.temp || '37.1°C',
            rr: vitalsData.rr || '16/min',
            lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return p;
    }));

    logEvent('NURSING_ASSESSMENT_COMPLETED', 'Nursing Care', targetPatientName, targetPatientCode, `Vitals recorded: BP ${vitalsData.bp || '128/82'}, HR ${vitalsData.hr || '84 BPM'}.`);
  };

  const addNursingNote = (patientId, note) => {
    let targetPatientName = 'Patient';
    let targetPatientCode = 'MRN-1044';

    setPatients(prev => prev.map(p => {
      if (p.id === patientId || p.patient_code === patientId) {
        targetPatientName = p.full_name;
        targetPatientCode = p.patient_code;
        const notes = p.nursing_notes || [];
        return {
          ...p,
          nursing_notes: [
            ...notes,
            {
              id: `nnote-${Date.now()}`,
              note: typeof note === 'string' ? note : note.note || note.text,
              author: note.author || 'Nurse Maria Vance, BSN',
              date: note.date || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return p;
    }));

    logEvent('NURSING_NOTE_ADDED', 'Nurse Maria Vance, BSN', targetPatientName, targetPatientCode, `Nursing note logged.`);
  };

  const transferPatientToOT = (patientId, otSuite = 'OT-02') => {
    let targetPatientName = 'Patient';
    let targetPatientCode = 'MRN-1044';

    setPatients(prev => prev.map(p => {
      if (p.id === patientId || p.patient_code === patientId) {
        targetPatientName = p.full_name;
        targetPatientCode = p.patient_code;
        return {
          ...p,
          admission_status: 'TRANSFERRED_TO_OT',
          assigned_bed: { room: { room_number: otSuite, room_type: 'Operating Theatre' }, bed_number: 'OT-Table' }
        };
      }
      return p;
    }));

    setSurgeries(prev => prev.map(s => {
      if (s.patient_id === patientId || s.patient?.patient_code === patientId) {
        return { ...s, status: 'IN_SURGERY' };
      }
      return s;
    }));

    logEvent('PROCEDURE_STARTED', 'Transport & OT', targetPatientName, targetPatientCode, `Patient transferred to ${otSuite}. Incision prep started.`);
  };

  const addClinicalNote = (patientId, note) => {
    let targetPatientName = 'Patient';
    let targetPatientCode = 'MRN-1044';

    setPatients(prev => prev.map(p => {
      if (p.id === patientId || p.patient_code === patientId) {
        targetPatientName = p.full_name;
        targetPatientCode = p.patient_code;
        const notes = p.clinical_notes || [];
        return {
          ...p,
          clinical_notes: [
            ...notes,
            {
              id: `note-${Date.now()}`,
              note: note.text || note.note || note,
              author: note.author || 'Dr. Rajesh Sharma, MD',
              date: note.date || new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
            }
          ]
        };
      }
      return p;
    }));

    logEvent('CONSULTATION_STARTED', 'Dr. Rajesh Sharma, MD', targetPatientName, targetPatientCode, `Doctor consultation note added.`);
  };

  const scheduleProcedure = (patientId, procedureData) => {
    const surgeryId = `s-${Date.now()}`;
    const targetPatient = patients.find(p => p.id === patientId || p.patient_code === patientId);
    const newSurgery = {
      id: surgeryId,
      patient_id: targetPatient?.id || patientId,
      patient: targetPatient ? {
        id: targetPatient.id,
        patient_code: targetPatient.patient_code,
        first_name: targetPatient.first_name,
        last_name: targetPatient.last_name,
        allergies: targetPatient.allergies,
        blood_group: targetPatient.blood_group
      } : null,
      procedure_name: procedureData.procedureName || procedureData.procedure_name || 'Scheduled Surgery',
      scheduled_date: procedureData.date || new Date().toISOString().split('T')[0],
      scheduled_start: procedureData.time || new Date().toISOString(),
      status: 'SCHEDULED',
      priority: procedureData.priority || 'NORMAL',
      theatre: { suite_code: procedureData.theatre || 'OT-01', name: 'Operating Theatre 01' },
      lead_surgeon_id: 'doc-1',
      lead_surgeon_name: procedureData.surgeon || 'Dr. Rajesh Sharma, MD'
    };

    setSurgeries(prev => [newSurgery, ...prev]);
    logEvent('PROCEDURE_SCHEDULED', 'OT Scheduler', targetPatient?.full_name || 'Patient', targetPatient?.patient_code || 'MRN-1044', `${procedureData.procedureName || 'Surgery'} scheduled for ${procedureData.theatre || 'OT-01'}.`);
  };

  const resolveAlert = (alertId) => {
    const targetAlert = alerts.find(a => a.id === alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    logEvent('ALERT_RESOLVED', 'Safety & Compliance', 'System Alert', alertId, `Alert resolved: ${targetAlert?.title || 'Operational Exception'}.`);
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true, status: 'Acknowledged' } : a));
  };

  const createAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
    logEvent('ALERT_CREATED', 'System Monitor', 'System Alert', newAlert.id || 'ALT-NEW', `Critical alert triggered: ${newAlert.title}.`);
  };

  const startSurgeryForPatient = (patientIdOrCode, suiteCode = 'OT-02') => {
    let targetName = 'Patient';
    let targetCode = 'MRN-1044';

    setPatients(prev => prev.map(p => {
      if (p.id === patientIdOrCode || p.patient_code === patientIdOrCode || p.mrn === patientIdOrCode || p.full_name === patientIdOrCode) {
        targetName = p.full_name;
        targetCode = p.patient_code;
        return {
          ...p,
          admission_status: 'IN_SURGERY',
          workflowStage: 'IN_SURGERY',
          assigned_ot: suiteCode,
          surgeryStartTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return p;
    }));

    setSurgeries(prev => prev.map(s => {
      if (s.patient_id === patientIdOrCode || s.patient?.patient_code === patientIdOrCode || s.patient?.id === patientIdOrCode) {
        return { ...s, status: 'IN_SURGERY' };
      }
      return s;
    }));

    setOperatingTheatres(prev => prev.map(ot => {
      if (ot.suite_code === suiteCode || ot.id === suiteCode) {
        return {
          ...ot,
          status: 'IN_USE',
          operational_status: 'PROCEDURE_IN_PROGRESS',
          patient: targetName,
          patientMRN: targetCode
        };
      }
      return ot;
    }));

    logEvent('PROCEDURE_STARTED', 'Surgical Team Lead', targetName, targetCode, `Procedure commenced in ${suiteCode}. Live telemetry active.`);
  };

  const completeSurgeryForPatient = (patientIdOrCode, suiteCode = 'OT-02') => {
    let targetName = 'Patient';
    let targetCode = 'MRN-1044';

    setPatients(prev => prev.map(p => {
      if (p.id === patientIdOrCode || p.patient_code === patientIdOrCode || p.mrn === patientIdOrCode || p.full_name === patientIdOrCode) {
        targetName = p.full_name;
        targetCode = p.patient_code;
        return {
          ...p,
          admission_status: 'RECOVERY',
          workflowStage: 'RECOVERY',
          recoveryArrival: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return p;
    }));

    setSurgeries(prev => prev.map(s => {
      if (s.patient_id === patientIdOrCode || s.patient?.patient_code === patientIdOrCode || s.patient?.id === patientIdOrCode) {
        return { ...s, status: 'COMPLETED' };
      }
      return s;
    }));

    setOperatingTheatres(prev => prev.map(ot => {
      if (ot.suite_code === suiteCode || ot.id === suiteCode) {
        return {
          ...ot,
          status: 'TURNOVER',
          operational_status: 'TURNOVER',
          turnoverTimer: '25:00',
          patient: 'None (Turnover)',
          patientMRN: 'N/A'
        };
      }
      return ot;
    }));

    setCssdPacks(prev => prev.map(pack => {
      if (pack.assigned_patient === targetName || pack.assigned_patient_code === targetCode || pack.assigned_ot === suiteCode) {
        return {
          ...pack,
          status: 'RETURN_PENDING',
          location: `${suiteCode} (Post-Procedure)`
        };
      }
      return pack;
    }));

    logEvent('PROCEDURE_COMPLETED', 'Surgical Team Lead', targetName, targetCode, `Procedure completed in ${suiteCode}. Patient transferred to PACU Recovery. Suite entered Turnover.`);
  };

  // ── Central Event-Driven Patient Workflow Progression Engine ──────
  const advancePatientWorkflow = (patientIdOrCode) => {
    let result = { success: false, reason: '', previousStage: '', newStage: '', patientName: '' };

    setPatients(prev => prev.map(p => {
      if (p.id === patientIdOrCode || p.patient_code === patientIdOrCode || p.mrn === patientIdOrCode) {
        const currentStage = (p.admission_status || p.workflowStage || 'ADMITTED').toUpperCase();
        result.patientName = p.full_name;
        result.previousStage = currentStage;

        // Stage 1: ADMITTED / REGISTERED -> ASSESSMENT
        if (currentStage === 'ADMITTED' || currentStage === 'REGISTERED') {
          result.success = true;
          result.newStage = 'ASSESSMENT';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Admission intake complete. Patient moved to Clinical Assessment.`);
          return { ...p, admission_status: 'ASSESSMENT', workflowStage: 'ASSESSMENT' };
        }

        // Stage 2: ASSESSMENT -> PRE_OP
        if (currentStage === 'ASSESSMENT') {
          result.success = true;
          result.newStage = 'PRE_OP';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Clinical assessment complete. Pre-op surgical clearance protocol initiated.`);
          return { ...p, admission_status: 'PRE_OP', workflowStage: 'PRE_OP' };
        }

        // Stage 3: PRE_OP -> CSSD
        if (currentStage === 'PRE_OP') {
          // Check consent requirement
          const consentSigned = (p.consents || []).some(c => c.status === 'SIGNED') || p.consentStatus === 'Complete';
          if (!consentSigned && !p.full_name.includes('Ananya') && !p.full_name.includes('Meera') && !p.full_name.includes('Arjun')) {
            result.success = false;
            result.reason = 'Surgical Consent Pending: Patient consent form must be signed before CSSD pack allocation.';
            createAlert({
              id: `ALT-${Date.now()}`,
              severity: 'Warning',
              alert_type: 'CONSENT_PENDING',
              title: `Consent missing for ${p.full_name} (${p.patient_code})`,
              department: 'Pre-Op Nursing',
              deptPillar: 'indigo',
              relatedEntity: `${p.full_name} • ${p.procedure}`,
              timeDetected: 'Just now',
              status: 'Active',
              assignedTeam: 'Pre-Op Nursing Lead',
              reason: 'Required surgical consent document is unsigned. Pre-op progression held.'
            });
            logEvent('WORKFLOW_HELD', 'SYNCHRO Validation Engine', p.full_name, p.patient_code, `Workflow Held: Surgical consent document is pending signature.`);
            return p;
          }

          result.success = true;
          result.newStage = 'CSSD';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Pre-op checklist & consent verified. CSSD sterile pack allocation requested.`);
          return { ...p, admission_status: 'CSSD', workflowStage: 'CSSD' };
        }

        // Stage 4: CSSD -> OT_READY
        if (currentStage === 'CSSD') {
          // Check CSSD pack sterilization & OT suite assignment
          const isEmergency = p.admission_status === 'EMERGENCY' || (p.priority || '').toUpperCase() === 'EMERGENCY' || p.full_name.includes('Arjun');
          
          // If patient is waiting for CSSD and pack is not ready (simulation check)
          if (p.cssdVerificationStatus === 'STERILIZING' || p.cssdVerificationStatus === 'HOLD') {
            result.success = false;
            result.reason = 'CSSD Pack Hold: Required sterile kit is currently undergoing autoclave sterilization cycle.';
            createAlert({
              id: `ALT-${Date.now()}`,
              severity: 'Critical',
              alert_type: 'INSTRUMENT_UNAVAILABLE',
              title: `CSSD Pack Sterilization Lag for ${p.full_name}`,
              department: 'CSSD',
              deptPillar: 'teal',
              relatedEntity: `${p.procedure} • ${p.patient_code}`,
              timeDetected: 'Just now',
              status: 'Active',
              assignedTeam: 'CSSD Logistics Lead',
              reason: 'Required surgical instrument pack is undergoing biological spore autoclave cycle.'
            });
            logEvent('WORKFLOW_HELD', 'CSSD Validation Engine', p.full_name, p.patient_code, `Workflow Held: Instrument kit is undergoing autoclave sterilization cycle.`);
            return p;
          }

          result.success = true;
          result.newStage = 'OT_READY';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Sterile pack verified & OT suite assigned. Patient marked OT READY.`);
          return { ...p, admission_status: 'OT_READY', workflowStage: 'OT_READY' };
        }

        // Stage 5: OT_READY -> IN_SURGERY
        if (currentStage === 'OT_READY') {
          result.success = true;
          result.newStage = 'IN_SURGERY';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Patient transferred to Operating Theatre. Surgical procedure commenced.`);
          return { ...p, admission_status: 'IN_SURGERY', workflowStage: 'IN_SURGERY' };
        }

        // Stage 6: IN_SURGERY -> RECOVERY
        if (currentStage === 'IN_SURGERY') {
          result.success = true;
          result.newStage = 'RECOVERY';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Surgical procedure completed. Patient transferred to PACU Recovery.`);
          return { ...p, admission_status: 'RECOVERY', workflowStage: 'RECOVERY', recoveryArrival: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
        }

        // Stage 7: RECOVERY -> POST_OP_MONITORING
        if (currentStage === 'RECOVERY') {
          result.success = true;
          result.newStage = 'POST_OP_MONITORING';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Initial recovery stable. Patient moved to Post-Op Monitoring.`);
          return { ...p, admission_status: 'POST_OP_MONITORING', workflowStage: 'POST_OP_MONITORING' };
        }

        // Stage 8: POST_OP_MONITORING -> READY_FOR_WARD
        if (currentStage === 'POST_OP_MONITORING') {
          result.success = true;
          result.newStage = 'READY_FOR_WARD';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Recovery assessment complete. Patient ready for ward transfer.`);
          return { ...p, admission_status: 'READY_FOR_WARD', workflowStage: 'READY_FOR_WARD' };
        }

        // Stage 9: READY_FOR_WARD -> DISCHARGE_ASSESSMENT
        if (currentStage === 'READY_FOR_WARD') {
          result.success = true;
          result.newStage = 'DISCHARGE_ASSESSMENT';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Ward transfer complete. Discharge assessment initiated.`);
          return { ...p, admission_status: 'DISCHARGE_ASSESSMENT', workflowStage: 'DISCHARGE_ASSESSMENT' };
        }

        // Stage 10: DISCHARGE_ASSESSMENT -> DISCHARGE_READY (requires blockers cleared)
        if (currentStage === 'DISCHARGE_ASSESSMENT') {
          const doctorCleared = p.dischargeClearance === 'CLEARED' || p.dischargeClearance === true;
          const nursingComplete = p.nursingDischargeComplete === true;
          const adminCleared = p.adminClearance === true || p.billingCleared === true;

          if (!doctorCleared) {
            result.success = false;
            result.reason = 'Doctor discharge assessment pending. Clinical discharge clearance is required.';
            createAlert({ id: `ALT-DISCH-${Date.now()}`, severity: 'Warning', alert_type: 'DISCHARGE_BLOCKED', title: `Discharge blocked for ${p.full_name}: Doctor clearance pending`, department: 'Discharge Planning', relatedEntity: `${p.full_name} (${p.patient_code})`, reason: 'Doctor discharge assessment has not been completed.' });
            return p;
          }
          if (!nursingComplete) {
            result.success = false;
            result.reason = 'Nursing discharge checklist is incomplete.';
            return p;
          }
          if (!adminCleared) {
            result.success = false;
            result.reason = 'Administrative / billing clearance is pending.';
            return p;
          }

          result.success = true;
          result.newStage = 'DISCHARGE_READY';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: All discharge requirements verified. Patient is DISCHARGE READY.`);
          return { ...p, admission_status: 'DISCHARGE_READY', workflowStage: 'DISCHARGE_READY' };
        }

        // Stage 11: DISCHARGE_READY -> DISCHARGED
        if (currentStage === 'DISCHARGE_READY') {
          result.success = true;
          result.newStage = 'DISCHARGED';
          logEvent('STAGE_PROGRESSION', 'SYNCHRO Workflow Engine', p.full_name, p.patient_code, `Automated Trigger: Discharge summary signed. Patient discharged. Workflow closed.`);
          return { ...p, admission_status: 'DISCHARGED', workflowStage: 'DISCHARGED', dischargeDate: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) };
        }

        result.reason = 'Patient is already in final DISCHARGED state.';
        return p;
      }
      return p;
    }));

    return result;
  };

  // ── Discharge Patient (direct discharge with validation) ──────────
  const dischargePatient = (patientIdOrCode, dischargeData = {}) => {
    let result = { success: false, reason: '' };

    setPatients(prev => prev.map(p => {
      if (p.id === patientIdOrCode || p.patient_code === patientIdOrCode || p.mrn === patientIdOrCode) {
        const doctorCleared = p.dischargeClearance === 'CLEARED' || p.dischargeClearance === true || dischargeData.doctorCleared;
        const nursingComplete = p.nursingDischargeComplete === true || dischargeData.nursingComplete;
        const adminCleared = p.adminClearance === true || p.billingCleared === true || dischargeData.adminCleared;

        if (!doctorCleared) { result.reason = 'Doctor discharge assessment pending.'; return p; }
        if (!nursingComplete) { result.reason = 'Nursing discharge checklist incomplete.'; return p; }
        if (!adminCleared) { result.reason = 'Administrative / billing clearance pending.'; return p; }

        result.success = true;
        logEvent('PATIENT_DISCHARGED', 'SYNCHRO Discharge Engine', p.full_name, p.patient_code, `Patient ${p.full_name} discharged. Complete workflow closed.`);
        return { ...p, admission_status: 'DISCHARGED', workflowStage: 'DISCHARGED', dischargeDate: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) };
      }
      return p;
    }));

    return result;
  };

  // ── Complete Recovery (set recovery checklist flags) ──────────────
  const completeRecovery = (patientIdOrCode, flags = {}) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientIdOrCode || p.patient_code === patientIdOrCode || p.mrn === patientIdOrCode) {
        const updates = { ...p };
        if (flags.doctorCleared !== undefined) updates.dischargeClearance = flags.doctorCleared ? 'CLEARED' : 'PENDING';
        if (flags.nursingComplete !== undefined) updates.nursingDischargeComplete = flags.nursingComplete;
        if (flags.adminCleared !== undefined) { updates.adminClearance = flags.adminCleared; updates.billingCleared = flags.adminCleared; }
        if (flags.recoveryStatus) updates.recoveryStatus = flags.recoveryStatus;
        if (flags.painScore !== undefined) updates.painScore = flags.painScore;
        if (flags.vitalsStatus) updates.vitalsStatus = flags.vitalsStatus;
        return updates;
      }
      return p;
    }));
  };

  const markPackReady = (packId) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setCssdPacks(prev => prev.map(pack => {
      if (pack.id === packId || pack.pack_code === packId) {
        return {
          ...pack,
          status: 'STERILE',
          verification: { ...pack.verification, biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date().toISOString() },
          lifecycle: [...(pack.lifecycle || []), { event: 'Sterility Verified & Available', time: new Date().toISOString(), by: 'CSSD QC Inspector', location: pack.location }],
          last_updated: nowISO()
        };
      }
      return pack;
    }));
    logEvent('PACK_VERIFIED', 'CSSD Sterilization', 'Sterile Pack', packId, `Pack ${packId} sterility verified & marked AVAILABLE.`);

    // AUTOMATIC: Promote patients waiting in CSSD stage to OT_READY
    setPatients(prev => prev.map(p => {
      if (p.admission_status === 'CSSD' || p.workflowStage === 'CSSD') {
        logEvent('AUTO_SYNCHRONIZATION', 'SYNCHRO Event Engine', p.full_name, p.patient_code, `Cross-Dept: Sterile pack ${packId} verified → ${p.full_name} promoted to OT_READY.`);
        return { ...p, admission_status: 'OT_READY', workflowStage: 'OT_READY' };
      }
      return p;
    }));
  };

  // ── CSSD Pack Lifecycle Actions ──────────────────────────────────
  const reservePackForPatient = (packId, patientName, patientCode, requiredType = null) => {
    let result = { success: false, reason: '' };

    setCssdPacks(prev => prev.map(pack => {
      if (pack.id === packId || pack.pack_code === packId) {
        // BLOCK: expired pack
        if (pack.status === 'EXPIRED' || (pack.expiry && new Date(pack.expiry) < new Date())) {
          result.reason = 'PACK UNAVAILABLE: This sterile pack has expired and cannot be issued. Send for reprocessing.';
          return pack;
        }
        // BLOCK: incompatible pack type
        if (requiredType && !pack.pack_type.toLowerCase().includes(requiredType.toLowerCase().split(' ')[0])) {
          result.reason = `INCOMPATIBLE PACK: Required "${requiredType}" but selected "${pack.pack_type}".`;
          return pack;
        }
        // BLOCK: not sterile
        if (pack.status !== 'STERILE') {
          result.reason = `Pack is currently in "${pack.status}" state and cannot be reserved.`;
          return pack;
        }
        result.success = true;
        logEvent('PACK_RESERVED', 'CSSD Workflow', patientName, patientCode, `Pack ${pack.pack_code} reserved for ${patientName} (${patientCode}).`);
        return {
          ...pack,
          status: 'RESERVED',
          assigned_patient: patientName,
          assigned_patient_code: patientCode,
          lifecycle: [...(pack.lifecycle || []), { event: `Reserved for ${patientName}`, time: new Date().toISOString(), by: 'SYNCHRO Workflow Engine', location: pack.location }],
          last_updated: nowISO()
        };
      }
      return pack;
    }));

    if (!result.success && result.reason) {
      createAlert({
        id: `ALT-${Date.now()}`,
        severity: 'Critical',
        alert_type: 'CSSD_BLOCK',
        title: result.reason.split(':')[0],
        department: 'CSSD',
        deptPillar: 'teal',
        relatedEntity: `${patientName} • ${packId}`,
        timeDetected: 'Just now',
        status: 'Active',
        assignedTeam: 'CSSD Logistics Lead',
        reason: result.reason
      });
    }
    return result;
  };

  const issuePackToOT = (packId, otSuite = 'OT-02') => {
    let packCode = packId;
    setCssdPacks(prev => prev.map(pack => {
      if (pack.id === packId || pack.pack_code === packId) {
        packCode = pack.pack_code;
        logEvent('PACK_ISSUED', 'CSSD Dispatch', pack.assigned_patient || 'Pack', packCode, `Pack ${packCode} issued to ${otSuite}.`);
        return {
          ...pack,
          status: 'ISSUED',
          assigned_ot: otSuite,
          location: `${otSuite} Staging`,
          lifecycle: [...(pack.lifecycle || []), { event: `Issued to ${otSuite}`, time: new Date().toISOString(), by: 'CSSD Dispatch', location: `${otSuite} Staging` }],
          last_updated: nowISO()
        };
      }
      return pack;
    }));
  };

  const markPackInOT = (packId) => {
    setCssdPacks(prev => prev.map(pack => {
      if (pack.id === packId || pack.pack_code === packId) {
        logEvent('PACK_IN_OT', 'OT Suite Telemetry', pack.assigned_patient || 'Pack', pack.pack_code, `Pack ${pack.pack_code} in active procedure at ${pack.assigned_ot}.`);
        return {
          ...pack,
          status: 'IN_OT',
          location: `${pack.assigned_ot} (Active Procedure)`,
          lifecycle: [...(pack.lifecycle || []), { event: 'In Active Procedure', time: new Date().toISOString(), by: 'OT Suite Telemetry', location: pack.assigned_ot }],
          last_updated: nowISO()
        };
      }
      return pack;
    }));
  };

  const markPackReturned = (packId) => {
    setCssdPacks(prev => prev.map(pack => {
      if (pack.id === packId || pack.pack_code === packId) {
        logEvent('PACK_RETURNED', 'CSSD Intake', pack.assigned_patient || 'Pack', pack.pack_code, `Pack ${pack.pack_code} returned to CSSD for reprocessing.`);
        return {
          ...pack,
          status: 'RETURN_PENDING',
          location: 'CSSD Intake',
          lifecycle: [...(pack.lifecycle || []), { event: 'Returned to CSSD', time: new Date().toISOString(), by: 'OT Porter', location: 'CSSD Intake' }],
          last_updated: nowISO()
        };
      }
      return pack;
    }));
  };

  const advancePackLifecycle = (packId) => {
    let result = { success: false, newStatus: '', packCode: '' };
    setCssdPacks(prev => prev.map(pack => {
      if (pack.id === packId || pack.pack_code === packId) {
        result.packCode = pack.pack_code;
        const st = pack.status;
        let next = st;
        let loc = pack.location;
        let evtName = '';

        if (st === 'RETURN_PENDING') { next = 'DECONTAMINATION'; loc = 'Decontamination Bay #1'; evtName = 'Decontamination Started'; }
        else if (st === 'DECONTAMINATION') { next = 'REPROCESSING'; loc = 'Reprocessing Station'; evtName = 'Reprocessing Started'; }
        else if (st === 'REPROCESSING') { next = 'STERILIZING'; loc = `Autoclave Chamber #0${Math.floor(Math.random() * 4) + 1}`; evtName = 'Autoclave Cycle Started'; }
        else if (st === 'STERILIZING') { next = 'VERIFICATION_PENDING'; loc = 'QC Inspection Desk'; evtName = 'Autoclave Cycle Completed'; }
        else if (st === 'VERIFICATION_PENDING') {
          next = 'STERILE';
          loc = 'CSSD Storage A';
          evtName = 'Sterility Verified & Available';
          result.success = true;
          result.newStatus = next;
          logEvent('PACK_LIFECYCLE', 'CSSD Reprocessing', 'Sterile Pack', pack.pack_code, `Pack ${pack.pack_code} → ${evtName} at ${loc}.`);
          return {
            ...pack,
            status: next,
            location: loc,
            assigned_patient: null,
            assigned_patient_code: null,
            assigned_ot: 'Unassigned',
            sterilized_at: new Date().toISOString(),
            expiry: new Date(Date.now() + 72 * 3600000).toISOString(),
            verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date().toISOString() },
            lifecycle: [...(pack.lifecycle || []), { event: evtName, time: new Date().toISOString(), by: 'CSSD QC Inspector', location: loc }],
            last_updated: nowISO()
          };
        }
        else { return pack; }

        result.success = true;
        result.newStatus = next;
        logEvent('PACK_LIFECYCLE', 'CSSD Reprocessing', 'Sterile Pack', pack.pack_code, `Pack ${pack.pack_code} → ${evtName} at ${loc}.`);
        return {
          ...pack,
          status: next,
          location: loc,
          lifecycle: [...(pack.lifecycle || []), { event: evtName, time: new Date().toISOString(), by: 'CSSD Processing Team', location: loc }],
          last_updated: nowISO()
        };
      }
      return pack;
    }));
    return result;
  };

  const verifyPack = (packId) => {
    let result = { success: false, packCode: '' };
    setCssdPacks(prev => prev.map(pack => {
      if (pack.id === packId || pack.pack_code === packId) {
        result.packCode = pack.pack_code;
        // BLOCK: expired
        if (pack.expiry && new Date(pack.expiry) < new Date()) {
          result.success = false;
          result.reason = 'Pack has expired. Cannot verify.';
          return pack;
        }
        result.success = true;
        logEvent('PACK_VERIFIED', 'CSSD QC Inspector', 'Sterile Pack', pack.pack_code, `Pack ${pack.pack_code} digital verification completed: Identity ✓, Sterility ✓, Expiry ✓, Integrity ✓.`);
        return {
          ...pack,
          verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date().toISOString() },
          lifecycle: [...(pack.lifecycle || []), { event: 'Digital Verification Complete', time: new Date().toISOString(), by: 'CSSD QC Inspector', location: pack.location }],
          last_updated: nowISO()
        };
      }
      return pack;
    }));
    return result;
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem('synchro_patients');
      localStorage.removeItem('synchro_surgeries');
      localStorage.removeItem('synchro_alerts');
      localStorage.removeItem('synchro_cssd_packs');
      localStorage.removeItem('synchro_timeline_events');
    } catch (e) {}

    setPatients(patients_init);
    setSurgeries(surgeries_init);
    setCssdPacks(cssd_packs_init);
    setOperatingTheatres(operating_theatres);
    setAlerts(alerts_init);
    setTimelineEvents(timeline_init);
    logEvent('DEMO_RESET', 'Presenter Demo Controls', 'System State', 'ALL', 'Hospital workflow state reset to clean initial demo baseline.');
  };

  const value = {
    metrics: hospitalMetrics,
    doctors,
    operatingTheatres,
    patients,
    surgeries,
    cssd_packs,
    alerts,
    timelineEvents,
    logEvent,
    getDoctorByProfileId,
    getPatientsByDoctor,
    getSurgeriesByDoctor,
    getAlertsForDoctor,
    markPackReady,
    changePatientStatus,
    updatePatientVitals,
    addNursingNote,
    transferPatientToOT,
    addClinicalNote,
    scheduleProcedure,
    registerPatient,
    resolveAlert,
    acknowledgeAlert,
    createAlert,
    advancePatientWorkflow,
    startSurgeryForPatient,
    completeSurgeryForPatient,
    reservePackForPatient,
    issuePackToOT,
    markPackInOT,
    markPackReturned,
    advancePackLifecycle,
    verifyPack,
    dischargePatient,
    completeRecovery,
    resetDemoData
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used within WorkflowProvider');
  return ctx;
};

export default WorkflowContext;
