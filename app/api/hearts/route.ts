import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateHearts } from "@/lib/engine/hearts-manager";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await request.json();

  if (action === "deduct") {
    const { data: stats } = await supabase
      .from("user_stats")
      .select("hearts")
      .eq("user_id", user.id)
      .single();

    if (!stats || stats.hearts <= 0) {
      return NextResponse.json({ error: "No hearts left" }, { status: 400 });
    }

    await supabase
      .from("user_stats")
      .update({ hearts: stats.hearts - 1 })
      .eq("user_id", user.id);

    return NextResponse.json({
      hearts: stats.hearts - 1,
      outOfHearts: stats.hearts - 1 === 0,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
