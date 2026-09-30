import { NextResponse } from "next/server";
import crypto from "crypto";
import { processSponsorshipEmail } from "@/lib/sponsorship-notification";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paystack secret is not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook signature with secret key
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);

    if (event?.event === "charge.success") {
      const data = event.data;
      const amount = Number(data.amount) / 100;
      const organization = data.metadata?.organization;
      const contactName = data.metadata?.contact_name;
      const email = data.customer?.email;

      await processSponsorshipEmail({
        reference: data.reference,
        amount,
        email,
        organization,
        contactName,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
