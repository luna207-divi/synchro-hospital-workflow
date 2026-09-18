-- ============================================================
-- SYNCHRO — Migration 005: Member Registrations & ID Verification
-- ============================================================

-- 1. Create member_registrations table for pending team signups
CREATE TABLE IF NOT EXISTS public.member_registrations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           TEXT NOT NULL,
  dob                 DATE,
  gender              TEXT,
  phone               TEXT,
  email               TEXT NOT NULL,
  employee_id         TEXT NOT NULL,
  date_of_joining     DATE,
  department          TEXT NOT NULL,
  requested_role      TEXT NOT NULL,
  hospital_facility   TEXT DEFAULT 'SYNCHRO Central Hospital',
  id_proof_type       TEXT NOT NULL,
  id_proof_file_path  TEXT NOT NULL,
  id_proof_file_name  TEXT,
  id_proof_file_size  INTEGER,
  status              TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by         UUID REFERENCES public.profiles(id),
  reviewed_at         TIMESTAMPTZ,
  rejection_reason    TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.member_registrations ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for member_registrations
DO $$
BEGIN
    DROP POLICY IF EXISTS member_registrations_insert_policy ON public.member_registrations;
    DROP POLICY IF EXISTS member_registrations_select_policy ON public.member_registrations;
    DROP POLICY IF EXISTS member_registrations_update_policy ON public.member_registrations;
END $$;

-- Allow anonymous or authenticated to submit registration
CREATE POLICY member_registrations_insert_policy ON public.member_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow user to view their own registration OR Admin to view all
CREATE POLICY member_registrations_select_policy ON public.member_registrations
  FOR SELECT TO authenticated, anon
  USING (
    user_id = auth.uid()
    OR lower(public.get_my_role()) = 'admin'
  );

-- Only Admin can update registration status
CREATE POLICY member_registrations_update_policy ON public.member_registrations
  FOR UPDATE TO authenticated
  USING (lower(public.get_my_role()) = 'admin')
  WITH CHECK (lower(public.get_my_role()) = 'admin');

-- 4. Create Private Storage Bucket for ID Proof Documents if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-proofs', 'id-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Object Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow upload to id-proofs bucket" ON storage.objects;
    DROP POLICY IF EXISTS "Allow admin access to id-proofs bucket" ON storage.objects;
END $$;

CREATE POLICY "Allow upload to id-proofs bucket"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'id-proofs');

CREATE POLICY "Allow admin access to id-proofs bucket"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'id-proofs' AND (auth.uid() = owner OR lower(public.get_my_role()) = 'admin'));
