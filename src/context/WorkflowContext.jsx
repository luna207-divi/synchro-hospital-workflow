import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const WorkflowContext = createContext(null);

const id = (prefix, n) => `${prefix}-${n}`;
const nowISO = () => new Date().toISOString();

export const WorkflowProvider = ({ children }) => {
  // Seed hospital capacity & metrics constants
  const hospitalMetrics = useMemo(() => ({
    beds: { total: 420, occupied: 317, available: 103 },
    cssd: { total: 156, sterile: 142, sterilizing: 9, qc: 3, expired: 2 },
    theatres: { total: 12, active: 7, scheduled: 3, available: 2 },
    admissionsToday: 24,
    dischargesToday: 19,
    appointmentsToday: 42,
    avgWaitMinutes: 24,
    otUtilization: 82,
    cssdReadiness: 94
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
    { id: 'ot-01', suite_code: 'OT-01', name: 'Orthopedics & Joint Replacement', status: 'ACTIVE', surgeon: 'Dr. James Gomez' },
    { id: 'ot-02', suite_code: 'OT-02', name: 'General & Laparoscopic', status: 'ACTIVE', surgeon: 'Dr. Rajesh Sharma' },
    { id: 'ot-03', suite_code: 'OT-03', name: 'Sports Medicine & Arthroscopy', status: 'ACTIVE', surgeon: 'Dr. Kevin Patel' },
    { id: 'ot-04', suite_code: 'OT-04', name: 'Cardiovascular & Thoracic', status: 'ACTIVE', surgeon: 'Dr. Alan Vance' },
    { id: 'ot-05', suite_code: 'OT-05', name: 'ENT & Head/Neck', status: 'ACTIVE', surgeon: 'Dr. S. Nair' },
    { id: 'ot-06', suite_code: 'OT-06', name: 'Neurosurgery Suite', status: 'ACTIVE', surgeon: 'Dr. M. Roy' },
    { id: 'ot-07', suite_code: 'OT-07', name: 'Urology & Endoscopy', status: 'ACTIVE', surgeon: 'Dr. R. Kapoor' },
    { id: 'ot-08', suite_code: 'OT-08', name: 'Trauma & Emergency OT', status: 'SCHEDULED', surgeon: 'Dr. T. Jenkins' },
    { id: 'ot-09', suite_code: 'OT-09', name: 'Pediatric Surgery', status: 'SCHEDULED', surgeon: 'Dr. E. Davis' },
    { id: 'ot-10', suite_code: 'OT-10', name: 'Ophthalmology Suite', status: 'SCHEDULED', surgeon: 'Dr. A. Verma' },
    { id: 'ot-11', suite_code: 'OT-11', name: 'General Reserve OT A', status: 'AVAILABLE', surgeon: 'Unassigned' },
    { id: 'ot-12', suite_code: 'OT-12', name: 'General Reserve OT B', status: 'AVAILABLE', surgeon: 'Unassigned' }
  ]), []);

  // Seed 156 CSSD packs (142 Sterile, 9 Sterilizing, 3 QC, 2 Expired)
  const cssd_packs_init = useMemo(() => {
    return Array.from({ length: 156 }).map((_, i) => {
      const n = i + 1;
      let status = 'STERILE';
      let location = 'Central Sterile Vault';
      let packType = 'General Laparotomy Set';
      
      if (n <= 40) packType = 'Laparoscopic Cholecystectomy Kit';
      else if (n <= 80) packType = 'Total Joint Arthroplasty Set';
      else if (n <= 110) packType = 'Arthroscopy Power Tool Pack';
      else if (n <= 140) packType = 'Cardiovascular Micro-Vascular Set';
      else packType = 'Emergency Trauma Surgery Tray';

      if (n <= 142) {
        status = 'STERILE';
        if (i % 6 === 0) location = `OT-0${(i % 7) + 1} Staging Core`;
      } else if (n <= 151) {
        status = 'STERILIZING';
        location = `Autoclave Chamber #0${(i % 3) + 1}`;
      } else if (n <= 154) {
        status = 'AWAITING_QC';
        location = 'CSSD Decontamination Bay';
      } else {
        status = 'EXPIRED';
        location = 'Storage Vault B (Quarantine Shelf)';
      }

      return {
        id: id('cssd', n),
        pack_code: n === 155 ? 'CSSD-EXP-09' : n === 156 ? 'CSSD-EXP-10' : `CSSD-${String(40000 + n).slice(-5)}`,
        pack_type: packType,
        status,
        sterilization_cycle: `CYC-2026-${1000 + (n % 45)}`,
        sterilized_at: new Date(Date.now() - (n <= 154 ? (i % 48) * 3600000 : 80 * 3600000)).toISOString(),
        expiry: new Date(Date.now() + (n <= 154 ? (72 - (i % 48)) * 3600000 : -5 * 3600000)).toISOString(),
        assigned_ot: n <= 10 ? `OT-${String(n).padStart(2,'0')}` : 'Unassigned',
        location,
        last_updated: nowISO()
      };
    });
  }, []);

  // Seed 248 realistic Patients
  const patients_init = useMemo(() => {
    const firstNames = ['Ananya', 'Rahul', 'Meera', 'Arjun', 'Elena', 'Robert', 'Michael', 'Sarah', 'James', 'Priya', 'Viktor', 'Sofia', 'Liam', 'Noah', 'Maya', 'Ishan'];
    const lastNames = ['Rao', 'Mehta', 'Nair', 'Shah', 'Rostova', 'Vance', 'Chen', 'Jenkins', 'Morrison', 'Das', 'Roy', 'Patel', 'Singh', 'Kumar', 'Verma', 'Gupta'];
    const conditions = [
      'Cholelithiasis (Gallstones)', 'Osteoarthritis of Hip', 'ACL Knee Tear', 'Inguinal Hernia',
      'Coronary Artery Disease', 'Acute Appendicitis', 'Cataract', 'Lumbar Disc Herniation',
      'Renal Calculi (Kidney Stones)', 'Thyroid Nodule', 'Rotator Cuff Tear', 'Benign Prostatic Hyperplasia'
    ];
    const procedures = [
      'Laparoscopic Cholecystectomy', 'Total Hip Arthroplasty', 'ACL Reconstruction', 'Laparoscopic Hernia Repair',
      'Coronary Artery Bypass (CABG)', 'Emergency Appendectomy', 'Phacoemulsification', 'Lumbar Discectomy',
      'Ureteroscopic Lithotripsy', 'Thyroidectomy', 'Arthroscopic Rotator Repair', 'TURP Procedure'
    ];

    const list = [];
    let counter = 1042;
    for (let i = 0; i < 248; i++) {
      const f = firstNames[i % firstNames.length];
      const l = lastNames[(i * 3) % lastNames.length];
      const condition = conditions[i % conditions.length];
      const procedure = procedures[i % procedures.length];
      const age = 22 + ((i * 7) % 58);
      const gender = i % 2 === 0 ? 'FEMALE' : 'MALE';
      const blood = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-'][(i * 2) % 6];
      
      let status = 'ADMITTED';
      if (i < 114) status = 'ADMITTED';
      else if (i < 136) status = 'PRE_OP';
      else if (i < 147) status = 'IN_SURGERY';
      else if (i < 155) status = 'EMERGENCY';
      else if (i < 194) status = 'DISCHARGED';
      else status = 'REGISTERED';

      const roomNum = `R-${101 + (i % 30)}`;
      const bedNum = `B-${(i % 4) + 1}`;

      list.push({
        id: id('p', counter),
        patient_code: `P-${counter}`,
        first_name: f,
        last_name: l,
        full_name: `${f} ${l}`,
        age,
        gender,
        blood_group: blood,
        phone: `+1 (555) 012-${3000 + i}`,
        emergency_contact: `Family Contact (+1 555-019-${i})`,
        condition,
        procedure,
        admission_status: status,
        assigned_doctor_id: i % 6 === 0 ? 'doc-1' : `doc-${(i % 4) + 1}`,
        assigned_doctor: i % 6 === 0 ? 'Dr. Rajesh Sharma, MD' : i % 4 === 1 ? 'Dr. James Gomez, MD' : i % 4 === 2 ? 'Dr. Kevin Patel, MD' : 'Dr. Alan Vance, MD',
        assigned_bed: status === 'ADMITTED' || status === 'PRE_OP' || status === 'IN_SURGERY' ? {
          room: { room_number: roomNum, room_type: i % 3 === 0 ? 'ICU' : 'Surgical Ward' },
          bed_number: bedNum
        } : null,
        admissions: [{
          id: id('adm', i + 1),
          admission_id: `ADM-2026-${String(i + 1).padStart(3, '0')}`,
          department: i % 4 === 0 ? 'Surgical Suite' : i % 4 === 1 ? 'Cardiovascular' : i % 4 === 2 ? 'Orthopedics' : 'General Admissions',
          room: roomNum,
          bed: bedNum,
          admission_date: new Date(Date.now() - (i % 7) * 86400000).toISOString(),
          status: status === 'DISCHARGED' ? 'DISCHARGED' : 'ACTIVE',
          diagnosis: condition
        }],
        care_team: {
          consultant: i % 6 === 0 ? 'Dr. Rajesh Sharma, MD' : 'Dr. James Gomez, MD',
          nurse: 'Maria Vance, BSN (CSSD Lead)',
          department: 'Surgery & Perioperative Care'
        },
        medications: ['Cefazolin 1g IV pre-op', 'Paracetamol 1000mg IV q6h', 'Enoxaparin 40mg SC daily'],
        allergies: i % 7 === 0 ? 'Penicillin' : i % 11 === 0 ? 'Latex' : 'NKDA',
        consents: [{ id: id('c', i + 1), consent_type: 'Informed Surgical Consent', status: i % 5 === 0 ? 'PENDING' : 'SIGNED' }]
      });
      counter++;
    }
    return list;
  }, []);

  // Seed 14 surgeries today
  const surgeries_init = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const statuses = [
      'IN_SURGERY', 'IN_SURGERY', 'IN_SURGERY',
      'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED',
      'DELAYED', 'PRE_OP'
    ];
    return Array.from({ length: 14 }).map((_, i) => {
      const patient = patients_init[i];
      const theatre = operating_theatres[i % operating_theatres.length];
      return {
        id: id('s', i + 1),
        patient_id: patient.id,
        patient: {
          id: patient.id,
          patient_code: patient.patient_code,
          first_name: patient.first_name,
          last_name: patient.last_name,
          allergies: patient.allergies,
          blood_group: patient.blood_group
        },
        theatre_id: theatre.id,
        theatre: theatre,
        procedure_name: patient.procedure,
        scheduled_date: today,
        scheduled_start: new Date(Date.now() + (i - 4) * 3600000).toISOString(),
        status: statuses[i],
        priority: i === 0 ? 'EMERGENCY' : i % 3 === 0 ? 'HIGH' : 'NORMAL',
        lead_surgeon_id: 'doc-1',
        lead_surgeon_name: 'Dr. Rajesh Sharma, MD',
        cssd_packs: [cssd_packs_init[i]]
      };
    });
  }, [patients_init, operating_theatres, cssd_packs_init]);

  // Seed 12 active alerts
  const alerts_init = useMemo(() => ([
    {
      id: 'ALT-2094',
      severity: 'Critical',
      alert_type: 'EXPIRED_STERILE_PACK',
      title: 'Expired sterile pack detected in Storage B',
      department: 'CSSD',
      deptPillar: 'teal',
      relatedEntity: 'Tray #CSSD-EXP-09 • OT-01 • Patient: Robert Vance (P-1025)',
      timeDetected: '3 mins ago',
      status: 'Active',
      assignedTeam: 'CSSD Sterilization Lead',
      reason: 'Sterility shelf-life expired 2 hours prior to case dispatch. Autoclave biological spore strip validation was stamped 72 hours ago.',
      recommendedAction: 'Immediately quarantine Tray #CSSD-EXP-09 from sterile storage. Dispatch replacement backup Tray #CSSD-40012 currently staged in Central Vault.',
      primaryActionLabel: 'Dispatch Replacement Tray',
      estResolutionTime: '4 mins',
      timeline: [
        { time: '11:42 AM', title: 'RFID Reader Pinged at OT-01 holding core', desc: 'Tray scanned at sterile perimeter sensor.' },
        { time: '11:43 AM', title: 'AI Sterility Validation Engine Flagged Expiry', desc: 'Shelf-life expiration algorithm detected 72-hour threshold exceedance.', isFlagged: true },
        { time: '11:44 AM', title: 'Alert Escalated to CSSD & OT Charge Nurse', desc: 'Surgical pack hold placed on EMR case schedule.' }
      ]
    },
    {
      id: 'ALT-2093',
      severity: 'Critical',
      alert_type: 'INSTRUMENT_UNAVAILABLE',
      title: 'Required instrument pack unavailable for OT-03',
      department: 'CSSD',
      deptPillar: 'teal',
      relatedEntity: 'Pack #CSSD-40025 • OT-03 • Patient: Michael Chen (P-1026)',
      timeDetected: '14 mins ago',
      status: 'Active',
      assignedTeam: 'Surgical Supply Logistics',
      reason: 'Orthopedic Power Tool Set #04 is undergoing 4-stage autoclave cooling cycle (Chamber #02). Tray not released for next ACL surgery.',
      recommendedAction: 'Expedite reserve fast-track Tray #CSSD-40040 from Reserve Vault or reroute sterile pack from completed case in OT-01.',
      primaryActionLabel: 'Expedite Reserve Tray',
      estResolutionTime: '6 mins',
      timeline: [
        { time: '11:15 AM', title: 'Case Verification Checked', desc: 'CSSD readiness returned HOLD state.' },
        { time: '11:22 AM', title: 'Autoclave Cooldown Lag Identified', desc: 'Estimated completion 11:58 AM (+22m start delay).', isFlagged: true }
      ]
    },
    {
      id: 'ALT-2092',
      severity: 'Warning',
      alert_type: 'TURNOVER_DELAY',
      title: 'OT-03 turnover exceeded expected duration',
      department: 'OT',
      deptPillar: 'indigo',
      relatedEntity: 'OT Suite 03 • Turnover: 34m (Benchmark: 25m)',
      timeDetected: '19 mins ago',
      status: 'Active',
      assignedTeam: 'OT Charge Nurse',
      reason: 'Environmental sanitation team delayed due to aerosolized suction canister cleanup after complex trauma case.',
      recommendedAction: 'Assign secondary environmental sanitation technician to assist OT-03 turnover lead.',
      primaryActionLabel: 'Dispatch Assist Tech',
      estResolutionTime: '8 mins',
      timeline: [
        { time: '11:00 AM', title: 'Patient Out of Room', desc: 'Surgical dressing completed and patient transferred to PACU.' },
        { time: '11:25 AM', title: '25m Standard Turnover Window Elapsed', desc: 'Sanitation incomplete notification triggered.', isFlagged: true }
      ]
    }
  ]), []);

  // ── Reactive State Initialization with LocalStorage Persistence ──────
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('synchro_patients');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return patients_init;
  });

  const [surgeries, setSurgeries] = useState(() => {
    try {
      const saved = localStorage.getItem('synchro_surgeries');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return surgeries_init;
  });

  const [cssd_packs, setCssdPacks] = useState(() => {
    try {
      const saved = localStorage.getItem('synchro_cssd_packs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return cssd_packs_init;
  });

  const [operatingTheatres] = useState(operating_theatres);

  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('synchro_alerts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return alerts_init;
  });

  const [timelineEvents, setTimelineEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('synchro_timeline_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'evt-1', type: 'PATIENT_REGISTERED', timestamp: '08:12 AM', actor: 'Front Desk Intake', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Patient registered at main reception.' },
      { id: 'evt-2', type: 'PATIENT_ADMITTED', timestamp: '08:18 AM', actor: 'Admissions Desk', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Admitted to Ward Suite R-103 / Bed B-3.' },
      { id: 'evt-3', type: 'NURSING_ASSESSMENT_COMPLETED', timestamp: '08:35 AM', actor: 'Nursing Lead', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Baseline vitals recorded & NPO status confirmed.' },
      { id: 'evt-4', type: 'CONSULTATION_STARTED', timestamp: '09:05 AM', actor: 'Dr. Rajesh Sharma, MD', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Pre-operative assessment & clearance signed.' },
      { id: 'evt-5', type: 'PROCEDURE_SCHEDULED', timestamp: '09:20 AM', actor: 'OT Scheduler', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'ACL Reconstruction scheduled for OT-02.' },
      { id: 'evt-6', type: 'PACK_ALLOCATED', timestamp: '09:40 AM', actor: 'CSSD Sterilization', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Sterile Pack CSSD-00428 allocated.' },
      { id: 'evt-7', type: 'OT_READY', timestamp: '09:45 AM', actor: 'Nursing Care', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: '11-Point readiness checklist 100% verified.' }
    ];
  });

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

  const markPackReady = (packId) => {
    setCssdPacks(prev => prev.map(pack => pack.id === packId || pack.pack_code === packId ? { ...pack, status: 'STERILE' } : pack));
    logEvent('PACK_ALLOCATED', 'CSSD Sterilization', 'Sterile Pack', packId, `Pack ${packId} marked STERILE & ready for dispatch.`);
  };

  const createAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
    logEvent('ALERT_CREATED', 'System Monitor', 'System Alert', newAlert.id || 'ALT-NEW', `Critical alert triggered: ${newAlert.title}.`);
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
    createAlert
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
