import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseResults, answers } = await request.json();

  // Save per-course assessment results
  for (const result of courseResults) {
    await supabase.from("assessment_results").upsert(
      {
        user_id: user.id,
        course_slug: result.courseSlug,
        assessed_level: result.level,
        score: result.score,
        answers,
      },
      { onConflict: "user_id,course_slug" }
    );
  }

  // Mark onboarding as completed
  await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
