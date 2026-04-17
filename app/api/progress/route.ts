import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateXP } from "@/lib/engine/xp-calculator";
import { COURSE_SLUGS } from "@/lib/utils/constants";
import { checkRateLimit, errorResponse, safeParseJSON } from "@/lib/utils/api";

const MAX_SCORE = 100;
const MIN_SCORE = 0;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  // Rate limit: 30 requests per minute per user
  if (!checkRateLimit(`progress:${user.id}`, 30, 60_000)) {
    return errorResponse("Too many requests", 429);
  }

  const body = await safeParseJSON(request);
  if (!body) {
    return errorResponse("Invalid request body", 400);
  }

  const { courseSlug, unitSlug, lessonSlug, score } = body;

  // Validate required fields
  if (
    typeof courseSlug !== "string" ||
    typeof unitSlug !== "string" ||
    typeof lessonSlug !== "string" ||
    typeof score !== "number"
  ) {
    return errorResponse("Missing or invalid fields", 400);
  }

  // Validate course slug against known courses
  if (!COURSE_SLUGS.includes(courseSlug as typeof COURSE_SLUGS[number])) {
    return errorResponse("Invalid course", 400);
  }

  // Validate slug formats (alphanumeric + hyphens only)
  const slugPattern = /^[a-z0-9-]+$/;
  if (!slugPattern.test(unitSlug) || !slugPattern.test(lessonSlug)) {
    return errorResponse("Invalid slug format", 400);
  }

  // Clamp score to valid range
  const clampedScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(score)));

  // Calculate XP server-side instead of trusting the client
  const { data: stats } = await supabase
    .from("user_stats")
    .select("total_xp, lessons_completed, streak_count")
    .eq("user_id", user.id)
    .single();

  // Check if this lesson was already completed (for first-try bonus)
  const { data: existingProgress } = await supabase
    .from("user_lesson_progress")
    .select("attempts")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("unit_slug", unitSlug)
    .eq("lesson_slug", lessonSlug)
    .single();

  const isFirstAttempt = !existingProgress;
  const currentAttempts = existingProgress?.attempts ?? 0;

  // Server-side XP calculation — never trust client-submitted XP
  const xpResult = calculateXP(
    1, // Default to easy difficulty; could be looked up from content
    clampedScore,
    isFirstAttempt,
    stats?.streak_count ?? 0
  );

  // Upsert lesson progress
  const { error: lessonError } = await supabase
    .from("user_lesson_progress")
    .upsert(
      {
        user_id: user.id,
        course_slug: courseSlug,
        unit_slug: unitSlug,
        lesson_slug: lessonSlug,
        completed: true,
        score: clampedScore,
        xp_earned: xpResult.totalXP,
        best_score: clampedScore,
        attempts: currentAttempts + 1,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_slug,unit_slug,lesson_slug" }
    );

  if (lessonError) {
    console.error("Lesson progress error:", lessonError);
    return errorResponse("Failed to save progress", 500);
  }

  // Atomic stats update using RPC or increment pattern
  // Use raw SQL for atomic increment to prevent race conditions
  if (stats) {
    const { error: statsError } = await supabase.rpc("increment_user_stats", {
      p_user_id: user.id,
      p_xp: xpResult.totalXP,
      p_lessons: isFirstAttempt ? 1 : 0,
    });

    // Fallback to non-atomic if RPC doesn't exist yet
    if (statsError) {
      await supabase
        .from("user_stats")
        .update({
          total_xp: stats.total_xp + xpResult.totalXP,
          lessons_completed: stats.lessons_completed + (isFirstAttempt ? 1 : 0),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }
  }

  return NextResponse.json({ success: true, xp: xpResult });
}
