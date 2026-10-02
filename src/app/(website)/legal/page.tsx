import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { ScrollLine } from "@/components/site/scroll-line";
import { Reveal } from "@/components/site/motion/reveal";
import wrap from "@/components/site/wrap.module.css";
import { LegalHero } from "@/features/website/pages/legal/legal-hero";
import { LEGAL_DOCS, LEGAL_EMAIL, focusRing } from "@/features/website/pages/legal/documents";

const DESCRIPTION =
  "The Mikaelson Initiative's Terms of Service, Privacy Policy and Code of Conduct, in one place.";

export const metadata: Metadata = {
  title: "Legal",
  description: DESCRIPTION,
  alternates: { canonical: "https://www.mikaelsoninitiative.org/legal" },
  openGraph: {
    title: "Legal | Mikaelson Initiative",
    description: DESCRIPTION,
    url: "https://www.mikaelsoninitiative.org/legal",
  },
};

export default function LegalPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>
        <LegalHero
          title="Legal"
          summary="Our Terms of Service, Privacy Policy and Code of Conduct, in one place. Here is what each one covers."
        />

        <section aria-label="Our legal documents" className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6 md:pb-24">
          {/* The scroll line runs around each document in turn (wrap.module.css). */}
          <ul data-wrap className={`${wrap.stage} grid gap-6 md:grid-cols-3 md:gap-8`}>
            {LEGAL_DOCS.map((doc, i) => (
              <li
                key={doc.href}
                data-wrap-item
                className={`${wrap.item} flex`}
                style={{ "--i": i } as CSSProperties}
              >
                <Link
                  href={doc.href}
                  className={`group flex w-full flex-col rounded-2xl border border-black/10 bg-white p-6 transition-[border-color] duration-200 ease-[ease] hover:border-[#0097A7]/50 sm:p-8 dark:border-white/10 dark:bg-[#0b1414] dark:hover:border-[#5CE1E6]/50 ${focusRing}`}
                >
                  <h2 className="text-[24px] leading-tight font-bold tracking-[-0.015em] text-[#003E45] dark:text-white">
                    {doc.title}
                  </h2>
                  <p className="mt-3 flex-1 text-[17px] leading-[1.7] text-[#555] dark:text-white/65">{doc.summary}</p>
                  <p className="mt-6 text-[14px] text-[#555] dark:text-white/65">
                    Last updated <time dateTime={doc.updatedIso}>{doc.updated}</time>
                  </p>
                  <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[16px] font-semibold text-[#003E45] dark:text-[#5CE1E6]">
                    {doc.cta}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="legal-questions-heading"
          className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 md:pb-32"
        >
          <Reveal>
            <div className="max-w-[68ch]">
              <h2
                id="legal-questions-heading"
                data-stop
                className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-[#003E45] md:text-[34px] dark:text-white"
              >
                Questions about these documents?
              </h2>
              <p className="mt-4 text-[17px] leading-[1.75] text-[#555] dark:text-white/65">
                For legal matters, email us at the address below. For anything else, visit our{" "}
                <Link
                  href="/contact"
                  className={`rounded-sm font-semibold text-[#003E45] underline decoration-[#5CE1E6] decoration-2 underline-offset-4 dark:text-[#5CE1E6] ${focusRing}`}
                >
                  contact page
                </Link>
                .
              </p>
              <a
                href={`mailto:${LEGAL_EMAIL}`}
                className={`mt-5 inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm text-[17px] font-medium break-all text-[#003E45] underline decoration-[#5CE1E6] decoration-2 underline-offset-4 dark:text-white ${focusRing}`}
              >
                <Mail className="size-4 shrink-0 text-[#0097A7] dark:text-[#5CE1E6]" aria-hidden="true" />
                {LEGAL_EMAIL}
              </a>
            </div>
          </Reveal>
        </section>
      </ScrollLine>
    </div>
  );
}
