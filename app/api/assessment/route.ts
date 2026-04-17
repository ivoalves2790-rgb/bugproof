import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COURSE_SLUGS } from "@/lib/utils/constants";
import { checkRateLimit, errorResponse, safeParseJSON } from "@/lib/utils/api";

const VALID_LEVELS = ["novice", "apprentice", "engineer", "architect"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  // Rate limit: 5 requests per minute (assessment is rare)
  if (!checkRateLimit(`assessment:${user.id}`, 5, 60_000)) {
    return errorResponse("Too many requests", 429);
  }

  const body = await safeParseJSON(request);
  if (!body) {
    return errorResponse("Invalid request body", 400);
  }

  const { courseResults, answers } = body;

  // Validate courseResults is an array
  if (!Array.isArray(courseResults) || courseResults.length === 0) {
    return errorResponse("Invalid course results", 400);
  }

  // Validate each course result
  for (const result of courseResults) {
    if (
      typeof result !== "object" ||
      result === null ||
      typeof result.courseSlug !== "string" ||
      typeof result.level !== "string" ||
      typeof result.score !== "number"
    ) {
      return errorResponse("Invalid course result format", 400);
    }

    if (!COURSE_SLUGS.includes(result.courseSlug as typeof COURSE_SLUGS[number])) {
      return errorResponse("Invalid course slug", 400);
    }

    if (!VALID_LEVELS.includes(result.level)) {
      return errorResponse("Invalid level", 400);
    }

    if (result.score < 0 || result.score > 100) {
      return errorResponse("Score out of range", 400);
    }
  }

  // Save per-course assessment results
  for (const result of courseResults) {
    const { error } = await supabase.from("assessment_results").upsert(
      {
        user_id: user.id,
        course_slug: result.courseSlug,
        assessed_level: result.level,
        score: Math.round(result.score),
        answers: answers ?? null,
      },
      { onConflict: "user_id,course_slug" }
    );

    if (error) {
      console.error("Assessment save error:", error);
      return errorResponse("Failed to save assessment", 500);
    }
  }

  // Mark onboarding as completed
  await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
