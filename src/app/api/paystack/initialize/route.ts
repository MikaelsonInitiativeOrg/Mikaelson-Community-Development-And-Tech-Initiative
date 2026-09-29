import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Starts a Paystack payment for an organisation's gift.
 *
 * The browser sends the organisation's details and the amount; this route
 * (on the server, where PAYSTACK_SECRET_KEY lives) asks Paystack to
 * initialise a transaction and returns Paystack's checkout URL. The
 * browser then goes there; after paying, Paystack sends the donor back to
 * /sponsor/thank-you, which verifies the payment before thanking them.
 *
 * The secret key never reaches the browser. If it isn't set, this returns
 * 503 and the popup falls back to the Paystack payment page.
 */

const schema = z.object({
  organization: z.string().trim().min(2).max(160),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  // Naira, whole numbers. Paystack wants kobo (x100).
  amount: z.number().int().min(1000).max(100_000_000),
});

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Online payment isn't set up yet." }, { status: 503 });
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Please check the details and try again." }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      amount: input.amount * 100,
      currency: "NGN",
      callback_url: `${origin}/sponsor/thank-you`,
      metadata: {
        giving_as: "organization",
        organization: input.organization,
        contact_name: input.name,
        custom_fields: [
          { display_name: "Organisation", variable_name: "organization", value: input.organization },
          { display_name: "Contact name", variable_name: "contact_name", value: input.name },
        ],
      },
    }),
    cache: "no-store",
  }).catch(() => null);

  const data = res ? await res.json().catch(() => null) : null;
  if (!res?.ok || !data?.status || !data?.data?.authorization_url) {
    return NextResponse.json({ error: "We couldn't reach Paystack. Please try again in a moment." }, { status: 502 });
  }

  return NextResponse.json({ url: data.data.authorization_url as string });
}
