import { NextResponse } from "next/server";
import { z } from "zod";
import {
  sendEmail,
  buildConductReportNotificationEmail,
  buildConductReportAcknowledgmentEmail,
  TEAM_EMAILS,
} from "@/lib/email";

const conductReportSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Please enter a valid email address.").max(200).optional().or(z.literal("")),
  incident: z.string().trim().min(3, "Please describe the nature or category of the incident.").max(200),
  details: z.string().trim().min(15, "Please provide at least 15 characters of detail.").max(5000),
  date: z.string().trim().max(100).optional(),
  partiesInvolved: z.string().trim().max(300).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = conductReportSchema.parse(json);

    // 1. Send confidential alert to the Code of Conduct review team
    const teamHtml = buildConductReportNotificationEmail({
      name: data.name,
      email: data.email || undefined,
      incident: data.incident,
      details: data.details,
      date: data.date,
      partiesInvolved: data.partiesInvolved,
    });

    await sendEmail({
      to: TEAM_EMAILS.conduct,
      subject: `[Confidential Report] Code of Conduct Concern: ${data.incident}`,
      replyTo: data.email || undefined,
      html: teamHtml,
    });

    // 2. If the reporter provided an email, send them a confidential receipt
    if (data.email) {
      const ackHtml = buildConductReportAcknowledgmentEmail({
        name: data.name,
      });

      await sendEmail({
        to: data.email,
        subject: "We received your confidential report | Mikaelson Initiative Code of Conduct",
        html: ackHtml,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Your report has been submitted safely and confidentially to our conduct committee.",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message || "Invalid report submission." },
        { status: 400 }
      );
    }
    console.error("Conduct report API error:", err);
    return NextResponse.json(
      { ok: false, error: "We could not submit your report right now. Please email conduct@mikaelsoninitiative.org." },
      { status: 500 }
    );
  }
}
