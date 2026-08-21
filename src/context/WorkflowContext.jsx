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

  // Seed realistic CSSD packs with full digital identity, lifecycle, and patient connections
  const cssd_packs_init = useMemo(() => {
    const now = Date.now();
    const hr = 3600000;
    return [
      {
        id: 'cssd-1', pack_code: 'CSSD-LAP-021', rfid: 'RFID-9921-LAP', qr: 'QR-CSSD-021',
        pack_type: 'Laparoscopic General Surgery Kit', specialty: 'General Surgery',
        instrument_count: 18, sterilization_method: 'Steam Autoclave 134°C',
        status: 'STERILE', location: 'CSSD Storage A', assigned_ot: 'OT-02',
        assigned_patient: 'Ananya Rao', assigned_patient_code: 'P-1042',
        sterilized_at: new Date(now - 28 * hr).toISOString(),
        expiry: new Date(now + 44 * hr).toISOString(),
        cycle: 'AUTOCLAVE-02', operator: 'TECH-409 (M. Vance)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 27 * hr).toISOString() },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 30 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Started', time: new Date(now - 29 * hr).toISOString(), by: 'Autoclave Chamber #02', location: 'Sterilization Core' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 28 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #02', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 27 * hr).toISOString(), by: 'Dual Biological Spore Test', location: 'QC Inspection Desk' },
          { event: 'Moved to Storage', time: new Date(now - 26.5 * hr).toISOString(), by: 'CSSD Logistics', location: 'CSSD Storage A' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-2', pack_code: 'CSSD-ORT-014', rfid: 'RFID-8814-ORT', qr: 'QR-CSSD-014',
        pack_type: 'Orthopedic Instrument Set', specialty: 'Orthopedics',
        instrument_count: 24, sterilization_method: 'Steam Autoclave 134°C',
        status: 'RESERVED', location: 'OT-03 Staging', assigned_ot: 'OT-03',
        assigned_patient: 'Meera Chen', assigned_patient_code: 'P-1044',
        sterilized_at: new Date(now - 18 * hr).toISOString(),
        expiry: new Date(now + 54 * hr).toISOString(),
        cycle: 'AUTOCLAVE-01', operator: 'TECH-312 (R. Kumar)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 17 * hr).toISOString() },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 20 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 18 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #01', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 17 * hr).toISOString(), by: 'Dual Biological Spore Test', location: 'QC Inspection Desk' },
          { event: 'Reserved for Meera Chen', time: new Date(now - 4 * hr).toISOString(), by: 'SYNCHRO Workflow Engine', location: 'CSSD Storage B' },
          { event: 'Staged at OT-03', time: new Date(now - 2 * hr).toISOString(), by: 'CSSD Logistics Porter', location: 'OT-03 Staging' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-3', pack_code: 'CSSD-TRM-009', rfid: 'RFID-7709-TRM', qr: 'QR-CSSD-009',
        pack_type: 'Emergency Trauma Kit', specialty: 'Trauma Surgery',
        instrument_count: 22, sterilization_method: 'Steam Autoclave 134°C',
        status: 'STERILE', location: 'Emergency CSSD Storage', assigned_ot: 'Unassigned',
        assigned_patient: null, assigned_patient_code: null,
        sterilized_at: new Date(now - 12 * hr).toISOString(),
        expiry: new Date(now + 60 * hr).toISOString(),
        cycle: 'AUTOCLAVE-03', operator: 'TECH-409 (M. Vance)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 11 * hr).toISOString() },
        priority: 'EMERGENCY',
        lifecycle: [
          { event: 'Emergency Kit Assembled', time: new Date(now - 14 * hr).toISOString(), by: 'CSSD Emergency Team', location: 'Emergency Assembly Bay' },
          { event: 'STAT Autoclave Cycle', time: new Date(now - 12 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #03', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 11 * hr).toISOString(), by: 'Rapid Biological Test', location: 'QC Inspection Desk' },
          { event: 'Staged in Emergency Bay', time: new Date(now - 10.5 * hr).toISOString(), by: 'CSSD Emergency Logistics', location: 'Emergency CSSD Storage' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-4', pack_code: 'CSSD-CV-008', rfid: 'RFID-6608-CV', qr: 'QR-CSSD-008',
        pack_type: 'Cardiac Surgery Set', specialty: 'Cardiovascular',
        instrument_count: 32, sterilization_method: 'Steam Autoclave 134°C',
        status: 'STERILE', location: 'CSSD Storage C', assigned_ot: 'Unassigned',
        assigned_patient: null, assigned_patient_code: null,
        sterilized_at: new Date(now - 60 * hr).toISOString(),
        expiry: new Date(now + 12 * hr).toISOString(),
        cycle: 'AUTOCLAVE-04', operator: 'TECH-201 (S. Patel)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 59 * hr).toISOString() },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 62 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 60 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #04', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 59 * hr).toISOString(), by: 'Dual Biological Spore Test', location: 'QC Inspection Desk' },
          { event: 'Moved to Storage', time: new Date(now - 58 * hr).toISOString(), by: 'CSSD Logistics', location: 'CSSD Storage C' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-5', pack_code: 'CSSD-GEN-017', rfid: 'RFID-5517-GEN', qr: 'QR-CSSD-017',
        pack_type: 'General Surgery Set', specialty: 'General Surgery',
        instrument_count: 16, sterilization_method: 'Steam Autoclave 134°C',
        status: 'EXPIRED', location: 'Storage Vault B (Quarantine)', assigned_ot: 'Unassigned',
        assigned_patient: null, assigned_patient_code: null,
        sterilized_at: new Date(now - 80 * hr).toISOString(),
        expiry: new Date(now - 8 * hr).toISOString(),
        cycle: 'AUTOCLAVE-01', operator: 'TECH-312 (R. Kumar)',
        verification: { biological: true, chemical: true, integrity: false, verified: false, verifiedAt: null },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 82 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 80 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #01', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 79 * hr).toISOString(), by: 'Dual Biological Spore Test', location: 'QC Inspection Desk' },
          { event: '⚠ STERILITY EXPIRED', time: new Date(now - 8 * hr).toISOString(), by: 'SYNCHRO Expiry Monitor', location: 'Storage Vault B' },
          { event: 'Quarantined', time: new Date(now - 7 * hr).toISOString(), by: 'Infection Prevention Protocol', location: 'Storage Vault B (Quarantine)' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-6', pack_code: 'CSSD-LAP-019', rfid: 'RFID-4419-LAP', qr: 'QR-CSSD-019',
        pack_type: 'Laparoscopic Kit', specialty: 'General Surgery',
        instrument_count: 18, sterilization_method: 'Steam Autoclave 134°C',
        status: 'IN_OT', location: 'OT-02 (Active Procedure)', assigned_ot: 'OT-02',
        assigned_patient: 'Ananya Rao', assigned_patient_code: 'P-1042',
        sterilized_at: new Date(now - 6 * hr).toISOString(),
        expiry: new Date(now + 66 * hr).toISOString(),
        cycle: 'AUTOCLAVE-02', operator: 'TECH-409 (M. Vance)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 5 * hr).toISOString() },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 8 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 6 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #02', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 5 * hr).toISOString(), by: 'Dual Biological Spore Test', location: 'QC Inspection Desk' },
          { event: 'Issued to OT-02', time: new Date(now - 2 * hr).toISOString(), by: 'CSSD Dispatch', location: 'OT-02 Staging' },
          { event: 'In Active Procedure', time: new Date(now - 1.5 * hr).toISOString(), by: 'OT Suite Telemetry', location: 'OT-02' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-7', pack_code: 'CSSD-CABG-003', rfid: 'RFID-3303-CBG', qr: 'QR-CSSD-CBG003',
        pack_type: 'CABG Bypass Instrument Set', specialty: 'Cardiovascular',
        instrument_count: 28, sterilization_method: 'Steam Autoclave 134°C',
        status: 'STERILE', location: 'CSSD Storage D', assigned_ot: 'Unassigned',
        assigned_patient: 'Rahul Shah', assigned_patient_code: 'P-1043',
        sterilized_at: new Date(now - 10 * hr).toISOString(),
        expiry: new Date(now + 62 * hr).toISOString(),
        cycle: 'AUTOCLAVE-04', operator: 'TECH-201 (S. Patel)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 9 * hr).toISOString() },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 12 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 10 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #04', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 9 * hr).toISOString(), by: 'Dual Biological Spore Test', location: 'QC Inspection Desk' },
          { event: 'Moved to Storage', time: new Date(now - 8.5 * hr).toISOString(), by: 'CSSD Logistics', location: 'CSSD Storage D' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-8', pack_code: 'CSSD-ENT-005', rfid: 'RFID-2205-ENT', qr: 'QR-CSSD-005',
        pack_type: 'ENT Micro-Surgery Kit', specialty: 'ENT',
        instrument_count: 14, sterilization_method: 'Ethylene Oxide (EtO)',
        status: 'STERILIZING', location: 'Autoclave Chamber #03', assigned_ot: 'Unassigned',
        assigned_patient: null, assigned_patient_code: null,
        sterilized_at: null,
        expiry: null,
        cycle: 'AUTOCLAVE-03', operator: 'TECH-409 (M. Vance)',
        verification: { biological: false, chemical: false, integrity: false, verified: false, verifiedAt: null },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 3 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Decontamination Complete', time: new Date(now - 2 * hr).toISOString(), by: 'Enzymatic Wash Bay #2', location: 'Decontamination Zone' },
          { event: 'Autoclave Cycle Started', time: new Date(now - 1 * hr).toISOString(), by: 'Autoclave Chamber #03', location: 'Sterilization Core' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-9', pack_code: 'CSSD-URO-011', rfid: 'RFID-1111-URO', qr: 'QR-CSSD-011',
        pack_type: 'Urology Endoscopy Set', specialty: 'Urology',
        instrument_count: 12, sterilization_method: 'Steam Autoclave 134°C',
        status: 'DECONTAMINATION', location: 'Decontamination Bay #1', assigned_ot: 'Unassigned',
        assigned_patient: null, assigned_patient_code: null,
        sterilized_at: null,
        expiry: null,
        cycle: null, operator: 'TECH-312 (R. Kumar)',
        verification: { biological: false, chemical: false, integrity: false, verified: false, verifiedAt: null },
        lifecycle: [
          { event: 'Used in OT-07', time: new Date(now - 5 * hr).toISOString(), by: 'Surgical Team', location: 'OT-07' },
          { event: 'Returned to CSSD', time: new Date(now - 4 * hr).toISOString(), by: 'OT Porter', location: 'CSSD Intake' },
          { event: 'Decontamination Started', time: new Date(now - 3.5 * hr).toISOString(), by: 'Enzymatic Wash Bay #1', location: 'Decontamination Bay #1' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-10', pack_code: 'CSSD-NEU-006', rfid: 'RFID-0006-NEU', qr: 'QR-CSSD-006',
        pack_type: 'Neurosurgery Micro-Instrument Set', specialty: 'Neurosurgery',
        instrument_count: 20, sterilization_method: 'Steam Autoclave 134°C',
        status: 'VERIFICATION_PENDING', location: 'QC Inspection Desk', assigned_ot: 'Unassigned',
        assigned_patient: null, assigned_patient_code: null,
        sterilized_at: new Date(now - 2 * hr).toISOString(),
        expiry: new Date(now + 70 * hr).toISOString(),
        cycle: 'AUTOCLAVE-01', operator: 'TECH-201 (S. Patel)',
        verification: { biological: false, chemical: true, integrity: false, verified: false, verifiedAt: null },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 5 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 2 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #01', location: 'Sterilization Core' },
          { event: 'Awaiting QC Verification', time: new Date(now - 1.5 * hr).toISOString(), by: 'QC Queue', location: 'QC Inspection Desk' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-11', pack_code: 'CSSD-PED-002', rfid: 'RFID-8802-PED', qr: 'QR-CSSD-002',
        pack_type: 'Pediatric Surgery Kit', specialty: 'Pediatrics',
        instrument_count: 15, sterilization_method: 'Steam Autoclave 121°C',
        status: 'STERILE', location: 'CSSD Storage B', assigned_ot: 'Unassigned',
        assigned_patient: null, assigned_patient_code: null,
        sterilized_at: new Date(now - 8 * hr).toISOString(),
        expiry: new Date(now + 64 * hr).toISOString(),
        cycle: 'AUTOCLAVE-02', operator: 'TECH-409 (M. Vance)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 7 * hr).toISOString() },
        lifecycle: [
          { event: 'Instruments Assembled', time: new Date(now - 10 * hr).toISOString(), by: 'CSSD Assembly Team', location: 'CSSD Assembly Bay' },
          { event: 'Autoclave Cycle Completed', time: new Date(now - 8 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #02', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 7 * hr).toISOString(), by: 'Dual Biological Spore Test', location: 'QC Inspection Desk' },
          { event: 'Moved to Storage', time: new Date(now - 6.5 * hr).toISOString(), by: 'CSSD Logistics', location: 'CSSD Storage B' },
        ],
        last_updated: nowISO()
      },
      {
        id: 'cssd-12', pack_code: 'CSSD-TRM-010', rfid: 'RFID-7710-TRM', qr: 'QR-CSSD-010',
        pack_type: 'Emergency Trauma Kit', specialty: 'Trauma Surgery',
        instrument_count: 22, sterilization_method: 'Steam Autoclave 134°C',
        status: 'RETURN_PENDING', location: 'OT-08 (Post-Procedure)', assigned_ot: 'OT-08',
        assigned_patient: 'Elena Singh', assigned_patient_code: 'P-1046',
        sterilized_at: new Date(now - 16 * hr).toISOString(),
        expiry: new Date(now + 56 * hr).toISOString(),
        cycle: 'AUTOCLAVE-03', operator: 'TECH-409 (M. Vance)',
        verification: { biological: true, chemical: true, integrity: true, verified: true, verifiedAt: new Date(now - 15 * hr).toISOString() },
        lifecycle: [
          { event: 'Emergency Kit Assembled', time: new Date(now - 18 * hr).toISOString(), by: 'CSSD Emergency Team', location: 'Emergency Assembly Bay' },
          { event: 'STAT Autoclave Cycle', time: new Date(now - 16 * hr).toISOString(), by: 'Pre-Vacuum Autoclave #03', location: 'Sterilization Core' },
          { event: 'Sterility Verified', time: new Date(now - 15 * hr).toISOString(), by: 'Rapid Biological Test', location: 'QC Inspection Desk' },
          { event: 'Issued to OT-08', time: new Date(now - 8 * hr).toISOString(), by: 'CSSD Emergency Dispatch', location: 'OT-08' },
          { event: 'Procedure Completed', time: new Date(now - 3 * hr).toISOString(), by: 'Surgical Team', location: 'OT-08' },
          { event: 'Awaiting Return', time: new Date(now - 2.5 * hr).toISOString(), by: 'OT Coordinator', location: 'OT-08 (Post-Procedure)' },
        ],
        last_updated: nowISO()
      },
    ];
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

  // Seed realistic alerts covering Critical, Warning, Information, and Resolved states
  const alerts_init = useMemo(() => ([
    {
      id: 'ALT-2094',
      severity: 'Critical',
      alert_type: 'EXPIRED_STERILE_PACK',
      title: 'Expired sterile pack detected',
      department: 'CSSD',
      deptPillar: 'teal',
      relatedEntity: 'CSSD-GEN-017 • Storage Vault B',
      patientName: 'Ananya Rao',
      patientId: 'P-1042',
      timeDetected: '3 mins ago',
      status: 'Active',
      assignedTeam: 'CSSD Sterilization Lead',
      reason: 'Assigned sterile pack expired 8 hours prior to scheduled case dispatch. Biological spore strip validity exceeded 72 hours.',
      recommendedAction: 'Quarantine CSSD-GEN-017 from sterile storage and dispatch verified sterile replacement CSSD-LAP-021.',
      primaryActionLabel: 'Dispatch Replacement Pack',
      estResolutionTime: '4 mins',
      timeline: [
        { time: '11:42 AM', title: 'RFID Reader Pinged at Storage Vault B', desc: 'Tray scanned at sterile perimeter sensor.' },
        { time: '11:43 AM', title: 'SYNCHRO Expiry Monitor Flagged Expiry', desc: 'Shelf-life expiration algorithm detected 72-hour threshold exceedance.', isFlagged: true },
        { time: '11:44 AM', title: 'Alert Escalated to CSSD & OT Charge Nurse', desc: 'Surgical pack hold placed on EMR case schedule.' }
      ]
    },
    {
      id: 'ALT-2093',
      severity: 'Critical',
      alert_type: 'EMERGENCY_OT_WAITING',
      title: 'Emergency case waiting for OT allocation',
      department: 'OT',
      deptPillar: 'indigo',
      relatedEntity: 'Patient: Arjun Das (P-1099) • Trauma',
      patientName: 'Arjun Das',
      patientId: 'P-1099',
      timeDetected: '8 mins ago',
      status: 'Active',
      assignedTeam: 'OT Trauma Coordinator',
      reason: 'STAT Emergency Trauma surgery patient ready for transfer; OT-04 currently completing turnover.',
      recommendedAction: 'Fast-track OT-04 turnover or allocate reserve suite OT-08.',
      primaryActionLabel: 'Allocate Reserve OT-08',
      estResolutionTime: '3 mins',
      timeline: [
        { time: '11:35 AM', title: 'Emergency Intake Received', desc: 'Patient Arjun Das registered via Emergency Triage.' },
        { time: '11:38 AM', title: 'STAT CSSD Trauma Pack CSSD-TRM-009 Verified', desc: 'Emergency trauma set prepared.', isFlagged: true }
      ]
    },
    {
      id: 'ALT-2092',
      severity: 'Warning',
      alert_type: 'TURNOVER_DELAY',
      title: 'OT-08 turnover exceeded benchmark duration',
      department: 'OT',
      deptPillar: 'indigo',
      relatedEntity: 'OT Suite 08 • Turnover: 28m (Benchmark: 25m)',
      patientName: 'Elena Singh',
      patientId: 'P-1046',
      timeDetected: '14 mins ago',
      status: 'Active',
      assignedTeam: 'OT Sanitation Team Lead',
      reason: 'Environmental sanitation team delayed due to complex trauma room cleaning.',
      recommendedAction: 'Dispatch secondary sanitation technician to expedite OT-08 turnover.',
      primaryActionLabel: 'Dispatch Assist Sanitation',
      estResolutionTime: '5 mins',
      timeline: [
        { time: '11:00 AM', title: 'Procedure Completed', desc: 'Patient transferred to PACU Recovery.' },
        { time: '11:25 AM', title: '25m Standard Turnover Window Elapsed', desc: 'Sanitation incomplete notification triggered.', isFlagged: true }
      ]
    },
    {
      id: 'ALT-2091',
      severity: 'Warning',
      alert_type: 'CONSENT_PENDING',
      title: 'Surgical consent pending for scheduled procedure',
      department: 'Admissions',
      deptPillar: 'blue',
      relatedEntity: 'Priya Sharma (P-1048) • Orthopedics',
      patientName: 'Priya Sharma',
      patientId: 'P-1048',
      timeDetected: '22 mins ago',
      status: 'Active',
      assignedTeam: 'Pre-Op Nursing Lead',
      reason: 'Required surgical consent form is unsigned in EMR prior to scheduled OT transfer.',
      recommendedAction: 'Notify attending consultant Dr. James Gomez for digital consent sign-off.',
      primaryActionLabel: 'Notify Consultant',
      estResolutionTime: '6 mins',
      timeline: [
        { time: '11:00 AM', title: 'Pre-Op Intake Initiated', desc: 'Checklist completed except digital consent.' },
        { time: '11:20 AM', title: 'Consent Expiry Warning Triggered', desc: 'Pre-op transfer held.', isFlagged: true }
      ]
    },
    {
      id: 'ALT-2090',
      severity: 'Warning',
      alert_type: 'PACK_EXPIRING_SOON',
      title: 'Sterile pack expiring within 12 hours',
      department: 'CSSD',
      deptPillar: 'teal',
      relatedEntity: 'CSSD-CV-008 • Storage Vault C',
      patientName: 'Rahul Shah',
      patientId: 'P-1043',
      timeDetected: '45 mins ago',
      status: 'Active',
      assignedTeam: 'CSSD Inventory Manager',
      reason: 'Cardiac Surgery Set CSSD-CV-008 has 10 hours of validated sterility remaining.',
      recommendedAction: 'Prioritize CSSD-CV-008 for upcoming CABG surgery or schedule for re-sterilization.',
      primaryActionLabel: 'Prioritize Case Dispatch',
      estResolutionTime: '10 mins',
      timeline: [
        { time: '10:45 AM', title: 'SYNCHRO Inventory Scan', desc: 'Pack identified in 12-hour expiry window.' }
      ]
    },
    {
      id: 'ALT-2089',
      severity: 'Information',
      alert_type: 'PATIENT_OT_READY',
      title: 'Patient Ananya Rao 100% OT Ready',
      department: 'Admissions',
      deptPillar: 'blue',
      relatedEntity: 'Ananya Rao (P-1042) • OT-02',
      patientName: 'Ananya Rao',
      patientId: 'P-1042',
      timeDetected: '1 hour ago',
      status: 'Active',
      assignedTeam: 'Front Desk & OT Transfer',
      reason: '11-Point pre-op checklist, digital consent, lab results, and CSSD-LAP-021 verified.',
      recommendedAction: 'Authorize patient transfer to OT-02 Holding Core.',
      primaryActionLabel: 'Authorize Transfer',
      estResolutionTime: '2 mins',
      timeline: [
        { time: '10:30 AM', title: 'CSSD Pack Verified', desc: 'CSSD-LAP-021 marked sterile & ready.' },
        { time: '10:32 AM', title: 'Pre-Flight Clearance Complete', desc: 'Patient marked OT READY.', isFlagged: false }
      ]
    },
    {
      id: 'ALT-2088',
      severity: 'Resolved',
      alert_type: 'ADMISSION_INTAKE_COMPLETE',
      title: 'Patient admission intake completed',
      department: 'Admissions',
      deptPillar: 'blue',
      relatedEntity: 'Rahul Mehta (P-1041) • Room R-102',
      patientName: 'Rahul Mehta',
      patientId: 'P-1041',
      timeDetected: '2 hours ago',
      status: 'Resolved',
      assignedTeam: 'Admissions Intake Desk',
      reason: 'Bed assignment and consultant allocation verified.',
      recommendedAction: 'No further action required.',
      primaryActionLabel: 'View Patient File',
      estResolutionTime: 'Resolved',
      timeline: [
        { time: '09:15 AM', title: 'Admitted to Room R-102', desc: 'Intake checklist completed.' }
      ]
    }
  ]), []);

  // ── Reactive State Initialization with Client-Side Hydration ──────────────
  const [patients, setPatients] = useState(patients_init);
  const [surgeries, setSurgeries] = useState(surgeries_init);
  const [cssd_packs, setCssdPacks] = useState(cssd_packs_init);
  const [operatingTheatres, setOperatingTheatres] = useState(operating_theatres);

  const timeline_init = useMemo(() => ([
    { id: 'evt-1', type: 'PATIENT_REGISTERED', timestamp: '08:12 AM', actor: 'Front Desk Intake', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Patient registered at main reception.' },
    { id: 'evt-2', type: 'PATIENT_ADMITTED', timestamp: '08:18 AM', actor: 'Admissions Desk', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Admitted to Ward Suite R-103 / Bed B-3.' },
    { id: 'evt-3', type: 'NURSING_ASSESSMENT_COMPLETED', timestamp: '08:35 AM', actor: 'Nursing Lead', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Baseline vitals recorded & NPO status confirmed.' },
    { id: 'evt-4', type: 'CONSULTATION_STARTED', timestamp: '09:05 AM', actor: 'Dr. Rajesh Sharma, MD', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Pre-operative assessment & clearance signed.' },
    { id: 'evt-5', type: 'PROCEDURE_SCHEDULED', timestamp: '09:20 AM', actor: 'OT Scheduler', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'ACL Reconstruction scheduled for OT-02.' },
    { id: 'evt-6', type: 'PACK_ALLOCATED', timestamp: '09:40 AM', actor: 'CSSD Sterilization', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: 'Sterile Pack CSSD-00428 allocated.' },
    { id: 'evt-7', type: 'OT_READY', timestamp: '09:45 AM', actor: 'Nursing Care', patientName: 'Meera Chen', patientCode: 'MRN-1044', desc: '11-Point readiness checklist 100% verified.' }
  ]), []);

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
