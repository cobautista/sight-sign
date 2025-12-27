-- Sight-Sign Initial Database Schema
-- Migration: 20250101000001_initial_schema
-- Description: Create core tables for construction site safety induction system
-- Generated: 2025-12-28

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: workers
-- Description: Worker profiles extending Supabase Auth users
-- ============================================================================
CREATE TABLE workers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  qr_code_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast QR code validation
CREATE INDEX idx_workers_qr_hash ON workers(qr_code_hash);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workers_updated_at
  BEFORE UPDATE ON workers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: sites
-- Description: Construction sites
-- ============================================================================
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  auto_signout_time TIME DEFAULT '18:00:00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: site_admins
-- Description: Junction table for many-to-many relationship between sites and admins
-- ============================================================================
CREATE TABLE site_admins (
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  PRIMARY KEY (site_id, admin_id)
);

-- ============================================================================
-- TABLE: sign_ins
-- Description: Worker sign-in events (soft delete pattern with signed_out_at)
-- RLS Enabled, Realtime Subscriptions Enabled
-- ============================================================================
CREATE TABLE sign_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  signed_in_at TIMESTAMPTZ DEFAULT NOW(),
  signed_out_at TIMESTAMPTZ,
  signed_out_method TEXT CHECK (signed_out_method IN ('auto', 'manual', 'admin')),
  quiz_completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sign_ins_worker_site ON sign_ins(worker_id, site_id);
-- Partial index for active workers dashboard query
CREATE INDEX idx_sign_ins_active ON sign_ins(site_id) WHERE signed_out_at IS NULL;

-- ============================================================================
-- TABLE: quiz_questions
-- Description: Safety quiz questions (global or site-specific)
-- ============================================================================
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: quiz_responses
-- Description: Worker quiz responses for audit trail
-- ============================================================================
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sign_in_id UUID NOT NULL REFERENCES sign_ins(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE RESTRICT,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- Enable Realtime for sign_ins table (dashboard live updates)
-- ============================================================================
-- Note: Run this in Supabase Dashboard > Database > Replication
-- ALTER PUBLICATION supabase_realtime ADD TABLE sign_ins;
-- Sight-Sign Row Level Security Policies
-- Migration: 20250101000002_rls_policies
-- Description: Configure RLS policies for multi-tenant data isolation
-- Generated: 2025-12-28

-- ============================================================================
-- ENABLE RLS ON TABLES
-- ============================================================================
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- WORKERS TABLE POLICIES
-- ============================================================================

-- Workers can see their own profile
CREATE POLICY "Workers can view own profile"
  ON workers
  FOR SELECT
  USING (auth.uid() = id);

-- Workers can update their own profile
CREATE POLICY "Workers can update own profile"
  ON workers
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can see all workers for their managed sites
CREATE POLICY "Admins can view site workers"
  ON workers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.admin_id = auth.uid()
    )
  );

-- New workers can create their own profile during registration
CREATE POLICY "Workers can create own profile"
  ON workers
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SITES TABLE POLICIES
-- ============================================================================

-- Admins can view their managed sites
CREATE POLICY "Admins can view managed sites"
  ON sites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = id
        AND sa.admin_id = auth.uid()
    )
  );

-- Only admins can create sites (later: only super_admins)
CREATE POLICY "Admins can create sites"
  ON sites
  FOR INSERT
  WITH CHECK (true);  -- Temporary: allow any authenticated user, refine in Phase 2

-- Admins can update their managed sites
CREATE POLICY "Admins can update managed sites"
  ON sites
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- SITE_ADMINS TABLE POLICIES
-- ============================================================================

-- Admins can view their own site assignments
CREATE POLICY "Admins can view own assignments"
  ON site_admins
  FOR SELECT
  USING (admin_id = auth.uid());

-- Admins can view other admins for their managed sites
CREATE POLICY "Admins can view site admins"
  ON site_admins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = site_admins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Only admins can add new admins to their sites
CREATE POLICY "Admins can add site admins"
  ON site_admins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- SIGN_INS TABLE POLICIES
-- ============================================================================

-- Workers can see their own sign-in history
CREATE POLICY "Workers can view own sign-ins"
  ON sign_ins
  FOR SELECT
  USING (worker_id = auth.uid());

-- Admins can see sign-ins for their managed sites
CREATE POLICY "Admins can view site sign-ins"
  ON sign_ins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = sign_ins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Only admins can create sign-ins (via QR scan)
CREATE POLICY "Admins can create sign-ins"
  ON sign_ins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = sign_ins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Workers can update their own sign-ins (quiz completion)
CREATE POLICY "Workers can update own sign-ins"
  ON sign_ins
  FOR UPDATE
  USING (worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid());

-- Admins can update sign-ins for their sites (manual sign-out)
CREATE POLICY "Admins can update site sign-ins"
  ON sign_ins
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = sign_ins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- QUIZ_QUESTIONS TABLE POLICIES
-- ============================================================================

-- Everyone can view global quiz questions (site_id IS NULL)
CREATE POLICY "Anyone can view global quiz questions"
  ON quiz_questions
  FOR SELECT
  USING (site_id IS NULL);

-- Admins can view site-specific questions for their sites
CREATE POLICY "Admins can view site quiz questions"
  ON quiz_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = quiz_questions.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Admins can create quiz questions for their sites
CREATE POLICY "Admins can create quiz questions"
  ON quiz_questions
  FOR INSERT
  WITH CHECK (
    site_id IS NULL  -- Allow global questions (Phase 2: restrict to super_admins)
    OR EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = quiz_questions.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- QUIZ_RESPONSES TABLE POLICIES
-- ============================================================================

-- Workers can view their own quiz responses
CREATE POLICY "Workers can view own quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sign_ins si
      WHERE si.id = quiz_responses.sign_in_id
        AND si.worker_id = auth.uid()
    )
  );

-- Workers can create their own quiz responses
CREATE POLICY "Workers can create own quiz responses"
  ON quiz_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sign_ins si
      WHERE si.id = sign_in_id
        AND si.worker_id = auth.uid()
    )
  );

-- Admins can view quiz responses for their managed sites
CREATE POLICY "Admins can view site quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sign_ins si
      JOIN site_admins sa ON sa.site_id = si.site_id
      WHERE si.id = quiz_responses.sign_in_id
        AND sa.admin_id = auth.uid()
    )
  );
-- Sight-Sign Quiz Questions Seed Data
-- Migration: 20250101000003_seed_quiz_questions
-- Description: Seed global OSHA-based safety quiz questions for MVP
-- Generated: 2025-12-28

-- ============================================================================
-- SEED: Global Quiz Questions (5 OSHA-based questions)
-- site_id = NULL means these are global questions for all sites
-- ============================================================================

INSERT INTO quiz_questions (
  site_id,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer,
  explanation
) VALUES
  -- Question 1: Fall Protection
  (
    NULL,
    'What is the minimum height that requires fall protection?',
    '4 feet',
    '6 feet',
    '8 feet',
    '10 feet',
    'B',
    'OSHA requires fall protection at 6 feet or higher in construction.'
  ),

  -- Question 2: Equipment Safety
  (
    NULL,
    'What does a red tag on equipment indicate?',
    'Approved for use',
    'Do not operate',
    'Needs maintenance',
    'Reserved for supervisor',
    'B',
    'Red tags mean the equipment is unsafe and should not be used.'
  ),

  -- Question 3: PPE Requirements
  (
    NULL,
    'When must hard hats be worn on a construction site?',
    'Only in hazard zones',
    'Only when overhead work',
    'At all times on site',
    'When required by supervisor',
    'C',
    'Hard hats must be worn at all times on an active construction site.'
  ),

  -- Question 4: Hazard Reporting
  (
    NULL,
    'What should you do if you notice a safety hazard?',
    'Continue working carefully',
    'Report it immediately',
    'Fix it yourself',
    'Mention it at end of day',
    'B',
    'Always report safety hazards immediately to prevent accidents.'
  ),

  -- Question 5: Training Records
  (
    NULL,
    'How long must safety training records be kept?',
    '30 days',
    '6 months',
    '1 year',
    '5 years',
    'D',
    'OSHA requires safety training records to be kept for at least 5 years.'
  );

-- ============================================================================
-- VERIFICATION: Count seeded questions
-- ============================================================================
DO $$
DECLARE
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO question_count FROM quiz_questions WHERE site_id IS NULL;
  RAISE NOTICE 'Seeded % global quiz questions', question_count;
END $$;
