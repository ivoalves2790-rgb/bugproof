import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    if (userId) {
      const admin = getAdminClient();

      await admin
        .from("profiles")
        .update({
          is_premium: true,
          premium_purchased_at: new Date().toISOString(),
        })
        .eq("id", userId);

      await admin.from("payments").insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount: session.amount_total || 999,
        currency: session.currency || "usd",
        status: "completed",
      });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const customerId = charge.customer as string;

    if (customerId) {
      const admin = getAdminClient();
      await admin
        .from("profiles")
        .update({ is_premium: false })
        .eq("stripe_customer_id", customerId);
    }
  }

  return NextResponse.json({ received: true });
}
