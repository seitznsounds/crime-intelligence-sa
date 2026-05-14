import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("[PAYSTACK WEBHOOK] PAYSTACK_SECRET_KEY is missing");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // 1. Verify Signature
  const body = await req.text();
  const hash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    console.warn("[PAYSTACK WEBHOOK] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. Process Event
  const event = JSON.parse(body);
  console.log(`[PAYSTACK WEBHOOK] Received event: ${event.event}`);

  if (event.event === "charge.success") {
    const data = event.data;
    const { amount, reference, customer, metadata } = data;
    const purpose = metadata?.purpose || "project"; // Default to project

    try {
      const supabase = await createServerClient();
      
      const { error } = await supabase.from("donations").insert({
        amount: amount, // in cents
        purpose: purpose,
        reference: reference,
        status: "success",
        email: customer.email,
        metadata: metadata || {}
      });

      if (error) {
        console.error("[PAYSTACK WEBHOOK] DB Insert Error:", error.message);
        // We still return 200 to Paystack to stop retries if it's a DB conflict or similar
        // but maybe we should return 500 if it's a transient error.
        // For uniqueness constraint (duplicate webhook), 200 is better.
      } else {
        console.log(`[PAYSTACK WEBHOOK] Successfully logged ${purpose} donation: ${reference}`);
      }
    } catch (err: any) {
      console.error("[PAYSTACK WEBHOOK] Server Error:", err.message);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
