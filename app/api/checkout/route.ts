import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { getValidatedOrigin, checkRateLimit, errorResponse } from "@/lib/utils/api";

const PRICE_AMOUNT = 999; // $9.99

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Not authenticated", 401);
  }

  // Rate limit: 3 checkout sessions per minute
  if (!checkRateLimit(`checkout:${user.id}`, 3, 60_000)) {
    return errorResponse("Too many requests", 429);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profile?.is_premium) {
    return errorResponse("Already premium", 400);
  }

  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  // Validate origin against allowlist to prevent redirect attacks
  const origin = getValidatedOrigin(req);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Bugproof Premium",
            description: "Ad-free experience + offline access. One-time purchase.",
          },
          unit_amount: PRICE_AMOUNT,
        },
        quantity: 1,
      },
    ],
    metadata: { user_id: user.id },
    success_url: `${origin}/upgrade/success`,
    cancel_url: `${origin}/upgrade/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
