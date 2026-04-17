-- ==========================================================
-- Migration 005: Security hardening, constraints, and indexes
-- ==========================================================

-- ===== CHECK CONSTRAINTS =====

-- user_stats: prevent negative/invalid values
ALTER TABLE public.user_stats
  ADD CONSTRAINT chk_total_xp_non_negative CHECK (total_xp >= 0),
  ADD CONSTRAINT chk_current_level_positive CHECK (current_level >= 1),
  ADD CONSTRAINT chk_streak_count_non_negative CHECK (streak_count >= 0),
  ADD CONSTRAINT chk_longest_streak_non_negative CHECK (longest_streak >= 0),
  ADD CONSTRAINT chk_hearts_non_negative CHECK (hearts >= 0),
  ADD CONSTRAINT chk_max_hearts_positive CHECK (max_hearts >= 1),
  ADD CONSTRAINT chk_hearts_le_max CHECK (hearts <= max_hearts),
  ADD CONSTRAINT chk_lessons_completed_non_negative CHECK (lessons_completed >= 0);

-- user_course_progress: validate ranges
ALTER TABLE public.user_course_progress
  ADD CONSTRAINT chk_unit_index_non_negative CHECK (current_unit_index >= 0),
  ADD CONSTRAINT chk_lesson_index_non_negative CHECK (current_lesson_index >= 0),
  ADD CONSTRAINT chk_course_xp_non_negative CHECK (course_xp >= 0);

-- user_lesson_progress: validate score ranges
ALTER TABLE public.user_lesson_progress
  ADD CONSTRAINT chk_score_range CHECK (score >= 0 AND score <= 100),
  ADD CONSTRAINT chk_best_score_range CHECK (best_score >= 0 AND best_score <= 100),
  ADD CONSTRAINT chk_xp_earned_non_negative CHECK (xp_earned >= 0),
  ADD CONSTRAINT chk_attempts_positive CHECK (attempts >= 0);

-- assessment_results: validate score range
ALTER TABLE public.assessment_results
  ADD CONSTRAINT chk_assessment_score_range CHECK (score >= 0 AND score <= 100),
  ADD CONSTRAINT chk_assessed_level_valid CHECK (assessed_level IN ('novice', 'apprentice', 'engineer', 'architect'));

-- payments: validate amounts
ALTER TABLE public.payments
  ADD CONSTRAINT chk_amount_positive CHECK (amount > 0),
  ADD CONSTRAINT chk_status_valid CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));

-- ===== INDEXES for query performance =====

-- payments: user lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments (created_at);

-- user_stats: streak queries
CREATE INDEX IF NOT EXISTS idx_user_stats_streak_last_date ON public.user_stats (streak_last_date);

-- user_lesson_progress: completion queries
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed_at ON public.user_lesson_progress (completed_at);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course ON public.user_lesson_progress (user_id, course_slug);

-- user_course_progress: course lookups
CREATE INDEX IF NOT EXISTS idx_course_progress_completed ON public.user_course_progress (completed_at)
  WHERE completed_at IS NOT NULL;

-- assessment_results: time-based queries
CREATE INDEX IF NOT EXISTS idx_assessment_taken_at ON public.assessment_results (taken_at);

-- ===== RLS POLICY FIXES =====

-- Fix: Profiles should only be viewable by authenticated users, not everyone
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Add explicit DELETE deny policies to prevent accidental deletions
-- (RLS implicitly denies when no policy exists, but explicit is clearer)

CREATE POLICY "Users cannot delete own profile"
  ON public.profiles FOR DELETE
  USING (false);

CREATE POLICY "Users cannot delete own stats"
  ON public.user_stats FOR DELETE
  USING (false);

CREATE POLICY "Users cannot delete course progress"
  ON public.user_course_progress FOR DELETE
  USING (false);

CREATE POLICY "Users cannot delete lesson progress"
  ON public.user_lesson_progress FOR DELETE
  USING (false);

CREATE POLICY "Users cannot delete assessment results"
  ON public.assessment_results FOR DELETE
  USING (false);

CREATE POLICY "Users cannot delete payments"
  ON public.payments FOR DELETE
  USING (false);

-- ===== ATOMIC INCREMENT FUNCTION =====
-- Used by the progress API to avoid read-then-update race conditions

CREATE OR REPLACE FUNCTION public.increment_user_stats(
  p_user_id uuid,
  p_xp integer,
  p_lessons integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.user_stats
  SET
    total_xp = total_xp + p_xp,
    lessons_completed = lessons_completed + p_lessons,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;
