-- =====================================================
-- SYNCHRO: SECURE ROLE-BASED ACCESS POLICIES
-- =====================================================

-- 1. Helper function to identify the logged-in user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_active = true
    LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_my_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;


-- 2. Enable RLS on all SYNCHRO tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instrument_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theatres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_updates ENABLE ROW LEVEL SECURITY;


-- 3. Remove previously-created policies, if any
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN (
              'profiles',
              'patients',
              'admissions',
              'alerts',
              'billing_records',
              'instrument_packs',
              'theatres',
              'workflow_updates'
          )
    LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON %I.%I',
            policy_record.policyname,
            policy_record.schemaname,
            policy_record.tablename
        );
    END LOOP;
END $$;


-- =====================================================
-- PROFILES
-- =====================================================

CREATE POLICY profiles_select_policy
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = auth.uid()
    OR lower(public.get_my_role()) = 'admin'
);

CREATE POLICY profiles_update_policy
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    id = auth.uid()
    OR lower(public.get_my_role()) = 'admin'
)
WITH CHECK (
    id = auth.uid()
    OR lower(public.get_my_role()) = 'admin'
);


-- =====================================================
-- PATIENTS
-- =====================================================

CREATE POLICY patients_select_policy
ON public.patients
FOR SELECT
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk')
);

CREATE POLICY patients_insert_policy
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'front_desk')
);

CREATE POLICY patients_update_policy
ON public.patients
FOR UPDATE
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'front_desk')
)
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'front_desk')
);


-- =====================================================
-- ADMISSIONS
-- =====================================================

CREATE POLICY admissions_select_policy
ON public.admissions
FOR SELECT
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk', 'billing')
);

CREATE POLICY admissions_insert_policy
ON public.admissions
FOR INSERT
TO authenticated
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'front_desk')
);

CREATE POLICY admissions_update_policy
ON public.admissions
FOR UPDATE
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk')
)
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk')
);


-- =====================================================
-- ALERTS
-- =====================================================

CREATE POLICY alerts_select_policy
ON public.alerts
FOR SELECT
TO authenticated
USING (
    lower(public.get_my_role()) = 'admin'
    OR lower(target_role) = lower(public.get_my_role())
);

CREATE POLICY alerts_insert_policy
ON public.alerts
FOR INSERT
TO authenticated
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk', 'billing', 'cssd')
);

CREATE POLICY alerts_update_policy
ON public.alerts
FOR UPDATE
TO authenticated
USING (
    lower(public.get_my_role()) = 'admin'
    OR lower(target_role) = lower(public.get_my_role())
)
WITH CHECK (
    lower(public.get_my_role()) = 'admin'
    OR lower(target_role) = lower(public.get_my_role())
);


-- =====================================================
-- BILLING RECORDS
-- =====================================================

CREATE POLICY billing_select_policy
ON public.billing_records
FOR SELECT
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'billing', 'front_desk')
);

CREATE POLICY billing_insert_policy
ON public.billing_records
FOR INSERT
TO authenticated
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'billing', 'front_desk')
);

CREATE POLICY billing_update_policy
ON public.billing_records
FOR UPDATE
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'billing')
)
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'billing')
);


-- =====================================================
-- INSTRUMENT PACKS / CSSD
-- =====================================================

CREATE POLICY instrument_packs_select_policy
ON public.instrument_packs
FOR SELECT
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'cssd', 'doctor', 'nurse')
);

CREATE POLICY instrument_packs_insert_policy
ON public.instrument_packs
FOR INSERT
TO authenticated
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'cssd')
);

CREATE POLICY instrument_packs_update_policy
ON public.instrument_packs
FOR UPDATE
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'cssd')
)
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'cssd')
);


-- =====================================================
-- THEATRES
-- =====================================================

CREATE POLICY theatres_select_policy
ON public.theatres
FOR SELECT
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk')
);

CREATE POLICY theatres_insert_policy
ON public.theatres
FOR INSERT
TO authenticated
WITH CHECK (
    lower(public.get_my_role()) = 'admin'
);

CREATE POLICY theatres_update_policy
ON public.theatres
FOR UPDATE
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse')
)
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse')
);


-- =====================================================
-- WORKFLOW UPDATES
-- =====================================================

CREATE POLICY workflow_updates_select_policy
ON public.workflow_updates
FOR SELECT
TO authenticated
USING (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk', 'cssd')
);

CREATE POLICY workflow_updates_insert_policy
ON public.workflow_updates
FOR INSERT
TO authenticated
WITH CHECK (
    lower(public.get_my_role()) IN
    ('admin', 'doctor', 'nurse', 'front_desk', 'cssd')
);


-- =====================================================
-- BLOCK ANONYMOUS ACCESS
-- =====================================================

REVOKE ALL ON TABLE
    public.profiles,
    public.patients,
    public.admissions,
    public.alerts,
    public.billing_records,
    public.instrument_packs,
    public.theatres,
    public.workflow_updates
FROM anon;