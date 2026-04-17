import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateHearts } from "@/lib/engine/hearts-manager";
import { checkRateLimit, errorResponse, safeParseJSON } from "@/lib/utils/api";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  // Rate limit: 60 requests per minute per user
  if (!checkRateLimit(`hearts-get:${user.id}`, 60, 60_000)) {
    return errorResponse("Too many requests", 429);
  }

  const { data: stats } = await supabase
    .from("user_stats")
    .select("hearts, max_hearts, hearts_last_recharge")
    .eq("user_id", user.id)
    .single();

  if (!stats) {
    return NextResponse.json({ hearts: 3, maxHearts: 3, canPlay: true });
  }

  const heartsState = calculateHearts(
    stats.hearts,
    stats.max_hearts,
    new Date(stats.hearts_last_recharge)
  );

  // Update if hearts were recharged
  if (heartsState.hearts > stats.hearts) {
    await supabase
      .from("user_stats")
      .update({
        hearts: heartsState.hearts,
        hearts_last_recharge: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  return NextResponse.json(heartsState);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  // Rate limit: 10 requests per minute for heart deductions
  if (!checkRateLimit(`hearts-post:${user.id}`, 10, 60_000)) {
    return errorResponse("Too many requests", 429);
  }

  const body = await safeParseJSON(request);
  if (!body) {
    return errorResponse("Invalid request body", 400);
  }

  const { action } = body;

  if (action !== "deduct") {
    return errorResponse("Invalid action", 400);
  }

  // Atomic deduction: only deduct if hearts > 0, using a conditional update
  const { data: stats } = await supabase
    .from("user_stats")
    .select("hearts")
    .eq("user_id", user.id)
    .single();

  if (!stats || stats.hearts <= 0) {
    return errorResponse("No hearts left", 400);
  }

  // Use .gt() filter to prevent race condition: only update if hearts still > 0
  const { data: updated, error } = await supabase
    .from("user_stats")
    .update({
      hearts: stats.hearts - 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .gt("hearts", 0)
    .select("hearts")
    .single();

  if (error || !updated) {
    return errorResponse("No hearts left", 400);
  }

  return NextResponse.json({
    hearts: updated.hearts,
    outOfHearts: updated.hearts === 0,
  });
}
