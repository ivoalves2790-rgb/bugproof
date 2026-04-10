import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/engine/streak-tracker";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: stats } = await supabase
    .from("user_stats")
    .select("streak_count, longest_streak, streak_last_date")
    .eq("user_id", user.id)
    .single();

  if (!stats) {
    return NextResponse.json({ error: "Stats not found" }, { status: 404 });
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
