import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/engine/streak-tracker";
import { checkRateLimit, errorResponse } from "@/lib/utils/api";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  // Rate limit: 10 requests per minute per user
  if (!checkRateLimit(`streak:${user.id}`, 10, 60_000)) {
    return errorResponse("Too many requests", 429);
  }

  const { data: stats } = await supabase
    .from("user_stats")
    .select("streak_count, longest_streak, streak_last_date")
    .eq("user_id", user.id)
    .single();

  if (!stats) {
    return errorResponse("Stats not found", 404);
  }

  const result = updateStreak(
    stats.streak_count,
    stats.longest_streak,
    stats.streak_last_date
  );

  if (result.isNewDay) {
    const today = new Date().toISOString().split("T")[0];
    await supabase
      .from("user_stats")
      .update({
        streak_count: result.streakCount,
        longest_streak: result.longestStreak,
        streak_last_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  return NextResponse.json(result);
}
