-- ============================================================
-- SYNCHRO — Realistic Demo Seed Data
-- Fictional data matching the existing UI mock data
-- ============================================================

-- ============================================================
-- ROLES (7 roles)
-- ============================================================
INSERT INTO roles (id, name, display_name, description, is_system) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'HOSPITAL_ADMIN', 'Hospital Administrator', 'Complete visibility across all operations', true),
  ('a0000000-0000-0000-0000-000000000002', 'OT_MANAGER', 'OT Manager', 'Surgical suite utilization, workflow intelligence', true),
  ('a0000000-0000-0000-0000-000000000003', 'CSSD_MANAGER', 'CSSD Manager', 'Sterile tray lifecycle, autoclave compliance', true),
  ('a0000000-0000-0000-0000-000000000004', 'ADMISSIONS_STAFF', 'Admissions Staff', 'Patient check-in, consent, pre-op readiness', true),
  ('a0000000-0000-0000-0000-000000000005', 'SURGEON', 'Surgeon', 'Surgical procedures, patient management', true),
  ('a0000000-0000-0000-0000-000000000006', 'NURSE', 'Nurse', 'Patient care, pre-op and post-op management', true),
  ('a0000000-0000-0000-0000-000000000007', 'PATIENT', 'Patient', 'Patient portal access', true);

-- ============================================================
-- DEPARTMENTS (5 departments)
-- ============================================================
INSERT INTO departments (id, name, code, description, pillar_color) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Admissions & Pre-Op', 'ADM', 'Patient intake, triage, and pre-operative preparation', 'blue'),
  ('b0000000-0000-0000-0000-000000000002', 'Operating Theatres', 'OT', 'Surgical suites and perioperative services', 'indigo'),
  ('b0000000-0000-0000-0000-000000000003', 'CSSD Sterilization', 'CSSD', 'Central Sterile Supply Department', 'teal'),
  ('b0000000-0000-0000-0000-000000000004', 'General Medicine', 'MED', 'Inpatient medical care and diagnostics', 'purple'),
  ('b0000000-0000-0000-0000-000000000005', 'Administration', 'ADMIN', 'Hospital operations and management', 'slate');

-- ============================================================
-- ROOMS (12 rooms)
-- ============================================================
INSERT INTO rooms (id, department_id, room_number, room_type, floor, wing, capacity) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'R-101', 'PRE_OP', '1', 'Pavilion A', 4),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'R-102', 'PRE_OP', '1', 'Pavilion A', 4),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'OT-01', 'OTHER', '2', 'Pavilion B', 1),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'OT-02', 'OTHER', '2', 'Pavilion B', 1),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'OT-03', 'OTHER', '2', 'Pavilion B', 1),
  ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'OT-04', 'OTHER', '2', 'Pavilion B', 1),
  ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004', 'W-201', 'WARD', '2', 'Pavilion C', 6),
  ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 'W-202', 'WARD', '2', 'Pavilion C', 6),
  ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000004', 'P-301', 'PRIVATE', '3', 'Pavilion C', 1),
  ('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000004', 'P-302', 'PRIVATE', '3', 'Pavilion C', 1),
  ('c0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000004', 'ICU-1', 'ICU', '1', 'Pavilion A', 4),
  ('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002', 'REC-1', 'RECOVERY', '2', 'Pavilion B', 6);

-- ============================================================
-- BEDS (24 beds)
-- ============================================================
INSERT INTO beds (id, room_id, bed_number, bed_type, status) VALUES
  -- Pre-Op Room 101
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'R101-A', 'STANDARD', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'R101-B', 'STANDARD', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'R101-C', 'STANDARD', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'R101-D', 'STANDARD', 'AVAILABLE'),
  -- Pre-Op Room 102
  ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'R102-A', 'STANDARD', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'R102-B', 'STANDARD', 'AVAILABLE'),
  -- Ward 201
  ('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', 'W201-1', 'STANDARD', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000007', 'W201-2', 'STANDARD', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000007', 'W201-3', 'STANDARD', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000007', 'W201-4', 'STANDARD', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000007', 'W201-5', 'STANDARD', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000007', 'W201-6', 'STANDARD', 'OCCUPIED'),
  -- Ward 202
  ('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000008', 'W202-1', 'STANDARD', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000008', 'W202-2', 'STANDARD', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000008', 'W202-3', 'STANDARD', 'AVAILABLE'),
  -- Private Rooms
  ('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000009', 'P301-A', 'ELECTRIC', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000010', 'P302-A', 'ELECTRIC', 'AVAILABLE'),
  -- ICU
  ('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000011', 'ICU-1A', 'ICU', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000011', 'ICU-1B', 'ICU', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000011', 'ICU-1C', 'ICU', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000011', 'ICU-1D', 'ICU', 'AVAILABLE'),
  -- Recovery
  ('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000012', 'REC-1A', 'STANDARD', 'AVAILABLE'),
  ('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000012', 'REC-1B', 'STANDARD', 'OCCUPIED'),
  ('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000012', 'REC-1C', 'STANDARD', 'AVAILABLE');

-- ============================================================
-- OPERATING THEATRES (4 suites — matching existing UI)
-- ============================================================
INSERT INTO operating_theatres (id, suite_code, name, specialty, department_id, room_id, status, utilization) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'OT-01', 'Operating Theatre 1', 'Orthopedics', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'IN_SURGERY', 89.2),
  ('e0000000-0000-0000-0000-000000000002', 'OT-02', 'Operating Theatre 2', 'General & Lap', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 'BLOCKED', 81.4),
  ('e0000000-0000-0000-0000-000000000003', 'OT-03', 'Operating Theatre 3', 'Sports Medicine', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 'TURNOVER', 74.6),
  ('e0000000-0000-0000-0000-000000000004', 'OT-04', 'Operating Theatre 4', 'Cardiovascular', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 'READY', 92.0);

-- Update OT-02 block reason
UPDATE operating_theatres SET block_reason = 'Sterile pack #CSSD-00421 stuck in Autoclave #2 cooldown (18 min remaining)'
WHERE suite_code = 'OT-02';

-- ============================================================
-- PATIENTS (12 patients — matching existing UI + more)
-- ============================================================
INSERT INTO patients (id, patient_code, first_name, last_name, date_of_birth, gender, blood_group, contact_phone, contact_email, emergency_contact_name, emergency_contact_phone, insurance_provider, allergies, admission_status, assigned_bed_id) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'P-1024', 'Elena', 'Rostova', '1985-03-14', 'FEMALE', 'A+', '+1-555-0124', 'e.rostova@email.com', 'Viktor Rostova', '+1-555-0125', 'BlueCross Shield', ARRAY['Penicillin'], 'PRE_OP', 'd0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000002', 'P-1025', 'Robert', 'Vance', '1972-07-22', 'MALE', 'O+', '+1-555-0126', 'r.vance@email.com', 'Maria Vance', '+1-555-0127', 'Aetna Health', NULL, 'IN_SURGERY', 'd0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000003', 'P-1026', 'Michael', 'Chen', '1990-11-08', 'MALE', 'B+', '+1-555-0128', 'm.chen@email.com', 'Lin Chen', '+1-555-0129', 'UnitedHealth', ARRAY['Latex'], 'POST_OP', 'd0000000-0000-0000-0000-000000000023'),
  ('f0000000-0000-0000-0000-000000000004', 'P-1027', 'Sarah', 'Jenkins', '1988-05-19', 'FEMALE', 'AB+', '+1-555-0130', 's.jenkins@email.com', 'Tom Jenkins', '+1-555-0131', 'Cigna', NULL, 'ADMITTED', 'd0000000-0000-0000-0000-000000000005'),
  ('f0000000-0000-0000-0000-000000000005', 'P-1028', 'James', 'Morrison', '1965-12-03', 'MALE', 'A-', '+1-555-0132', 'j.morrison@email.com', 'Claire Morrison', '+1-555-0133', 'BlueCross Shield', ARRAY['Aspirin', 'Sulfa'], 'PRE_OP', 'd0000000-0000-0000-0000-000000000007'),
  ('f0000000-0000-0000-0000-000000000006', 'P-1029', 'Priya', 'Kapoor', '1993-08-27', 'FEMALE', 'O-', '+1-555-0134', 'p.kapoor@email.com', 'Raj Kapoor', '+1-555-0135', 'Aetna Health', NULL, 'ADMITTED', 'd0000000-0000-0000-0000-000000000009'),
  ('f0000000-0000-0000-0000-000000000007', 'P-1030', 'William', 'Park', '1978-02-14', 'MALE', 'B-', '+1-555-0136', 'w.park@email.com', 'Soo Park', '+1-555-0137', 'Kaiser', NULL, 'PRE_ADMISSION', NULL),
  ('f0000000-0000-0000-0000-000000000008', 'P-1031', 'Amara', 'Okonkwo', '1995-10-11', 'FEMALE', 'A+', '+1-555-0138', 'a.okonkwo@email.com', 'Chidi Okonkwo', '+1-555-0139', 'UnitedHealth', ARRAY['Codeine'], 'ADMITTED', 'd0000000-0000-0000-0000-000000000012'),
  ('f0000000-0000-0000-0000-000000000009', 'P-1032', 'David', 'Nakamura', '1970-06-30', 'MALE', 'AB-', '+1-555-0140', 'd.nakamura@email.com', 'Yuki Nakamura', '+1-555-0141', 'Cigna', NULL, 'RECOVERY', 'd0000000-0000-0000-0000-000000000016'),
  ('f0000000-0000-0000-0000-000000000010', 'P-1033', 'Lisa', 'Fernandez', '1982-01-25', 'FEMALE', 'O+', '+1-555-0142', 'l.fernandez@email.com', 'Carlos Fernandez', '+1-555-0143', 'Humana', NULL, 'DISCHARGED', NULL),
  ('f0000000-0000-0000-0000-000000000011', 'P-1034', 'Thomas', 'Wright', '1958-09-17', 'MALE', 'A+', '+1-555-0144', 't.wright@email.com', 'Mary Wright', '+1-555-0145', 'Medicare', ARRAY['Ibuprofen'], 'ADMITTED', 'd0000000-0000-0000-0000-000000000014'),
  ('f0000000-0000-0000-0000-000000000012', 'P-1035', 'Fatima', 'Al-Hassan', '1991-04-08', 'FEMALE', 'B+', '+1-555-0146', 'f.alhassan@email.com', 'Omar Al-Hassan', '+1-555-0147', 'BlueCross Shield', NULL, 'PRE_ADMISSION', NULL);

-- ============================================================
-- DOCTORS (6 doctors)
-- Note: profile_id references will be created when auth users are set up.
-- For seed data, we use deterministic UUIDs as placeholders.
-- In production, these would reference real auth.users entries.
-- ============================================================

-- Placeholder profiles for doctors (these would normally be created via auth signup)
-- We insert directly for demo purposes
INSERT INTO doctors (id, profile_id, license_number, specialty, qualification, years_experience, consultation_fee, is_surgeon) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MED-2008-4521', 'General Surgery', 'MBBS, MS, FRCS', 18, 2500.00, true),
  ('d1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'MED-2010-3892', 'Orthopedic Surgery', 'MBBS, MS Ortho, Fellowship', 16, 3000.00, true),
  ('d1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'MED-2012-5567', 'Sports Medicine', 'MBBS, DNB Ortho', 14, 2000.00, true),
  ('d1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'MED-2005-2201', 'Cardiovascular Surgery', 'MBBS, MCh CVTS', 21, 5000.00, true),
  ('d1000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'MED-2015-7834', 'Anesthesiology', 'MBBS, MD Anesthesia', 11, 1500.00, false),
  ('d1000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'MED-2018-9012', 'General Medicine', 'MBBS, MD', 8, 1200.00, false)
ON CONFLICT DO NOTHING;

-- Update patient doctor assignments
UPDATE patients SET assigned_doctor_id = 'd1000000-0000-0000-0000-000000000001' WHERE patient_code = 'P-1024';
UPDATE patients SET assigned_doctor_id = 'd1000000-0000-0000-0000-000000000002' WHERE patient_code = 'P-1025';
UPDATE patients SET assigned_doctor_id = 'd1000000-0000-0000-0000-000000000003' WHERE patient_code = 'P-1026';
UPDATE patients SET assigned_doctor_id = 'd1000000-0000-0000-0000-000000000001' WHERE patient_code = 'P-1027';
UPDATE patients SET assigned_doctor_id = 'd1000000-0000-0000-0000-000000000004' WHERE patient_code = 'P-1028';

-- ============================================================
-- CSSD PACKS (10 packs — matching existing + expanded)
-- ============================================================
INSERT INTO cssd_packs (id, pack_code, pack_name, pack_type, department_id, status, autoclave_id, autoclave_cycle, sterilization_verified, sterile_expiry, current_location, rfid_tag, instrument_count, assigned_theatre_id) VALUES
  ('g0000000-0000-0000-0000-000000000001', 'CSSD-00421', 'Laparoscopic Cholecystectomy Pack A', 'Laparoscopic Cholecystectomy', 'b0000000-0000-0000-0000-000000000003', 'COOLING', 'AC-02', 'Cycle #2-0811', false, NULL, 'Autoclave #2', 'RFID-00421', 18, 'e0000000-0000-0000-0000-000000000002'),
  ('g0000000-0000-0000-0000-000000000002', 'CSSD-00428', 'Laparoscopic Cholecystectomy Pack B', 'Laparoscopic Cholecystectomy', 'b0000000-0000-0000-0000-000000000003', 'STERILE', 'AC-01', 'Cycle #1-0811', true, now() + interval '22 hours', 'CSSD Sterile Bay 2', 'RFID-00428', 18, NULL),
  ('g0000000-0000-0000-0000-000000000003', 'CSSD-00435', 'General Abdominal Tray', 'General Surgery', 'b0000000-0000-0000-0000-000000000003', 'STERILE', 'AC-03', 'Cycle #3-0811', true, now() + interval '36 hours', 'CSSD Sterile Bay 4', 'RFID-00435', 24, NULL),
  ('g0000000-0000-0000-0000-000000000004', 'CSSD-00440', 'Total Hip Arthroplasty Set', 'Orthopedic', 'b0000000-0000-0000-0000-000000000003', 'IN_USE', 'AC-01', 'Cycle #1-0810', true, now() + interval '12 hours', 'OT-01', 'RFID-00440', 32, 'e0000000-0000-0000-0000-000000000001'),
  ('g0000000-0000-0000-0000-000000000005', 'CSSD-00445', 'ACL Reconstruction Kit', 'Orthopedic', 'b0000000-0000-0000-0000-000000000003', 'DIRTY', NULL, NULL, false, NULL, 'CSSD Decontamination', 'RFID-00445', 22, NULL),
  ('g0000000-0000-0000-0000-000000000006', 'CSSD-00450', 'Cardiovascular Bypass Set', 'Cardiovascular', 'b0000000-0000-0000-0000-000000000003', 'STERILE', 'AC-02', 'Cycle #2-0810', true, now() + interval '48 hours', 'CSSD Sterile Bay 1', 'RFID-00450', 36, NULL),
  ('g0000000-0000-0000-0000-000000000007', 'CSSD-00455', 'Minor Procedures Tray', 'General Surgery', 'b0000000-0000-0000-0000-000000000003', 'STERILE', 'AC-03', 'Cycle #3-0810', true, now() + interval '44 hours', 'CSSD Sterile Bay 3', 'RFID-00455', 12, NULL),
  ('g0000000-0000-0000-0000-000000000008', 'CSSD-00460', 'Knee Replacement Set', 'Orthopedic', 'b0000000-0000-0000-0000-000000000003', 'STERILIZING', 'AC-01', 'Cycle #1-0811', false, NULL, 'Autoclave #1', 'RFID-00460', 28, NULL),
  ('g0000000-0000-0000-0000-000000000009', 'CSSD-00465', 'Laparotomy Set', 'General Surgery', 'b0000000-0000-0000-0000-000000000003', 'STERILE', 'AC-02', 'Cycle #2-0809', true, now() + interval '8 hours', 'CSSD Sterile Bay 5', 'RFID-00465', 20, NULL),
  ('g0000000-0000-0000-0000-000000000010', 'CSSD-00470', 'Emergency Thoracotomy Set', 'Emergency', 'b0000000-0000-0000-0000-000000000003', 'STERILE', 'AC-03', 'Cycle #3-0811', true, now() + interval '60 hours', 'CSSD Emergency Bay', 'RFID-00470', 16, NULL);

-- ============================================================
-- SURGERIES (8 surgeries — matching existing OT scenario)
-- ============================================================
INSERT INTO surgeries (id, patient_id, lead_surgeon_id, theatre_id, surgery_code, procedure_name, procedure_type, urgency, status, scheduled_date, scheduled_start, scheduled_end, estimated_duration, block_reason) VALUES
  -- OT-01: In Surgery (R. Vance - Total Hip)
  ('h0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001',
   'SURG-2026-042', 'Total Hip Arthroplasty', 'Open', 'ELECTIVE', 'IN_SURGERY',
   CURRENT_DATE, CURRENT_DATE + interval '9 hours', CURRENT_DATE + interval '12 hours 30 minutes', 210, NULL),
  
  -- OT-02: Blocked (E. Rostova - Lap Chole)
  ('h0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002',
   'SURG-2026-043', 'Laparoscopic Cholecystectomy', 'Laparoscopic', 'ELECTIVE', 'BLOCKED',
   CURRENT_DATE, CURRENT_DATE + interval '10 hours', CURRENT_DATE + interval '12 hours', 120,
   'Sterile pack #CSSD-00421 stuck in Autoclave #2 cooldown (18 min remaining)'),

  -- OT-03: Post-Op (M. Chen - ACL Reconstruction)
  ('h0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003',
   'SURG-2026-041', 'ACL Reconstruction', 'Arthroscopic', 'ELECTIVE', 'POST_OP',
   CURRENT_DATE, CURRENT_DATE + interval '8 hours 30 minutes', CURRENT_DATE + interval '11 hours', 150, NULL),

  -- OT-04: Scheduled (S. Jenkins - upcoming)
  ('h0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004',
   'SURG-2026-044', 'Appendectomy', 'Laparoscopic', 'ELECTIVE', 'SCHEDULED',
   CURRENT_DATE, CURRENT_DATE + interval '11 hours 30 minutes', CURRENT_DATE + interval '14 hours', 90, NULL),

  -- Upcoming surgeries (tomorrow)
  ('h0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001',
   'SURG-2026-045', 'Coronary Artery Bypass Graft', 'Open', 'URGENT', 'SCHEDULED',
   CURRENT_DATE + 1, (CURRENT_DATE + 1) + interval '8 hours', (CURRENT_DATE + 1) + interval '12 hours', 240, NULL),

  ('h0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002',
   'SURG-2026-046', 'Total Knee Replacement', 'Open', 'ELECTIVE', 'SCHEDULED',
   CURRENT_DATE + 1, (CURRENT_DATE + 1) + interval '10 hours', (CURRENT_DATE + 1) + interval '12 hours 30 minutes', 150, NULL),

  -- Completed surgeries (yesterday — for analytics)
  ('h0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001',
   'SURG-2026-039', 'Hernia Repair', 'Laparoscopic', 'ELECTIVE', 'COMPLETED',
   CURRENT_DATE - 1, (CURRENT_DATE - 1) + interval '9 hours', (CURRENT_DATE - 1) + interval '11 hours', 90, NULL),

  ('h0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003',
   'SURG-2026-040', 'Rotator Cuff Repair', 'Arthroscopic', 'ELECTIVE', 'COMPLETED',
   CURRENT_DATE - 1, (CURRENT_DATE - 1) + interval '13 hours', (CURRENT_DATE - 1) + interval '15 hours', 120, NULL);

-- Set actual times for completed and in-progress surgeries
UPDATE surgeries SET actual_start = scheduled_start, actual_end = scheduled_end, actual_duration = estimated_duration
WHERE status = 'COMPLETED';
UPDATE surgeries SET actual_start = scheduled_start WHERE status = 'IN_SURGERY';

-- ============================================================
-- APPOINTMENTS (12 appointments)
-- ============================================================
INSERT INTO appointments (id, patient_id, doctor_id, department_id, appointment_code, appointment_type, status, scheduled_date, scheduled_start, scheduled_end, reason) VALUES
  ('i0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'APT-2026-0142', 'PRE_OP_ASSESSMENT', 'COMPLETED', CURRENT_DATE - 3, (CURRENT_DATE - 3) + interval '10 hours', (CURRENT_DATE - 3) + interval '10 hours 30 minutes', 'Pre-op assessment for Laparoscopic Cholecystectomy'),
  ('i0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'APT-2026-0143', 'PRE_OP_ASSESSMENT', 'COMPLETED', CURRENT_DATE - 2, (CURRENT_DATE - 2) + interval '14 hours', (CURRENT_DATE - 2) + interval '14 hours 30 minutes', 'Pre-op assessment for Total Hip Arthroplasty'),
  ('i0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'APT-2026-0144', 'SURGICAL', 'SCHEDULED', CURRENT_DATE, CURRENT_DATE + interval '11 hours 30 minutes', CURRENT_DATE + interval '14 hours', 'Laparoscopic Appendectomy'),
  ('i0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'APT-2026-0145', 'PRE_OP_ASSESSMENT', 'CHECKED_IN', CURRENT_DATE, CURRENT_DATE + interval '15 hours', CURRENT_DATE + interval '15 hours 30 minutes', 'Cardiac pre-op assessment for CABG'),
  ('i0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004', 'APT-2026-0146', 'CONSULTATION', 'SCHEDULED', CURRENT_DATE + 1, (CURRENT_DATE + 1) + interval '9 hours', (CURRENT_DATE + 1) + interval '9 hours 30 minutes', 'Initial consultation — abdominal pain'),
  ('i0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'APT-2026-0147', 'FOLLOW_UP', 'SCHEDULED', CURRENT_DATE + 2, (CURRENT_DATE + 2) + interval '10 hours', (CURRENT_DATE + 2) + interval '10 hours 20 minutes', 'Post-admission follow-up'),
  ('i0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'APT-2026-0148', 'PRE_OP_ASSESSMENT', 'SCHEDULED', CURRENT_DATE, CURRENT_DATE + interval '16 hours', CURRENT_DATE + interval '16 hours 30 minutes', 'Pre-op assessment for TKR'),
  ('i0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004', 'APT-2026-0149', 'CONSULTATION', 'IN_PROGRESS', CURRENT_DATE, CURRENT_DATE + interval '9 hours 30 minutes', CURRENT_DATE + interval '10 hours', 'Chest pain evaluation'),
  ('i0000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'APT-2026-0150', 'CONSULTATION', 'SCHEDULED', CURRENT_DATE + 3, (CURRENT_DATE + 3) + interval '11 hours', (CURRENT_DATE + 3) + interval '11 hours 30 minutes', 'Gallstone consultation'),
  ('i0000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'APT-2026-0151', 'FOLLOW_UP', 'COMPLETED', CURRENT_DATE - 1, (CURRENT_DATE - 1) + interval '10 hours', (CURRENT_DATE - 1) + interval '10 hours 20 minutes', 'Post-hernia repair follow-up');

-- ============================================================
-- ADMISSIONS (8 admissions)
-- ============================================================
INSERT INTO admissions (id, patient_id, admitting_doctor_id, department_id, bed_id, admission_number, admission_type, status, admitted_at, diagnosis) VALUES
  ('j0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'ADM-2026-001', 'ELECTIVE', 'ACTIVE', now() - interval '1 day', 'Cholelithiasis — scheduled for Laparoscopic Cholecystectomy'),
  ('j0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'ADM-2026-002', 'ELECTIVE', 'ACTIVE', now() - interval '2 days', 'Osteoarthritis of the hip — Total Hip Arthroplasty'),
  ('j0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', NULL, 'ADM-2026-003', 'ELECTIVE', 'ACTIVE', now() - interval '1 day', 'ACL tear — Arthroscopic Reconstruction'),
  ('j0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005', 'ADM-2026-004', 'DAY_CASE', 'ACTIVE', now() - interval '4 hours', 'Acute appendicitis — Laparoscopic Appendectomy'),
  ('j0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000007', 'ADM-2026-005', 'URGENT', 'ACTIVE', now() - interval '3 days', 'Triple vessel disease — CABG'),
  ('j0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000009', 'ADM-2026-006', 'ELECTIVE', 'ACTIVE', now() - interval '1 day', 'Osteoarthritis of the knee — Total Knee Replacement'),
  ('j0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000016', 'ADM-2026-007', 'ELECTIVE', 'ACTIVE', now() - interval '3 days', 'Inguinal hernia — Laparoscopic Hernia Repair'),
  ('j0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', NULL, 'ADM-2026-008', 'ELECTIVE', 'DISCHARGED', now() - interval '2 days', 'Rotator cuff tear — Arthroscopic Repair');

UPDATE admissions SET discharged_at = now() - interval '6 hours', discharge_notes = 'Discharged in good condition. Follow-up in 2 weeks.' WHERE admission_number = 'ADM-2026-008';

-- ============================================================
-- BILLING ACCOUNTS (6 accounts)
-- ============================================================
INSERT INTO billing_accounts (id, patient_id, admission_id, account_number, status, total_amount, paid_amount, insurance_claim_amount, insurance_status) VALUES
  ('k0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'j0000000-0000-0000-0000-000000000001', 'BILL-2026-001', 'OPEN', 85000.00, 0.00, 60000.00, 'CLAIMED'),
  ('k0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'j0000000-0000-0000-0000-000000000002', 'BILL-2026-002', 'OPEN', 245000.00, 50000.00, 150000.00, 'APPROVED'),
  ('k0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'j0000000-0000-0000-0000-000000000003', 'BILL-2026-003', 'OPEN', 175000.00, 25000.00, 100000.00, 'CLAIMED'),
  ('k0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000005', 'j0000000-0000-0000-0000-000000000005', 'BILL-2026-004', 'OPEN', 520000.00, 100000.00, 350000.00, 'APPROVED'),
  ('k0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000009', 'j0000000-0000-0000-0000-000000000007', 'BILL-2026-005', 'PARTIALLY_PAID', 65000.00, 40000.00, 0.00, 'NOT_CLAIMED'),
  ('k0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000010', 'j0000000-0000-0000-0000-000000000008', 'BILL-2026-006', 'PAID', 142000.00, 142000.00, 100000.00, 'APPROVED');

-- ============================================================
-- INVOICES (6 invoices)
-- ============================================================
INSERT INTO invoices (id, billing_account_id, patient_id, invoice_number, invoice_type, status, line_items, subtotal, tax_amount, total_amount, due_date, issued_at) VALUES
  ('l0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'INV-2026-0042', 'STANDARD', 'ISSUED',
   '[{"description": "OT Charges - Lap Cholecystectomy", "quantity": 1, "unit_price": 45000, "total": 45000}, {"description": "Surgeon Fee", "quantity": 1, "unit_price": 25000, "total": 25000}, {"description": "Anesthesia", "quantity": 1, "unit_price": 12000, "total": 12000}, {"description": "Room (1 day)", "quantity": 1, "unit_price": 3000, "total": 3000}]'::jsonb,
   85000.00, 0.00, 85000.00, CURRENT_DATE + 30, now()),
  ('l0000000-0000-0000-0000-000000000002', 'k0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'INV-2026-0043', 'STANDARD', 'PARTIALLY_PAID',
   '[{"description": "OT Charges - Total Hip Arthroplasty", "quantity": 1, "unit_price": 120000, "total": 120000}, {"description": "Prosthesis (Implant)", "quantity": 1, "unit_price": 80000, "total": 80000}, {"description": "Surgeon Fee", "quantity": 1, "unit_price": 30000, "total": 30000}, {"description": "Room (3 days)", "quantity": 3, "unit_price": 5000, "total": 15000}]'::jsonb,
   245000.00, 0.00, 245000.00, CURRENT_DATE + 30, now() - interval '1 day'),
  ('l0000000-0000-0000-0000-000000000003', 'k0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000005', 'INV-2026-0044', 'PRO_FORMA', 'ISSUED',
   '[{"description": "OT Charges - CABG", "quantity": 1, "unit_price": 250000, "total": 250000}, {"description": "Surgeon Fee", "quantity": 1, "unit_price": 80000, "total": 80000}, {"description": "ICU (est. 3 days)", "quantity": 3, "unit_price": 25000, "total": 75000}, {"description": "Consumables", "quantity": 1, "unit_price": 45000, "total": 45000}, {"description": "Room (est. 7 days)", "quantity": 7, "unit_price": 10000, "total": 70000}]'::jsonb,
   520000.00, 0.00, 520000.00, CURRENT_DATE + 30, now()),
  ('l0000000-0000-0000-0000-000000000004', 'k0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000010', 'INV-2026-0040', 'STANDARD', 'PAID',
   '[{"description": "OT Charges - Rotator Cuff Repair", "quantity": 1, "unit_price": 65000, "total": 65000}, {"description": "Surgeon Fee", "quantity": 1, "unit_price": 25000, "total": 25000}, {"description": "Anesthesia", "quantity": 1, "unit_price": 12000, "total": 12000}, {"description": "Room (2 days)", "quantity": 2, "unit_price": 5000, "total": 10000}, {"description": "Physiotherapy", "quantity": 3, "unit_price": 10000, "total": 30000}]'::jsonb,
   142000.00, 0.00, 142000.00, CURRENT_DATE + 15, now() - interval '2 days');

-- ============================================================
-- PAYMENTS (5 payments)
-- ============================================================
INSERT INTO payments (id, billing_account_id, invoice_id, patient_id, payment_number, amount, payment_method, status, transaction_ref, paid_at) VALUES
  ('m0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000002', 'l0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'PAY-2026-0018', 50000.00, 'CARD', 'COMPLETED', 'TXN-VISA-8842', now() - interval '1 day'),
  ('m0000000-0000-0000-0000-000000000002', 'k0000000-0000-0000-0000-000000000003', NULL, 'f0000000-0000-0000-0000-000000000003', 'PAY-2026-0019', 25000.00, 'UPI', 'COMPLETED', 'UPI-REF-99421', now() - interval '6 hours'),
  ('m0000000-0000-0000-0000-000000000003', 'k0000000-0000-0000-0000-000000000004', 'l0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000005', 'PAY-2026-0020', 100000.00, 'BANK_TRANSFER', 'COMPLETED', 'NEFT-REF-20260811', now() - interval '2 days'),
  ('m0000000-0000-0000-0000-000000000004', 'k0000000-0000-0000-0000-000000000005', NULL, 'f0000000-0000-0000-0000-000000000009', 'PAY-2026-0021', 40000.00, 'CASH', 'COMPLETED', NULL, now() - interval '1 day'),
  ('m0000000-0000-0000-0000-000000000005', 'k0000000-0000-0000-0000-000000000006', 'l0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000010', 'PAY-2026-0022', 142000.00, 'INSURANCE', 'COMPLETED', 'INS-CLM-BC-44521', now() - interval '6 hours');

-- ============================================================
-- ALERTS (5 active alerts — matching existing UI)
-- ============================================================
INSERT INTO alerts (id, alert_type, severity, title, description, department_id, related_entity_type, related_entity_id, status, raised_at) VALUES
  ('n0000000-0000-0000-0000-000000000001', 'CSSD_DELAY', 'CRITICAL', 'OT-02 waiting for CSSD pack',
   'Sterile pack #CSSD-00421 stuck in Autoclave #2 cooldown (18 min remaining). OT-02 blocked for Lap Cholecystectomy.',
   'b0000000-0000-0000-0000-000000000003', 'cssd_pack', 'g0000000-0000-0000-0000-000000000001', 'ACTIVE', now() - interval '22 minutes'),
  ('n0000000-0000-0000-0000-000000000002', 'PACK_EXPIRED', 'CRITICAL', 'Expired CSSD pack detected',
   'Pack CSSD-EXP-09 (General Laparotomy Set #02) exceeded 72-hour sterile validity in Storage B.',
   'b0000000-0000-0000-0000-000000000003', 'cssd_pack', NULL, 'ACTIVE', now() - interval '4 minutes'),
  ('n0000000-0000-0000-0000-000000000003', 'TURNOVER_DELAY', 'HIGH', 'OT-03 turnover exceeds benchmark',
   'Turnover duration currently at 34m against 25m hospital benchmark target. Biohazard protocol sanitation in progress.',
   'b0000000-0000-0000-0000-000000000002', 'operating_theatre', 'e0000000-0000-0000-0000-000000000003', 'ACTIVE', now() - interval '12 minutes'),
  ('n0000000-0000-0000-0000-000000000004', 'PATIENT_TRANSFER', 'MEDIUM', 'Patient transfer pending',
   'Porter transport dispatch for Patient P-1024 delayed by radiology transfer in corridor 4C.',
   'b0000000-0000-0000-0000-000000000001', 'patient', 'f0000000-0000-0000-0000-000000000001', 'ACTIVE', now() - interval '16 minutes'),
  ('n0000000-0000-0000-0000-000000000005', 'SCHEDULE_CONFLICT', 'LOW', 'Potential scheduling overlap',
   'OT-04 has back-to-back cases with only 20m gap. May need buffer extension.',
   'b0000000-0000-0000-0000-000000000002', 'operating_theatre', 'e0000000-0000-0000-0000-000000000004', 'ACKNOWLEDGED', now() - interval '45 minutes');

-- ============================================================
-- CONSENTS (for active surgery patients)
-- ============================================================
INSERT INTO consents (id, patient_id, surgery_id, consent_type, status, signed_at, signed_by) VALUES
  ('o0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'SURGICAL', 'SIGNED', now() - interval '18 hours', 'Elena Rostova'),
  ('o0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'ANESTHESIA', 'SIGNED', now() - interval '18 hours', 'Elena Rostova'),
  ('o0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000002', 'h0000000-0000-0000-0000-000000000001', 'SURGICAL', 'SIGNED', now() - interval '36 hours', 'Robert Vance'),
  ('o0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000002', 'h0000000-0000-0000-0000-000000000001', 'ANESTHESIA', 'SIGNED', now() - interval '36 hours', 'Robert Vance'),
  ('o0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000002', 'h0000000-0000-0000-0000-000000000001', 'BLOOD_TRANSFUSION', 'SIGNED', now() - interval '36 hours', 'Robert Vance'),
  ('o0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000004', 'h0000000-0000-0000-0000-000000000004', 'SURGICAL', 'PENDING', NULL, NULL),
  ('o0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000004', 'h0000000-0000-0000-0000-000000000004', 'ANESTHESIA', 'PENDING', NULL, NULL);

-- ============================================================
-- PATIENT READINESS (pre-op checklist for P-1024)
-- ============================================================
INSERT INTO patient_readiness (id, patient_id, surgery_id, check_type, status, checked_at) VALUES
  ('p0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'IDENTITY_VERIFIED', 'COMPLETED', now() - interval '2 hours'),
  ('p0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'CONSENT_SIGNED', 'COMPLETED', now() - interval '18 hours'),
  ('p0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'NPO_CONFIRMED', 'COMPLETED', now() - interval '1 hour'),
  ('p0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'BLOOD_TYPED', 'COMPLETED', now() - interval '20 hours'),
  ('p0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'ALLERGY_CHECKED', 'COMPLETED', now() - interval '2 hours'),
  ('p0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'VITALS_RECORDED', 'COMPLETED', now() - interval '30 minutes'),
  ('p0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'IV_ACCESS', 'COMPLETED', now() - interval '45 minutes'),
  ('p0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'HISTORY_REVIEWED', 'COMPLETED', now() - interval '3 hours'),
  ('p0000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'SITE_MARKED', 'COMPLETED', now() - interval '1 hour'),
  ('p0000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000002', 'ANESTHESIA_ASSESSED', 'COMPLETED', now() - interval '2 hours');
