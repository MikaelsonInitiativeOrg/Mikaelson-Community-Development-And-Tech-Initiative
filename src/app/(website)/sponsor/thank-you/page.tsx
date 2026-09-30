import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, HeartHandshake } from "lucide-react";
import { PARTNER_EMAIL } from "@/features/website/pages/sponsor/data";
import { btn } from "@/features/website/pages/sponsor/styles";

/**
 * Where Paystack sends an organisation after checkout
 * (callback_url in /api/paystack/initialize). It verifies the payment with
 * Paystack on the server before saying thank you, so the page never
 * thanks anyone for a payment that didn't go through.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

import { processSponsorshipEmail } from "@/lib/sponsorship-notification";

type Verified = { ok: true; amount: number; organization?: string; reference: string } | { ok: false };

async function verify(reference: string): Promise<Verified> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !/^[A-Za-z0-9_.=-]{4,100}$/.test(reference)) return { ok: false };
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data?.data?.status !== "success") return { ok: false };

    const amount = Number(data.data.amount) / 100;
    const organization = data.data.metadata?.organization;
    const contactName = data.data.metadata?.contact_name;
    const email = data.data.customer?.email;

    // Send receipt to donor and alert to Mikaelson team (idempotent)
    await processSponsorshipEmail({
      reference: data.data.reference,
      amount,
      email,
      organization,
      contactName,
    });

    return {
      ok: true,
      amount,
      organization,
      reference: data.data.reference,
    };
  } catch {
    return { ok: false };
  }
}

export default async function SponsorThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref ?? "";
  const result = reference ? await verify(reference) : ({ ok: false } as const);

  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <section className="mx-auto flex min-h-[70svh] max-w-[680px] flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        {result.ok ? (
          <>
            <span className="flex size-16 items-center justify-center rounded-full bg-[#003E45] text-[#5CE1E6] dark:bg-[#5CE1E6] dark:text-[#003E45]">
              <HeartHandshake className="size-8" aria-hidden="true" />
            </span>
            <h1 className="mt-8 text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] dark:text-white">
              Thank you{result.organization ? `, ${result.organization}` : ""}
            </h1>
            <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
              Your gift of{" "}
              <strong className="font-semibold text-[#111] dark:text-white">
                ₦{result.amount.toLocaleString("en-NG")}
              </strong>{" "}
              has gone through. It helps young people across Africa grow as leaders. Paystack has emailed your receipt.
            </p>
            <p className="mt-4 text-[14px] text-[#555] dark:text-white/55">
              Payment reference: <span className="font-mono">{result.reference}</span>
            </p>
          </>
        ) : (
          <>
            <span className="flex size-16 items-center justify-center rounded-full bg-[#EEFCFC] text-[#003E45] dark:bg-white/10 dark:text-[#5CE1E6]">
              <CircleAlert className="size-8" aria-hidden="true" />
            </span>
            <h1 className="mt-8 text-[34px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#003E45] sm:text-[44px] dark:text-white">
              We couldn&rsquo;t confirm this payment
            </h1>
            <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
              If money left your account, don&rsquo;t worry: write to us at{" "}
              <a href={`mailto:${PARTNER_EMAIL}`} className="font-semibold text-[#003E45] underline dark:text-[#5CE1E6]">
                {PARTNER_EMAIL}
              </a>{" "}
              with your Paystack receipt and we&rsquo;ll sort it out.
              {reference ? " Your reference is " : ""}
              {reference ? <span className="font-mono">{reference}</span> : null}
            </p>
          </>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className={btn.primary}>
            Back to home
          </Link>
          <Link href="/sponsor" className={btn.outline}>
            Sponsor page
          </Link>
        </div>
      </section>
    </div>
  );
}
