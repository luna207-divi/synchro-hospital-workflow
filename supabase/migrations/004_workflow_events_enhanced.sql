-- ============================================================
-- SYNCHRO — Migration 004: Enhanced Workflow Events Schema
-- Adds explicit columns matching central workflow engine event structure
-- ============================================================

-- Add missing columns to workflow_events if not present
ALTER TABLE workflow_events
  ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS surgery_id UUID REFERENCES surgeries(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS previous_status TEXT,
  ADD COLUMN IF NOT EXISTS new_status TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS event_timestamp TIMESTAMPTZ DEFAULT now();

-- Update existing rows to populate alias fields from legacy schema
UPDATE workflow_events
SET 
  previous_status = COALESCE(previous_status, from_status),
  new_status = COALESCE(new_status, to_status),
  user_id = COALESCE(user_id, performed_by),
  event_timestamp = COALESCE(event_timestamp, event_at);

-- Create indexes for sub-second queries across portals
CREATE INDEX IF NOT EXISTS idx_workflow_patient ON workflow_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_workflow_surgery ON workflow_events(surgery_id);
CREATE INDEX IF NOT EXISTS idx_workflow_dept ON workflow_events(department);
CREATE INDEX IF NOT EXISTS idx_workflow_type ON workflow_events(event_type);
CREATE INDEX IF NOT EXISTS idx_workflow_timestamp ON workflow_events(event_timestamp DESC);

-- Enable Supabase Realtime publication for workflow_events
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_events;
