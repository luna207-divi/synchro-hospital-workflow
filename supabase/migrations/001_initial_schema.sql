-- ============================================================
-- SYNCHRO — Hospital Workflow Database Schema
-- 28 Normalized Tables · PostgreSQL · Supabase
-- ============================================================
-- Run in Supabase SQL Editor or via supabase migration
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ROLES
-- ============================================================
CREATE TABLE roles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT UNIQUE NOT NULL,            -- e.g. 'HOSPITAL_ADMIN'
  display_name  TEXT NOT NULL,                   -- e.g. 'Hospital Administrator'
  description   TEXT,
  permissions   JSONB DEFAULT '[]'::jsonb,       -- granular permission list
  is_system     BOOLEAN DEFAULT false,           -- true = cannot be deleted
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. DEPARTMENTS
-- ============================================================
CREATE TABLE departments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  code          TEXT UNIQUE NOT NULL,             -- e.g. 'OT', 'CSSD', 'ADM'
  description   TEXT,
  head_user_id  UUID,                             -- FK added after profiles table
  pillar_color  TEXT DEFAULT 'blue',              -- UI color mapping
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. USERS / PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id         UUID REFERENCES roles(id),
  department_id   UUID REFERENCES departments(id),
  display_name    TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  job_title       TEXT,
  avatar_initials TEXT,
  avatar_url      TEXT,
  badge_color     TEXT DEFAULT 'blue',
  is_active       BOOLEAN DEFAULT true,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Add department head FK now that profiles exists
ALTER TABLE departments
  ADD CONSTRAINT fk_dept_head FOREIGN KEY (head_user_id) REFERENCES profiles(id);

-- ============================================================
-- 4. DOCTORS (extends profiles with medical fields)
-- ============================================================
CREATE TABLE doctors (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  license_number    TEXT,
  specialty         TEXT NOT NULL,
  qualification     TEXT,
  years_experience  INTEGER DEFAULT 0,
  consultation_fee  NUMERIC(10,2),
  is_surgeon        BOOLEAN DEFAULT false,
  is_available      BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. STAFF (extends profiles with staff-specific fields)
-- ============================================================
CREATE TABLE staff (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  employee_code   TEXT UNIQUE,
  staff_type      TEXT NOT NULL CHECK (staff_type IN (
                    'NURSE', 'TECHNICIAN', 'PORTER', 'RECEPTIONIST',
                    'ADMIN', 'CSSD_TECH', 'ANESTHESIOLOGIST', 'OTHER'
                  )),
  shift           TEXT DEFAULT 'DAY' CHECK (shift IN ('DAY', 'NIGHT', 'ROTATING')),
  is_on_duty      BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. ROOMS
-- ============================================================
CREATE TABLE rooms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id),
  room_number   TEXT NOT NULL,
  room_type     TEXT NOT NULL CHECK (room_type IN (
                  'WARD', 'PRIVATE', 'ICU', 'PRE_OP', 'POST_OP',
                  'CONSULTATION', 'EMERGENCY', 'RECOVERY', 'OTHER'
                )),
  floor         TEXT,
  wing          TEXT,
  capacity      INTEGER DEFAULT 1,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. BEDS
-- ============================================================
CREATE TABLE beds (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number    TEXT NOT NULL,
  bed_type      TEXT DEFAULT 'STANDARD' CHECK (bed_type IN (
                  'STANDARD', 'ICU', 'PEDIATRIC', 'BARIATRIC', 'ELECTRIC'
                )),
  status        TEXT DEFAULT 'AVAILABLE' CHECK (status IN (
                  'AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'CLEANING'
                )),
  patient_id    UUID,                             -- FK added after patients table
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, bed_number)
);

-- ============================================================
-- 8. PATIENTS
-- ============================================================
CREATE TABLE patients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code      TEXT UNIQUE NOT NULL,          -- e.g. 'P-1024'
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  full_name         TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  date_of_birth     DATE,
  gender            TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
  blood_group       TEXT,
  contact_phone     TEXT,
  contact_email     TEXT,
  address           TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  insurance_id      TEXT,
  insurance_provider TEXT,
  allergies         TEXT[],
  medical_history   TEXT,
  admission_status  TEXT DEFAULT 'PRE_ADMISSION' CHECK (admission_status IN (
                      'PRE_ADMISSION', 'ADMITTED', 'PRE_OP', 'IN_SURGERY',
                      'POST_OP', 'RECOVERY', 'DISCHARGED', 'TRANSFERRED'
                    )),
  assigned_doctor_id UUID REFERENCES doctors(id),
  assigned_bed_id    UUID REFERENCES beds(id),
  auth_user_id       UUID REFERENCES auth.users(id),  -- optional patient login
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Now add the bed->patient FK
ALTER TABLE beds
  ADD CONSTRAINT fk_bed_patient FOREIGN KEY (patient_id) REFERENCES patients(id);

-- ============================================================
-- 9. ADMISSIONS
-- ============================================================
CREATE TABLE admissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES patients(id),
  admitting_doctor_id UUID REFERENCES doctors(id),
  department_id     UUID REFERENCES departments(id),
  bed_id            UUID REFERENCES beds(id),
  admission_number  TEXT UNIQUE NOT NULL,          -- e.g. 'ADM-2026-001'
  admission_type    TEXT DEFAULT 'ELECTIVE' CHECK (admission_type IN (
                      'ELECTIVE', 'EMERGENCY', 'TRANSFER', 'DAY_CASE'
                    )),
  status            TEXT DEFAULT 'ACTIVE' CHECK (status IN (
                      'ACTIVE', 'DISCHARGED', 'TRANSFERRED', 'CANCELLED'
                    )),
  admitted_at       TIMESTAMPTZ DEFAULT now(),
  discharged_at     TIMESTAMPTZ,
  discharge_notes   TEXT,
  diagnosis         TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 10. ENCOUNTERS
-- ============================================================
CREATE TABLE encounters (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES patients(id),
  doctor_id         UUID REFERENCES doctors(id),
  admission_id      UUID REFERENCES admissions(id),
  encounter_type    TEXT NOT NULL CHECK (encounter_type IN (
                      'CONSULTATION', 'PRE_OP_ASSESSMENT', 'SURGERY',
                      'POST_OP_REVIEW', 'FOLLOW_UP', 'EMERGENCY', 'DISCHARGE'
                    )),
  status            TEXT DEFAULT 'IN_PROGRESS' CHECK (status IN (
                      'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
                    )),
  chief_complaint   TEXT,
  notes             TEXT,
  diagnosis         TEXT,
  encounter_date    TIMESTAMPTZ DEFAULT now(),
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 11. MEDICAL RECORDS
-- ============================================================
CREATE TABLE medical_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES patients(id),
  encounter_id      UUID REFERENCES encounters(id),
  doctor_id         UUID REFERENCES doctors(id),
  record_type       TEXT NOT NULL CHECK (record_type IN (
                      'VITALS', 'LAB_RESULT', 'IMAGING', 'PRESCRIPTION',
                      'PROCEDURE_NOTE', 'PROGRESS_NOTE', 'DISCHARGE_SUMMARY',
                      'ANESTHESIA_RECORD', 'OPERATIVE_NOTE', 'OTHER'
                    )),
  title             TEXT NOT NULL,
  content           TEXT,
  data              JSONB DEFAULT '{}'::jsonb,     -- structured data (vitals, lab values)
  attachments       TEXT[],                        -- file URLs
  is_confidential   BOOLEAN DEFAULT false,
  recorded_at       TIMESTAMPTZ DEFAULT now(),
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 12. OPERATING THEATRES
-- ============================================================
CREATE TABLE operating_theatres (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suite_code      TEXT UNIQUE NOT NULL,            -- e.g. 'OT-01'
  name            TEXT,
  specialty       TEXT,
  department_id   UUID REFERENCES departments(id),
  room_id         UUID REFERENCES rooms(id),
  status          TEXT DEFAULT 'READY' CHECK (status IN (
                    'READY', 'IN_SURGERY', 'TURNOVER', 'BLOCKED',
                    'MAINTENANCE', 'CLEANING'
                  )),
  block_reason    TEXT,
  equipment       JSONB DEFAULT '[]'::jsonb,
  utilization     NUMERIC(5,2) DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 13. SURGERIES
-- ============================================================
CREATE TABLE surgeries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          UUID NOT NULL REFERENCES patients(id),
  lead_surgeon_id     UUID NOT NULL REFERENCES doctors(id),
  assistant_surgeon_id UUID REFERENCES doctors(id),
  anesthesiologist_id UUID REFERENCES staff(id),
  theatre_id          UUID REFERENCES operating_theatres(id),
  admission_id        UUID REFERENCES admissions(id),
  encounter_id        UUID REFERENCES encounters(id),
  surgery_code        TEXT UNIQUE NOT NULL,         -- e.g. 'SURG-2026-042'
  procedure_name      TEXT NOT NULL,
  procedure_type      TEXT,                         -- e.g. 'Laparoscopic', 'Open'
  urgency             TEXT DEFAULT 'ELECTIVE' CHECK (urgency IN (
                        'ELECTIVE', 'URGENT', 'EMERGENCY'
                      )),
  status              TEXT DEFAULT 'SCHEDULED' CHECK (status IN (
                        'SCHEDULED', 'PRE_OP', 'READY', 'BLOCKED',
                        'IN_SURGERY', 'POST_OP', 'COMPLETED', 'CANCELLED'
                      )),
  block_reason        TEXT,
  scheduled_date      DATE NOT NULL,
  scheduled_start     TIMESTAMPTZ NOT NULL,
  scheduled_end       TIMESTAMPTZ,
  actual_start        TIMESTAMPTZ,
  actual_end          TIMESTAMPTZ,
  estimated_duration  INTEGER,                     -- minutes
  actual_duration     INTEGER,                     -- minutes
  pre_op_notes        TEXT,
  operative_notes     TEXT,
  post_op_notes       TEXT,
  complications       TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 14. OT WORKFLOW EVENTS
-- ============================================================
CREATE TABLE ot_workflow_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surgery_id      UUID NOT NULL REFERENCES surgeries(id) ON DELETE CASCADE,
  theatre_id      UUID REFERENCES operating_theatres(id),
  event_type      TEXT NOT NULL CHECK (event_type IN (
                    'PATIENT_ARRIVED', 'ANESTHESIA_START', 'INCISION_START',
                    'INCISION_CLOSE', 'PATIENT_OUT', 'TURNOVER_START',
                    'TURNOVER_COMPLETE', 'SUITE_READY', 'DELAY_REPORTED',
                    'BLOCK_RAISED', 'BLOCK_RESOLVED', 'STATUS_CHANGE', 'OTHER'
                  )),
  from_status     TEXT,
  to_status       TEXT,
  performed_by    UUID REFERENCES profiles(id),
  notes           TEXT,
  metadata        JSONB DEFAULT '{}'::jsonb,
  event_at        TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 15. CSSD PACKS
-- ============================================================
CREATE TABLE cssd_packs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_code             TEXT UNIQUE NOT NULL,       -- e.g. 'CSSD-00428'
  pack_name             TEXT NOT NULL,
  pack_type             TEXT,                       -- e.g. 'Laparoscopic Cholecystectomy'
  department_id         UUID REFERENCES departments(id),
  status                TEXT DEFAULT 'DIRTY' CHECK (status IN (
                          'DIRTY', 'WASHING', 'STERILIZING', 'COOLING',
                          'STERILE', 'DISPATCHED', 'IN_USE', 'EXPIRED', 'RETIRED'
                        )),
  autoclave_id          TEXT,
  autoclave_cycle       TEXT,
  sterilization_method  TEXT DEFAULT 'STEAM',
  sterilization_verified BOOLEAN DEFAULT false,
  sterile_expiry        TIMESTAMPTZ,
  current_location      TEXT,
  rfid_tag              TEXT,
  instrument_count      INTEGER DEFAULT 0,
  instruments           JSONB DEFAULT '[]'::jsonb,  -- list of instruments in pack
  assigned_theatre_id   UUID REFERENCES operating_theatres(id),
  assigned_surgery_id   UUID REFERENCES surgeries(id),
  last_used_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 16. CSSD PACK EVENTS (lifecycle tracking)
-- ============================================================
CREATE TABLE cssd_pack_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id         UUID NOT NULL REFERENCES cssd_packs(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL CHECK (event_type IN (
                    'RECEIVED_DIRTY', 'WASH_START', 'WASH_COMPLETE',
                    'STERILIZE_START', 'STERILIZE_COMPLETE', 'COOLING_START',
                    'COOLING_COMPLETE', 'MARKED_STERILE', 'DISPATCHED',
                    'RECEIVED_AT_OT', 'IN_USE', 'RETURNED', 'EXPIRED',
                    'SPORE_TEST_PASS', 'SPORE_TEST_FAIL', 'QUALITY_CHECK'
                  )),
  from_status     TEXT,
  to_status       TEXT,
  performed_by    UUID REFERENCES profiles(id),
  theatre_id      UUID REFERENCES operating_theatres(id),
  surgery_id      UUID REFERENCES surgeries(id),
  notes           TEXT,
  metadata        JSONB DEFAULT '{}'::jsonb,
  event_at        TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 17. PATIENT READINESS (pre-op checklist)
-- ============================================================
CREATE TABLE patient_readiness (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  surgery_id      UUID REFERENCES surgeries(id),
  check_type      TEXT NOT NULL CHECK (check_type IN (
                    'IDENTITY_VERIFIED', 'CONSENT_SIGNED', 'NPO_CONFIRMED',
                    'BLOOD_TYPED', 'ALLERGY_CHECKED', 'VITALS_RECORDED',
                    'IV_ACCESS', 'PREMEDICATION', 'SITE_MARKED',
                    'HISTORY_REVIEWED', 'IMAGING_AVAILABLE', 'LABS_REVIEWED',
                    'ANTIBIOTIC_GIVEN', 'ANESTHESIA_ASSESSED', 'OTHER'
                  )),
  status          TEXT DEFAULT 'PENDING' CHECK (status IN (
                    'PENDING', 'COMPLETED', 'WAIVED', 'FAILED', 'NOT_APPLICABLE'
                  )),
  checked_by      UUID REFERENCES profiles(id),
  checked_at      TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 18. CONSENTS
-- ============================================================
CREATE TABLE consents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  surgery_id      UUID REFERENCES surgeries(id),
  consent_type    TEXT NOT NULL CHECK (consent_type IN (
                    'SURGICAL', 'ANESTHESIA', 'BLOOD_TRANSFUSION',
                    'GENERAL_TREATMENT', 'DATA_SHARING', 'RESEARCH', 'OTHER'
                  )),
  status          TEXT DEFAULT 'PENDING' CHECK (status IN (
                    'PENDING', 'SIGNED', 'REFUSED', 'WITHDRAWN', 'EXPIRED'
                  )),
  document_url    TEXT,
  signed_at       TIMESTAMPTZ,
  signed_by       TEXT,                            -- patient or guardian name
  witness_name    TEXT,
  witness_id      UUID REFERENCES profiles(id),
  expires_at      TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 19. DOCUMENTS
-- ============================================================
CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES patients(id),
  encounter_id    UUID REFERENCES encounters(id),
  surgery_id      UUID REFERENCES surgeries(id),
  uploaded_by     UUID REFERENCES profiles(id),
  document_type   TEXT NOT NULL CHECK (document_type IN (
                    'LAB_REPORT', 'IMAGING', 'PRESCRIPTION', 'CONSENT_FORM',
                    'DISCHARGE_SUMMARY', 'REFERRAL', 'INSURANCE', 'ID_PROOF',
                    'OPERATIVE_REPORT', 'ANESTHESIA_RECORD', 'OTHER'
                  )),
  title           TEXT NOT NULL,
  description     TEXT,
  file_url        TEXT,
  file_type       TEXT,                            -- 'pdf', 'jpg', etc.
  file_size       INTEGER,                         -- bytes
  is_confidential BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 20. APPOINTMENTS
-- ============================================================
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  doctor_id       UUID NOT NULL REFERENCES doctors(id),
  department_id   UUID REFERENCES departments(id),
  room_id         UUID REFERENCES rooms(id),
  appointment_code TEXT UNIQUE NOT NULL,            -- e.g. 'APT-2026-0142'
  appointment_type TEXT DEFAULT 'CONSULTATION' CHECK (appointment_type IN (
                     'CONSULTATION', 'PRE_OP_ASSESSMENT', 'FOLLOW_UP',
                     'SURGICAL', 'EMERGENCY', 'LAB', 'IMAGING', 'OTHER'
                   )),
  status          TEXT DEFAULT 'SCHEDULED' CHECK (status IN (
                    'SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS',
                    'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'
                  )),
  scheduled_date  DATE NOT NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end   TIMESTAMPTZ,
  actual_start    TIMESTAMPTZ,
  actual_end      TIMESTAMPTZ,
  reason          TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 21. BILLING ACCOUNTS
-- ============================================================
CREATE TABLE billing_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  admission_id    UUID REFERENCES admissions(id),
  account_number  TEXT UNIQUE NOT NULL,             -- e.g. 'BILL-2026-001'
  status          TEXT DEFAULT 'OPEN' CHECK (status IN (
                    'OPEN', 'PARTIALLY_PAID', 'PAID', 'OVERDUE',
                    'WRITTEN_OFF', 'INSURANCE_PENDING', 'CLOSED'
                  )),
  total_amount    NUMERIC(12,2) DEFAULT 0,
  paid_amount     NUMERIC(12,2) DEFAULT 0,
  balance         NUMERIC(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  insurance_claim_amount NUMERIC(12,2) DEFAULT 0,
  insurance_status TEXT DEFAULT 'NOT_CLAIMED' CHECK (insurance_status IN (
                     'NOT_CLAIMED', 'CLAIMED', 'APPROVED', 'REJECTED', 'PARTIAL'
                   )),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 22. INVOICES
-- ============================================================
CREATE TABLE invoices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_account_id UUID NOT NULL REFERENCES billing_accounts(id),
  patient_id        UUID NOT NULL REFERENCES patients(id),
  invoice_number    TEXT UNIQUE NOT NULL,            -- e.g. 'INV-2026-0042'
  invoice_type      TEXT DEFAULT 'STANDARD' CHECK (invoice_type IN (
                      'STANDARD', 'PRO_FORMA', 'CREDIT_NOTE', 'SUPPLEMENTARY'
                    )),
  status            TEXT DEFAULT 'DRAFT' CHECK (status IN (
                      'DRAFT', 'ISSUED', 'SENT', 'PARTIALLY_PAID',
                      'PAID', 'OVERDUE', 'CANCELLED', 'VOIDED'
                    )),
  line_items        JSONB DEFAULT '[]'::jsonb,       -- [{description, quantity, unit_price, total}]
  subtotal          NUMERIC(12,2) DEFAULT 0,
  tax_amount        NUMERIC(12,2) DEFAULT 0,
  discount_amount   NUMERIC(12,2) DEFAULT 0,
  total_amount      NUMERIC(12,2) DEFAULT 0,
  due_date          DATE,
  issued_at         TIMESTAMPTZ,
  paid_at           TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 23. PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_account_id UUID NOT NULL REFERENCES billing_accounts(id),
  invoice_id        UUID REFERENCES invoices(id),
  patient_id        UUID NOT NULL REFERENCES patients(id),
  payment_number    TEXT UNIQUE NOT NULL,            -- e.g. 'PAY-2026-0018'
  amount            NUMERIC(12,2) NOT NULL,
  payment_method    TEXT NOT NULL CHECK (payment_method IN (
                      'CASH', 'CARD', 'UPI', 'BANK_TRANSFER',
                      'INSURANCE', 'CHEQUE', 'OTHER'
                    )),
  status            TEXT DEFAULT 'COMPLETED' CHECK (status IN (
                      'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'
                    )),
  transaction_ref   TEXT,
  received_by       UUID REFERENCES profiles(id),
  paid_at           TIMESTAMPTZ DEFAULT now(),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 24. NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  severity          TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'ATTENTION', 'INFORMATION')),
  title             TEXT NOT NULL,
  description       TEXT,
  department        TEXT,
  department_pillar TEXT,
  is_read           BOOLEAN DEFAULT false,
  is_dismissed      BOOLEAN DEFAULT false,
  related_entity_type TEXT,                         -- 'surgery', 'cssd_pack', 'patient', etc.
  related_entity_id UUID,
  action_url        TEXT,
  expires_at        TIMESTAMPTZ,
  read_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 25. NOTIFICATION PREFERENCES
-- ============================================================
CREATE TABLE notification_preferences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel         TEXT NOT NULL CHECK (channel IN ('IN_APP', 'EMAIL', 'SMS', 'PUSH')),
  severity_filter TEXT[] DEFAULT ARRAY['CRITICAL', 'ATTENTION', 'INFORMATION'],
  department_filter TEXT[],
  is_enabled      BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end   TIME,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, channel)
);

-- ============================================================
-- 26. ALERTS (system-wide, not per-user)
-- ============================================================
CREATE TABLE alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type      TEXT NOT NULL CHECK (alert_type IN (
                    'CSSD_DELAY', 'OT_BLOCK', 'PATIENT_TRANSFER',
                    'TURNOVER_DELAY', 'EQUIPMENT_FAILURE', 'STAFFING',
                    'CONSENT_MISSING', 'PACK_EXPIRED', 'SCHEDULE_CONFLICT',
                    'SYSTEM', 'OTHER'
                  )),
  severity        TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  title           TEXT NOT NULL,
  description     TEXT,
  department_id   UUID REFERENCES departments(id),
  related_entity_type TEXT,
  related_entity_id UUID,
  status          TEXT DEFAULT 'ACTIVE' CHECK (status IN (
                    'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'EXPIRED', 'DISMISSED'
                  )),
  raised_by       UUID REFERENCES profiles(id),
  resolved_by     UUID REFERENCES profiles(id),
  raised_at       TIMESTAMPTZ DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 27. WORKFLOW EVENTS (generic workflow audit trail)
-- ============================================================
CREATE TABLE workflow_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT NOT NULL,                    -- 'surgery', 'cssd_pack', 'patient', 'theatre'
  entity_id       UUID NOT NULL,
  event_type      TEXT NOT NULL,                    -- 'STATUS_CHANGE', 'DISPATCH', 'ASSIGNMENT', etc.
  from_status     TEXT,
  to_status       TEXT,
  performed_by    UUID REFERENCES profiles(id),
  department_id   UUID REFERENCES departments(id),
  notes           TEXT,
  metadata        JSONB DEFAULT '{}'::jsonb,
  event_at        TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 28. AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id),
  action          TEXT NOT NULL,                     -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
  entity_type     TEXT,
  entity_id       UUID,
  old_values      JSONB,
  new_values      JSONB,
  ip_address      TEXT,
  user_agent      TEXT,
  session_id      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Patients
CREATE INDEX idx_patients_code ON patients(patient_code);
CREATE INDEX idx_patients_status ON patients(admission_status);
CREATE INDEX idx_patients_doctor ON patients(assigned_doctor_id);

-- Admissions
CREATE INDEX idx_admissions_patient ON admissions(patient_id);
CREATE INDEX idx_admissions_status ON admissions(status);

-- Encounters
CREATE INDEX idx_encounters_patient ON encounters(patient_id);
CREATE INDEX idx_encounters_admission ON encounters(admission_id);

-- Surgeries
CREATE INDEX idx_surgeries_patient ON surgeries(patient_id);
CREATE INDEX idx_surgeries_theatre ON surgeries(theatre_id);
CREATE INDEX idx_surgeries_surgeon ON surgeries(lead_surgeon_id);
CREATE INDEX idx_surgeries_date ON surgeries(scheduled_date);
CREATE INDEX idx_surgeries_status ON surgeries(status);

-- OT Workflow Events
CREATE INDEX idx_ot_events_surgery ON ot_workflow_events(surgery_id);
CREATE INDEX idx_ot_events_theatre ON ot_workflow_events(theatre_id);
CREATE INDEX idx_ot_events_time ON ot_workflow_events(event_at);

-- CSSD
CREATE INDEX idx_cssd_packs_code ON cssd_packs(pack_code);
CREATE INDEX idx_cssd_packs_status ON cssd_packs(status);
CREATE INDEX idx_cssd_packs_theatre ON cssd_packs(assigned_theatre_id);
CREATE INDEX idx_cssd_events_pack ON cssd_pack_events(pack_id);

-- Appointments
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Alerts
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- Billing
CREATE INDEX idx_billing_patient ON billing_accounts(patient_id);
CREATE INDEX idx_invoices_billing ON invoices(billing_account_id);
CREATE INDEX idx_payments_billing ON payments(billing_account_id);

-- Workflow Events
CREATE INDEX idx_workflow_entity ON workflow_events(entity_type, entity_id);
CREATE INDEX idx_workflow_time ON workflow_events(event_at);

-- Audit Logs
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_time ON audit_logs(created_at);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'roles', 'departments', 'profiles', 'doctors', 'staff',
      'rooms', 'beds', 'patients', 'admissions', 'encounters',
      'medical_records', 'operating_theatres', 'surgeries',
      'cssd_packs', 'patient_readiness', 'consents', 'documents',
      'appointments', 'billing_accounts', 'invoices', 'payments',
      'notification_preferences', 'alerts'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t
    );
  END LOOP;
END;
$$;
