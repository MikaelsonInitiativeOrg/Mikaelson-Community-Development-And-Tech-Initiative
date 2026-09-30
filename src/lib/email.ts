/**
 * Email dispatching and HTML template engine for the Mikaelson Initiative.
 * Uses Resend REST API via native fetch (zero external dependencies).
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  text?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = "Mikaelson Initiative <hello@mikaelsoninitiative.org>";
const DEV_FALLBACK_FROM = "Mikaelson Initiative <onboarding@resend.dev>";

export const TEAM_EMAILS = {
  general: process.env.TEAM_EMAIL_GENERAL || "hello@mikaelsoninitiative.org",
  partnership: process.env.TEAM_EMAIL_PARTNERSHIP || "partnership@mikaelsoninitiative.org",
  donations: process.env.TEAM_EMAIL_DONATIONS || "partnership@mikaelsoninitiative.org",
  conduct: process.env.TEAM_EMAIL_CONDUCT || "conduct@mikaelsoninitiative.org",
};

/**
 * Sends an email using the Resend REST API.
 * In development without an API key, it safely logs to console.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  text,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_AP_KEY;
  const isDev = process.env.NODE_ENV !== "production";
  const recipients = Array.isArray(to) ? to : [to];

  if (!apiKey) {
    if (isDev) {
      console.log("----------------------------------------------------------------");
      console.log("📨 [DEV EMAIL SIMULATION] RESEND_API_KEY not set in .env.local");
      console.log(`To:      ${recipients.join(", ")}`);
      console.log(`Subject: ${subject}`);
      if (replyTo) console.log(`ReplyTo: ${replyTo}`);
      console.log("----------------------------------------------------------------");
      return { ok: true, id: `simulated-${Date.now()}` };
    }
    console.error("❌ RESEND_API_KEY is not configured in production environment.");
    return { ok: false, error: "Email service is temporarily unavailable." };
  }

  const fromAddress = process.env.EMAIL_FROM || (isDev ? DEV_FALLBACK_FROM : DEFAULT_FROM);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipients,
        subject,
        html,
        text,
        reply_to: replyTo,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || data?.error?.message || `HTTP ${res.status}`;
      console.error("❌ Resend API Error:", errorMsg);
      return { ok: false, error: errorMsg };
    }

    return { ok: true, id: data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.error("❌ Failed to dispatch email via Resend:", msg);
    return { ok: false, error: msg };
  }
}

/* -------------------------------------------------------------------------- */
/* HTML Email Layout & Template Builder                                       */
/* -------------------------------------------------------------------------- */

interface BaseEmailOptions {
  title: string;
  preheader?: string;
  bodyHtml: string;
  badge?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Base template matching the Mikaelson Initiative design language:
 * - Brand Deep Teal: #003E45
 * - Turquoise Accent: #5CE1E6
 * - Clean typography, card container, full responsive formatting
 */
export function renderBaseEmail({ title, preheader = "", bodyHtml, badge }: BaseEmailOptions): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #F4F8F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; }
    td { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #444444; }
    a { color: #003E45; text-decoration: underline; font-weight: 600; }
    .card { background-color: #FFFFFF; border-radius: 18px; border: 1px solid rgba(0, 62, 69, 0.08); box-shadow: 0 4px 24px rgba(0, 62, 69, 0.04); overflow: hidden; }
    .header-bar { background-color: #003E45; padding: 28px 32px; text-align: left; }
    .header-logo { color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 0; text-decoration: none; }
    .header-accent { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #5CE1E6; margin-left: 6px; }
    .accent-strip { height: 4px; background: linear-gradient(90deg, #5CE1E6 0%, #0097A7 100%); }
    .content-box { padding: 36px 32px 32px 32px; }
    .badge { display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 12px; border-radius: 999px; background-color: #EEFCFC; color: #003E45; margin-bottom: 16px; }
    .h1-title { font-size: 24px; font-weight: 800; line-height: 1.25; color: #003E45; margin: 0 0 16px 0; letter-spacing: -0.02em; }
    .footer { padding: 28px 20px; text-align: center; font-size: 13px; line-height: 1.6; color: #777777; }
    .footer a { color: #003E45; font-size: 13px; font-weight: 500; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .field-row { border-bottom: 1px solid #EEF3F3; padding: 12px 0; }
    .field-label { font-size: 13px; font-weight: 700; color: #003E45; text-transform: uppercase; letter-spacing: 0.04em; }
    .field-value { font-size: 15px; color: #222222; margin-top: 4px; }
    .quote-box { background-color: #F8FBFB; border-left: 3px solid #5CE1E6; border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 20px 0; font-size: 15px; line-height: 1.6; color: #333333; }
    .button { display: inline-block; background-color: #5CE1E6; color: #050A0A !important; font-weight: 700; font-size: 15px; text-decoration: none !important; padding: 12px 28px; border-radius: 999px; box-shadow: 0 4px 0 -1px #003E45; margin-top: 20px; }
  </style>
</head>
<body>
  <span style="display:none;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(preheader)}
  </span>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <!-- Card Container -->
          <tr>
            <td class="card">
              <!-- Header Bar -->
              <div class="header-bar">
                <span class="header-logo">Mikaelson Initiative<span class="header-accent"></span></span>
              </div>
              <div class="accent-strip"></div>

              <!-- Main Content -->
              <div class="content-box">
                ${badge ? `<div class="badge">${escapeHtml(badge)}</div>` : ""}
                <h1 class="h1-title">${escapeHtml(title)}</h1>
                ${bodyHtml}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin: 0 0 8px 0;">
                <strong>Mikaelson Initiative</strong> &middot; Lagos, Nigeria
              </p>
              <p style="margin: 0 0 14px 0; font-size: 12px; color: #888888;">
                Home of the Mikaelson School Club, Mikaelson Labs, the Partnership &amp; Growth Network, and the Mikaelson Institute.
              </p>
              <p style="margin: 0;">
                <a href="https://mikaelsoninitiative.org">Website</a> &nbsp;&bull;&nbsp;
                <a href="https://club.mikaelsoninitiative.org">School Club</a> &nbsp;&bull;&nbsp;
                <a href="https://institute.mikaelsoninitiative.org">Institute</a> &nbsp;&bull;&nbsp;
                <a href="https://mikaelsoninitiative.org/sponsor">Sponsor</a>
              </p>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #999999;">
                &copy; ${currentYear} Mikaelson Initiative. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* -------------------------------------------------------------------------- */
/* Contact Form Templates                                                     */
/* -------------------------------------------------------------------------- */

export function buildContactNotificationEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const bodyHtml = `
    <p style="margin-top: 0; line-height: 1.6; color: #444444;">
      You received a new inquiry from the website contact letter form.
    </p>

    <div style="margin: 24px 0; background-color: #FAFDFD; border: 1px solid #E5EFEF; border-radius: 12px; padding: 18px 22px;">
      <div class="field-row" style="padding-top: 0;">
        <div class="field-label">Sender Name</div>
        <div class="field-value"><strong>${escapeHtml(name)}</strong></div>
      </div>
      <div class="field-row">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
      </div>
      <div class="field-row" style="border-bottom: none; padding-bottom: 0;">
        <div class="field-label">Subject</div>
        <div class="field-value">${escapeHtml(subject)}</div>
      </div>
    </div>

    <div class="field-label" style="margin-top: 24px;">Message Content</div>
    <div class="quote-box" style="white-space: pre-wrap;">${escapeHtml(message)}</div>

    <p style="margin-top: 24px; font-size: 13px; color: #777777;">
      You can reply directly to this email to respond to ${escapeHtml(name)}.
    </p>
  `;

  return renderBaseEmail({
    badge: "Contact Form Inquiry",
    title: `Inquiry: ${subject}`,
    preheader: `New message from ${name}: "${message.slice(0, 90)}..."`,
    bodyHtml,
  });
}

export function buildContactAutoReplyEmail({
  name,
  subject,
  message,
}: {
  name: string;
  subject: string;
  message: string;
}) {
  const firstName = name.split(" ")[0] || "there";
  const bodyHtml = `
    <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #222222;">
      Hello ${escapeHtml(firstName)},
    </p>
    <p style="line-height: 1.6; color: #444444;">
      Thank you for writing to the Mikaelson Initiative. We have safely received your letter regarding <strong>"${escapeHtml(subject)}"</strong>.
    </p>
    <p style="line-height: 1.6; color: #444444;">
      A member of our team is reviewing your message and will get back to you shortly. Whether you are looking to start a School Club, collaborate on technology at Mikaelson Labs, support our students, or explore research with the Institute, we are glad to connect with you.
    </p>

    <div class="field-label" style="margin-top: 24px;">Copy of your message</div>
    <div class="quote-box" style="white-space: pre-wrap; font-size: 14px; color: #555555;">${escapeHtml(message)}</div>

    <p style="margin-top: 28px; line-height: 1.6; color: #444444;">
      Warm regards,<br>
      <strong style="color: #003E45;">The Mikaelson Initiative Team</strong><br>
      <span style="font-size: 13px; color: #666666;">Lagos, Nigeria</span>
    </p>
  `;

  return renderBaseEmail({
    badge: "Message Received",
    title: "We received your letter",
    preheader: `Thank you for reaching out, ${firstName}. We've received your message.`,
    bodyHtml,
  });
}

/* -------------------------------------------------------------------------- */
/* Sponsorship / Paystack Donation Templates                                  */
/* -------------------------------------------------------------------------- */

export function buildSponsorshipNotificationEmail({
  organization,
  name,
  email,
  amount,
  reference,
}: {
  organization?: string;
  name: string;
  email: string;
  amount: number;
  reference: string;
}) {
  const formattedAmount = formatNaira(amount);
  const donorName = organization ? `${organization} (Attn: ${name})` : name;

  const bodyHtml = `
    <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #222222;">
      🎉 A verified online sponsorship of <strong style="color: #003E45; font-size: 18px;">${formattedAmount}</strong> has been received via Paystack.
    </p>

    <div style="margin: 24px 0; background-color: #FAFDFD; border: 1px solid #E5EFEF; border-radius: 12px; padding: 18px 22px;">
      <div class="field-row" style="padding-top: 0;">
        <div class="field-label">Contributor / Organisation</div>
        <div class="field-value"><strong>${escapeHtml(donorName)}</strong></div>
      </div>
      <div class="field-row">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
      </div>
      <div class="field-row">
        <div class="field-label">Amount Paid</div>
        <div class="field-value" style="color: #003E45; font-weight: 800; font-size: 17px;">${formattedAmount}</div>
      </div>
      <div class="field-row" style="border-bottom: none; padding-bottom: 0;">
        <div class="field-label">Payment Reference</div>
        <div class="field-value" style="font-family: monospace; font-size: 13px;">${escapeHtml(reference)}</div>
      </div>
    </div>

    <p style="margin-top: 20px; font-size: 14px; line-height: 1.6; color: #555555;">
      An automatic receipt and thank-you confirmation has already been delivered to the donor's inbox.
    </p>
  `;

  return renderBaseEmail({
    badge: "New Sponsorship Received",
    title: `Sponsorship: ${formattedAmount}`,
    preheader: `New ${formattedAmount} sponsorship from ${donorName}`,
    bodyHtml,
  });
}

export function buildSponsorshipReceiptEmail({
  organization,
  name,
  amount,
  reference,
}: {
  organization?: string;
  name: string;
  amount: number;
  reference: string;
}) {
  const formattedAmount = formatNaira(amount);
  const greeting = organization ? `${organization} team (Attn: ${name})` : name;

  const bodyHtml = `
    <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #222222;">
      Dear ${escapeHtml(greeting)},
    </p>
    <p style="line-height: 1.6; color: #444444;">
      Thank you deeply for your generous contribution of <strong style="color: #003E45;">${formattedAmount}</strong> to the Mikaelson Initiative. Your payment has been successfully confirmed.
    </p>
    <p style="line-height: 1.6; color: #444444;">
      Every contribution directly empowers students across Africa: equipping them with personal accountability frameworks, hands-on software development experience inside Mikaelson Labs, leadership sessions in our School Clubs, and access to African research.
    </p>

    <!-- Receipt Box -->
    <div style="margin: 28px 0; background-color: #FAFDFD; border: 2px solid #5CE1E6; border-radius: 14px; padding: 22px;">
      <div style="font-size: 12px; font-weight: 800; color: #003E45; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
        Official Donation Receipt
      </div>
      <div class="field-row" style="padding-top: 0;">
        <div class="field-label">Received From</div>
        <div class="field-value">${escapeHtml(organization || name)}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Amount Contributed</div>
        <div class="field-value" style="font-size: 18px; font-weight: 800; color: #003E45;">${formattedAmount}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Payment Channel</div>
        <div class="field-value">Paystack Online Checkout (NGN)</div>
      </div>
      <div class="field-row" style="border-bottom: none; padding-bottom: 0;">
        <div class="field-label">Transaction Reference</div>
        <div class="field-value" style="font-family: monospace; font-size: 13px;">${escapeHtml(reference)}</div>
      </div>
    </div>

    <p style="line-height: 1.6; color: #444444;">
      If you would like to discuss program sponsorship reports, curriculum integration, or custom impact updates, please reach out directly to our team at <a href="mailto:partnership@mikaelsoninitiative.org">partnership@mikaelsoninitiative.org</a>.
    </p>

    <p style="margin-top: 32px; line-height: 1.6; color: #444444;">
      With immense gratitude,<br>
      <strong style="color: #003E45;">Oluwasegun Olukayode &amp; The Mikaelson Initiative Leadership</strong><br>
      <span style="font-size: 13px; color: #666666;">Lagos, Nigeria</span>
    </p>
  `;

  return renderBaseEmail({
    badge: "Official Receipt & Confirmation",
    title: "Thank you for your sponsorship",
    preheader: `Your receipt for ${formattedAmount} to the Mikaelson Initiative.`,
    bodyHtml,
  });
}

/* -------------------------------------------------------------------------- */
/* Bank Transfer Notification Templates                                       */
/* -------------------------------------------------------------------------- */

export function buildTransferNoticeNotificationEmail({
  name,
  email,
  bank,
  amount,
  reference,
  note,
}: {
  name: string;
  email: string;
  bank: string;
  amount: number;
  reference?: string;
  note?: string;
}) {
  const formattedAmount = formatNaira(amount);

  const bodyHtml = `
    <p style="margin-top: 0; line-height: 1.6; color: #444444;">
      An individual donor has reported a bank transfer donation on the website.
    </p>

    <div style="margin: 24px 0; background-color: #FAFDFD; border: 1px solid #E5EFEF; border-radius: 12px; padding: 18px 22px;">
      <div class="field-row" style="padding-top: 0;">
        <div class="field-label">Donor Name</div>
        <div class="field-value"><strong>${escapeHtml(name)}</strong></div>
      </div>
      <div class="field-row">
        <div class="field-label">Donor Email</div>
        <div class="field-value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
      </div>
      <div class="field-row">
        <div class="field-label">Bank Transferred To</div>
        <div class="field-value"><strong>${escapeHtml(bank)}</strong></div>
      </div>
      <div class="field-row">
        <div class="field-label">Reported Amount</div>
        <div class="field-value" style="color: #003E45; font-weight: 800; font-size: 16px;">${formattedAmount}</div>
      </div>
      ${
        reference
          ? `<div class="field-row">
              <div class="field-label">Transfer / Bank Reference</div>
              <div class="field-value" style="font-family: monospace;">${escapeHtml(reference)}</div>
            </div>`
          : ""
      }
      ${
        note
          ? `<div class="field-row" style="border-bottom: none; padding-bottom: 0;">
              <div class="field-label">Donor Note</div>
              <div class="field-value">${escapeHtml(note)}</div>
            </div>`
          : ""
      }
    </div>

    <p style="margin-top: 20px; font-size: 13px; color: #666666;">
      Please verify the funds in the corresponding bank statement and reconcile the gift.
    </p>
  `;

  return renderBaseEmail({
    badge: "Bank Transfer Reported",
    title: `Transfer Notice: ${formattedAmount}`,
    preheader: `Bank transfer of ${formattedAmount} reported by ${name} to ${bank}.`,
    bodyHtml,
  });
}

export function buildTransferNoticeConfirmationEmail({
  name,
  bank,
  amount,
  reference,
}: {
  name: string;
  bank: string;
  amount: number;
  reference?: string;
}) {
  const firstName = name.split(" ")[0] || "Friend";
  const formattedAmount = formatNaira(amount);

  const bodyHtml = `
    <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #222222;">
      Hello ${escapeHtml(firstName)},
    </p>
    <p style="line-height: 1.6; color: #444444;">
      Thank you for supporting the Mikaelson Initiative! We have received your notice of a bank transfer of <strong>${formattedAmount}</strong> to our <strong>${escapeHtml(bank)}</strong> account.
    </p>
    <p style="line-height: 1.6; color: #444444;">
      Our finance team will verify the transfer with our bank statement. Once confirmed, we will ensure your gift directly backs student scholarships, campus clubs, and innovation programs.
    </p>

    <div style="margin: 24px 0; background-color: #FAFDFD; border: 1px solid #E5EFEF; border-radius: 12px; padding: 16px 20px;">
      <div style="font-size: 12px; font-weight: 700; color: #003E45; text-transform: uppercase;">Transfer Details Summary</div>
      <div style="margin-top: 8px; font-size: 14px; color: #444444;">
        <strong>Bank:</strong> ${escapeHtml(bank)}<br>
        <strong>Reported Amount:</strong> ${formattedAmount}<br>
        ${reference ? `<strong>Reference:</strong> ${escapeHtml(reference)}<br>` : ""}
        <strong>Status:</strong> Pending Bank Reconciliation
      </div>
    </div>

    <p style="margin-top: 24px; line-height: 1.6; color: #444444;">
      Thank you for standing beside African students.
    </p>
    <p style="margin-top: 24px; line-height: 1.6; color: #444444;">
      Warmly,<br>
      <strong style="color: #003E45;">The Mikaelson Initiative Team</strong>
    </p>
  `;

  return renderBaseEmail({
    badge: "Transfer Notice Received",
    title: "We received your transfer details",
    preheader: `Thank you, ${firstName}. We've received your transfer notice of ${formattedAmount}.`,
    bodyHtml,
  });
}

/* -------------------------------------------------------------------------- */
/* Code of Conduct Reporting Templates                                        */
/* -------------------------------------------------------------------------- */

export function buildConductReportNotificationEmail({
  name,
  email,
  incident,
  details,
  date,
  partiesInvolved,
}: {
  name?: string;
  email?: string;
  incident: string;
  details: string;
  date?: string;
  partiesInvolved?: string;
}) {
  const reporter = name ? `${name} (${email || "no email provided"})` : "Anonymous Reporter";

  const bodyHtml = `
    <p style="margin-top: 0; line-height: 1.6; color: #C53030; font-weight: 700;">
      ⚠️ A confidential Code of Conduct concern has been submitted through the website.
    </p>

    <div style="margin: 24px 0; background-color: #FFFDFD; border: 1px solid #FED7D7; border-radius: 12px; padding: 18px 22px;">
      <div class="field-row" style="padding-top: 0;">
        <div class="field-label">Reported By</div>
        <div class="field-value"><strong>${escapeHtml(reporter)}</strong></div>
      </div>
      <div class="field-row">
        <div class="field-label">Incident Category / Nature</div>
        <div class="field-value"><strong>${escapeHtml(incident)}</strong></div>
      </div>
      ${
        date
          ? `<div class="field-row">
              <div class="field-label">Approximate Date / Time</div>
              <div class="field-value">${escapeHtml(date)}</div>
            </div>`
          : ""
      }
      ${
        partiesInvolved
          ? `<div class="field-row">
              <div class="field-label">Parties Involved</div>
              <div class="field-value">${escapeHtml(partiesInvolved)}</div>
            </div>`
          : ""
      }
    </div>

    <div class="field-label" style="margin-top: 24px;">Incident Details & Description</div>
    <div class="quote-box" style="white-space: pre-wrap; border-left-color: #E53E3E; background-color: #FFFDFD;">${escapeHtml(details)}</div>

    <p style="margin-top: 20px; font-size: 13px; color: #666666;">
      This notification was dispatched securely to the designated Code of Conduct review team.
    </p>
  `;

  return renderBaseEmail({
    badge: "Confidential Report",
    title: "Code of Conduct Concern",
    preheader: `Confidential report received: ${incident}`,
    bodyHtml,
  });
}

export function buildConductReportAcknowledgmentEmail({
  name,
}: {
  name?: string;
}) {
  const greeting = name ? `Hello ${name.split(" ")[0]},` : "Hello,";

  const bodyHtml = `
    <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #222222;">
      ${escapeHtml(greeting)}
    </p>
    <p style="line-height: 1.6; color: #444444;">
      Thank you for bringing your concern to our attention. We have received your Code of Conduct report safely and confidentially.
    </p>
    <p style="line-height: 1.6; color: #444444;">
      Our leadership and conduct committee treats every submission with utmost care, urgency, and discretion. We will review the details provided according to our established procedures to ensure a safe, inclusive, and respectful community for all.
    </p>
    <p style="line-height: 1.6; color: #444444;">
      If you provided contact information, our conduct officers may reach out for clarification or to keep you updated on the steps taken.
    </p>
    <p style="margin-top: 28px; line-height: 1.6; color: #444444;">
      Sincerely,<br>
      <strong style="color: #003E45;">The Mikaelson Initiative Code of Conduct Committee</strong>
    </p>
  `;

  return renderBaseEmail({
    badge: "Report Acknowledged",
    title: "We received your report",
    preheader: "Your report to the Mikaelson Initiative Code of Conduct Committee has been received.",
    bodyHtml,
  });
}
