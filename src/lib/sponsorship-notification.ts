import {
  sendEmail,
  buildSponsorshipNotificationEmail,
  buildSponsorshipReceiptEmail,
  TEAM_EMAILS,
} from "@/lib/email";

// In-memory cache to prevent duplicate email dispatches if the donor refreshes the thank-you page.
const processedReferences = new Set<string>();

interface ProcessSponsorshipParams {
  reference: string;
  amount: number;
  email: string;
  organization?: string;
  contactName?: string;
}

export async function processSponsorshipEmail({
  reference,
  amount,
  email,
  organization,
  contactName,
}: ProcessSponsorshipParams) {
  if (!reference || processedReferences.has(reference)) {
    return { ok: true, alreadyProcessed: true };
  }

  // Mark reference immediately to prevent race conditions
  processedReferences.add(reference);

  // Keep set bounded in long-running processes
  if (processedReferences.size > 2000) {
    const iterator = processedReferences.values();
    for (let i = 0; i < 500; i++) {
      const next = iterator.next();
      if (next.done) break;
      processedReferences.delete(next.value);
    }
  }

  const name = contactName || organization || "Generous Supporter";

  try {
    // 1. Send official receipt & thank you to the donor
    if (email) {
      const receiptHtml = buildSponsorshipReceiptEmail({
        organization,
        name,
        amount,
        reference,
      });

      await sendEmail({
        to: email,
        subject: `Thank you for your sponsorship of ₦${amount.toLocaleString("en-NG")} | Mikaelson Initiative`,
        html: receiptHtml,
      });
    }

    // 2. Alert the Mikaelson team
    const teamHtml = buildSponsorshipNotificationEmail({
      organization,
      name,
      email,
      amount,
      reference,
    });

    await sendEmail({
      to: TEAM_EMAILS.donations,
      subject: `[Sponsorship Received] ₦${amount.toLocaleString("en-NG")} from ${organization || name}`,
      replyTo: email || undefined,
      html: teamHtml,
    });

    return { ok: true, alreadyProcessed: false };
  } catch (err) {
    console.error("Failed to dispatch sponsorship emails:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Email error" };
  }
}
