import { NextResponse } from "next/server";
import { z } from "zod";
import {
  sendEmail,
  buildContactNotificationEmail,
  buildContactAutoReplyEmail,
  TEAM_EMAILS,
} from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(120),
  email: z.string().trim().email("Please provide a valid email address.").max(200),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters.").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = contactSchema.parse(json);

    // 1. Notify the Mikaelson team
    const teamHtml = buildContactNotificationEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    const teamSend = await sendEmail({
      to: TEAM_EMAILS.partnership,
      subject: `[Contact Form] ${data.subject} - from ${data.name}`,
      replyTo: data.email,
      html: teamHtml,
    });

    if (!teamSend.ok && process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
      console.error("Failed to notify team of contact inquiry:", teamSend.error);
    }

    // 2. Send automated confirmation receipt to the visitor
    const autoReplyHtml = buildContactAutoReplyEmail({
      name: data.name,
      subject: data.subject,
      message: data.message,
    });

    await sendEmail({
      to: data.email,
      subject: `We received your letter: ${data.subject} | Mikaelson Initiative`,
      html: autoReplyHtml,
    });

    return NextResponse.json({ ok: true, message: "Your message has been sent successfully." });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || "Invalid input data." },
        { status: 400 }
      );
    }
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "We could not send your message. Please try again in a moment." },
      { status: 500 }
    );
  }
}
