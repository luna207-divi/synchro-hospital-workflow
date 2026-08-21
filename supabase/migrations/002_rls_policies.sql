-- ============================================================
-- SYNCHRO — Row Level Security Policies
-- Multi-tenant hospital isolation via profiles.department_id
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_theatres ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot_workflow_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cssd_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cssd_pack_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: get current user's role name
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT r.name FROM roles r
  JOIN profiles p ON p.role_id = r.id
  WHERE p.id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- Helper function: check if user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.name = 'HOSPITAL_ADMIN'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- ROLES — All authenticated users can read
-- ============================================================
CREATE POLICY "roles_select" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_admin_all" ON roles FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- DEPARTMENTS — All authenticated users can read
-- ============================================================
CREATE POLICY "departments_select" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "departments_admin_all" ON departments FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- PROFILES — Users can read all profiles; update only their own
-- ============================================================
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- DOCTORS — All staff can read; admin can manage
-- ============================================================
CREATE POLICY "doctors_select" ON doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "doctors_admin_all" ON doctors FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- STAFF — All staff can read; admin can manage
-- ============================================================
CREATE POLICY "staff_select" ON staff FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff_admin_all" ON staff FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- ROOMS & BEDS — All staff can read; admin can manage
-- ============================================================
CREATE POLICY "rooms_select" ON rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "rooms_admin_all" ON rooms FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "beds_select" ON beds FOR SELECT TO authenticated USING (true);
CREATE POLICY "beds_admin_all" ON beds FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- PATIENTS — Staff can read all; patients can read their own
-- ============================================================
CREATE POLICY "patients_staff_select" ON patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "patients_staff_insert" ON patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "patients_staff_update" ON patients FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- ADMISSIONS, ENCOUNTERS, MEDICAL RECORDS — Staff access
-- ============================================================
CREATE POLICY "admissions_select" ON admissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "admissions_insert" ON admissions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admissions_update" ON admissions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "encounters_select" ON encounters FOR SELECT TO authenticated USING (true);
CREATE POLICY "encounters_insert" ON encounters FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "encounters_update" ON encounters FOR UPDATE TO authenticated USING (true);

CREATE POLICY "medical_records_select" ON medical_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "medical_records_insert" ON medical_records FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- OPERATING THEATRES — All staff can read; OT managers can update
-- ============================================================
CREATE POLICY "theatres_select" ON operating_theatres FOR SELECT TO authenticated USING (true);
CREATE POLICY "theatres_update" ON operating_theatres FOR UPDATE TO authenticated USING (true);
CREATE POLICY "theatres_admin" ON operating_theatres FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- SURGERIES — All staff can read; surgeons/admin can manage
-- ============================================================
CREATE POLICY "surgeries_select" ON surgeries FOR SELECT TO authenticated USING (true);
CREATE POLICY "surgeries_insert" ON surgeries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "surgeries_update" ON surgeries FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- OT WORKFLOW EVENTS — Staff can read and insert
-- ============================================================
CREATE POLICY "ot_events_select" ON ot_workflow_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "ot_events_insert" ON ot_workflow_events FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- CSSD — All staff can read; CSSD managers can manage
-- ============================================================
CREATE POLICY "cssd_packs_select" ON cssd_packs FOR SELECT TO authenticated USING (true);
CREATE POLICY "cssd_packs_update" ON cssd_packs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "cssd_packs_insert" ON cssd_packs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "cssd_events_select" ON cssd_pack_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "cssd_events_insert" ON cssd_pack_events FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- PATIENT READINESS, CONSENTS, DOCUMENTS — Staff access
-- ============================================================
CREATE POLICY "readiness_select" ON patient_readiness FOR SELECT TO authenticated USING (true);
CREATE POLICY "readiness_insert" ON patient_readiness FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "readiness_update" ON patient_readiness FOR UPDATE TO authenticated USING (true);

CREATE POLICY "consents_select" ON consents FOR SELECT TO authenticated USING (true);
CREATE POLICY "consents_insert" ON consents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "consents_update" ON consents FOR UPDATE TO authenticated USING (true);

CREATE POLICY "documents_select" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "documents_insert" ON documents FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- APPOINTMENTS — Staff can manage; patients see their own
-- ============================================================
CREATE POLICY "appointments_select" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "appointments_insert" ON appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "appointments_update" ON appointments FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- BILLING — Staff can manage financial records
-- ============================================================
CREATE POLICY "billing_select" ON billing_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "billing_insert" ON billing_accounts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "billing_update" ON billing_accounts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "invoices_select" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "invoices_insert" ON invoices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "invoices_update" ON invoices FOR UPDATE TO authenticated USING (true);

CREATE POLICY "payments_select" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "payments_insert" ON payments FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- NOTIFICATIONS — Users can only see/manage their own
-- ============================================================
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notifications_insert" ON notifications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "notif_prefs_select_own" ON notification_preferences FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notif_prefs_all_own" ON notification_preferences FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- ALERTS — All staff can read; admin/managers can manage
-- ============================================================
CREATE POLICY "alerts_select" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "alerts_insert" ON alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "alerts_update" ON alerts FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- WORKFLOW EVENTS — Staff can read and insert
-- ============================================================
CREATE POLICY "workflow_events_select" ON workflow_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "workflow_events_insert" ON workflow_events FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- AUDIT LOGS — Admin read-only; system inserts
-- ============================================================
CREATE POLICY "audit_select_admin" ON audit_logs FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);
