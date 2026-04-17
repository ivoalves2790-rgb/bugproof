import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return secret;
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase admin credentials not configured");
  }
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();

  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let webhookSecret: string;
  try {
    webhookSecret = getWebhookSecret();
  } catch {
    console.error("Webhook secret not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

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

      // Verify the customer_id matches the user's stored customer ID
      const { data: profile } = await admin
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

      if (!profile || profile.stripe_customer_id !== session.customer) {
        console.error("Customer ID mismatch for user:", userId);
        return NextResponse.json({ error: "Customer mismatch" }, { status: 400 });
      }

      await admin
        .from("profiles")
        .update({
          is_premium: true,
          premium_purchased_at: new Date().toISOString(),
        })
        .eq("id", userId);

      // Validate amount before recording
      const amount = session.amount_total;
      if (typeof amount !== "number" || amount <= 0) {
        console.error("Invalid amount in checkout session:", session.id);
      }

      await admin.from("payments").insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
        amount: typeof amount === "number" ? amount : 999,
        currency: session.currency || "usd",
        status: "completed",
      });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const customerId = typeof charge.customer === "string" ? charge.customer : null;

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
