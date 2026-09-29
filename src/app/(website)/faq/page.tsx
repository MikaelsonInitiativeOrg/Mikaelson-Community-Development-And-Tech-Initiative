import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { ScrollLine } from "@/components/site/scroll-line";
import { FaqList } from "@/features/website/pages/faq/faq-list";
import { btn } from "@/features/website/pages/volunteer/styles";

const description =
  "Answers to common questions about the Mikaelson Initiative, our community, programs and Mikaelson Labs, and how to get involved.";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description,
  alternates: { canonical: "https://mikaelsoninitiative.org/faq" },
  openGraph: {
    title: "Frequently Asked Questions | Mikaelson Initiative",
    description,
    url: "https://mikaelsoninitiative.org/faq",
    images: [{ url: "/assets/images/mikaelsonlogo.png", width: 1200, height: 630, alt: "Mikaelson Initiative" }],
  },
};

export default function FaqPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>
        {/* Hero, centred. */}
        <section className="mx-auto max-w-[900px] px-4 pt-14 pb-10 text-center sm:px-6 md:pt-20 md:pb-14">
          <Reveal immediate>
            <h1 className="mx-auto max-w-[14ch] text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white">
              Frequently asked questions
            </h1>
          </Reveal>
          <Reveal immediate delay={0.08}>
            <p className="mx-auto mt-6 max-w-[52ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
              Find answers to common questions about the Mikaelson Initiative, our community, and programs.
            </p>
          </Reveal>
        </section>

        {/* Questions */}
        <section aria-label="Questions and answers" className="mx-auto max-w-[860px] px-4 pb-24 sm:px-6 md:pb-32">
          <Reveal immediate delay={0.14}>
            <FaqList />
          </Reveal>
        </section>

        {/* Still have questions? The one warm teal band. */}
        <section aria-labelledby="more-heading" className="bg-[#003E45] text-white dark:bg-[#003E45]/45">
          <div className="mx-auto max-w-[900px] px-4 py-24 text-center sm:px-6 md:py-28">
            <Reveal>
              <h2 id="more-heading" className="text-[28px] leading-tight font-bold tracking-[-0.02em] md:text-[40px]">
                Still have questions?
              </h2>
              <p className="mx-auto mt-4 max-w-[46ch] text-[18px] leading-[1.7] text-white/80">
                Can&rsquo;t find the answer you&rsquo;re looking for? We&rsquo;d love to help you out.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/contact" className={btn.primary}>
                  Contact us
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href="mailto:hello@mikaelsoninitiative.org"
                  className="inline-flex min-h-12 max-w-full items-center gap-2 px-2 text-base font-medium break-all text-white underline decoration-white/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#5CE1E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6]"
                >
                  <Mail className="size-4 shrink-0 text-[#5CE1E6]" aria-hidden="true" />
                  hello@mikaelsoninitiative.org
                </a>
              </div>
              <p className="mt-10 text-[15px] text-white/70">
                More help lives in our{" "}
                <Link
                  href="/help"
                  className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#5CE1E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6]"
                >
                  Help Center
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>
      </ScrollLine>
    </div>
  );
}
