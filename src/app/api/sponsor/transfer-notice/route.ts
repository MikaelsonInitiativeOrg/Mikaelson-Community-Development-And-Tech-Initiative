import { NextResponse } from "next/server";
import { z } from "zod";
import {
  sendEmail,
  buildTransferNoticeNotificationEmail,
  buildTransferNoticeConfirmationEmail,
  TEAM_EMAILS,
} from "@/lib/email";

const transferNoticeSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  bank: z.string().trim().min(2, "Please select the bank transferred to."),
  amount: z.number().int().min(100, "Please enter a valid amount."),
  reference: z.string().trim().max(100).optional(),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = transferNoticeSchema.parse(json);

    // 1. Alert the Mikaelson team
    const teamHtml = buildTransferNoticeNotificationEmail({
      name: data.name,
      email: data.email,
      bank: data.bank,
      amount: data.amount,
      reference: data.reference,
      note: data.note,
    });

    await sendEmail({
      to: TEAM_EMAILS.donations,
      subject: `[Transfer Notice] ₦${data.amount.toLocaleString("en-NG")} to ${data.bank} from ${data.name}`,
      replyTo: data.email,
      html: teamHtml,
    });

    // 2. Send instant receipt confirmation to the donor
    const donorHtml = buildTransferNoticeConfirmationEmail({
      name: data.name,
      bank: data.bank,
      amount: data.amount,
      reference: data.reference,
    });

    await sendEmail({
      to: data.email,
      subject: `We received your transfer details: ₦${data.amount.toLocaleString("en-NG")} | Mikaelson Initiative`,
      html: donorHtml,
    });

    return NextResponse.json({ ok: true, message: "Transfer notice submitted successfully." });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || "Invalid submission details." },
        { status: 400 }
      );
    }
    console.error("Transfer notice API error:", err);
    return NextResponse.json(
      { ok: false, error: "We could not process your notice. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
