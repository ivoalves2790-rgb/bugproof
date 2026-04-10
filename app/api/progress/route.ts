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

  const body = await request.json();
  const { courseSlug, unitSlug, lessonSlug, score, xpEarned } = body;

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
        score,
        xp_earned: xpEarned,
        best_score: score,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_slug,unit_slug,lesson_slug" }
    );

  if (lessonError) {
    return NextResponse.json({ error: lessonError.message }, { status: 500 });
  }

  // Update user stats (increment XP and lesson count)
  const { data: stats } = await supabase
    .from("user_stats")
    .select("total_xp, lessons_completed")
    .eq("user_id", user.id)
    .single();

  if (stats) {
    await supabase
      .from("user_stats")
      .update({
        total_xp: stats.total_xp + xpEarned,
        lessons_completed: stats.lessons_completed + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  return NextResponse.json({ success: true });
}
