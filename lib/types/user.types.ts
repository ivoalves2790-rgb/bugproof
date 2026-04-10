import type { CourseLevel, CourseSlug } from "@/lib/utils/constants";

export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  total_xp: number;
  current_level: number;
  streak_count: number;
  streak_last_date: string | null;
  longest_streak: number;
  hearts: number;
  max_hearts: number;
  hearts_last_recharge: string;
  lessons_completed: number;
  created_at: string;
  updated_at: string;
}

export interface UserCourseProgress {
  id: number;
  user_id: string;
  course_slug: CourseSlug;
  current_unit_index: number;
  current_lesson_index: number;
  course_xp: number;
  level: CourseLevel;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface UserLessonProgress {
  id: number;
  user_id: string;
  course_slug: string;
  unit_slug: string;
  lesson_slug: string;
  completed: boolean;
  score: number | null;
  xp_earned: number;
  attempts: number;
  best_score: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface AssessmentResult {
  id: number;
  user_id: string;
  course_slug: CourseSlug;
  assessed_level: CourseLevel;
  score: number;
  answers: AssessmentAnswer[];
  taken_at: string;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
}
