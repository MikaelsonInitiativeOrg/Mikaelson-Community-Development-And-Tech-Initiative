import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/motion/stagger";
import { GiveButton } from "@/features/website/pages/sponsor/give-dialog";
import { GiveChooser } from "@/features/website/pages/sponsor/give-chooser";
import { PARTNER_EMAIL, PARTNER_STEPS, SUPPORTERS } from "@/features/website/pages/sponsor/data";
import { btn } from "@/features/website/pages/sponsor/styles";
import { ScrollLine } from "@/components/site/scroll-line";
import wrap from "@/components/site/wrap.module.css";

export const metadata: Metadata = {
  title: "Sponsor & Support",
  description: "Sponsor a student, fund a workshop or partner with the Mikaelson Initiative, and help young Africans grow as leaders.",
  alternates: { canonical: "https://mikaelsoninitiative.org/sponsor" },
  openGraph: {
    title: "Sponsor & Support | Mikaelson Initiative",
    description: "Sponsor a student, fund a workshop or partner with the Mikaelson Initiative, and help young Africans grow as leaders.",
    url: "https://mikaelsoninitiative.org/sponsor",
    images: [{ url: "/assets/images/mikaelsonlogo.png", width: 1200, height: 630, alt: "Mikaelson Initiative" }],
  },
};

export default function SponsorPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>

      {/* Hero: the mission, no picture. Both buttons open the same payment
          dialog as the original's two; the scroll line wraps around each in
          turn and it comes forward as it does (ScrollLine's data-wrap). */}
      <section className="mx-auto max-w-[1200px] px-4 pt-14 pb-20 text-center sm:px-6 md:pt-20 md:pb-28">
        <div>
          <Reveal immediate>
            <h1 className="mx-auto max-w-[16ch] text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white">
              Sponsor and support our initiative
            </h1>
          </Reveal>
          <Reveal immediate delay={0.08}>
            <p className="mx-auto mt-6 max-w-[58ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
              Your support empowers the next generation of African leaders, builders, and innovators. By sponsoring a
              program, you directly contribute to our mission of transforming the continent from the inside out.
            </p>
            <div data-wrap className={`${wrap.stage} mt-12 flex flex-col items-center justify-center gap-9 sm:flex-row sm:flex-wrap sm:gap-10`}>
              <div data-wrap-item className={wrap.item} style={{ "--i": 0 } as CSSProperties}>
                <GiveButton as="individual" className={btn.primary}>
                  Give as an individual
                </GiveButton>
              </div>
              <div data-wrap-item className={wrap.item} style={{ "--i": 1 } as CSSProperties}>
                <GiveButton as="company" className={btn.outline}>
                  Give as a company or organization
                </GiveButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What your support makes possible: the signature (drawn circle on the chosen option). */}
      <section aria-labelledby="ways-heading" className="bg-[#EEFCFC] dark:bg-[#071010]">
        <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 md:py-32">
          <Reveal className="mb-14 max-w-2xl">
            <h2
              id="ways-heading"
              className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-[#003E45] md:text-[40px] dark:text-white"
            >
              What your support makes possible
            </h2>
            <p className="mt-4 text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
              Three ways to give. Choose the one that feels right to you.
            </p>
          </Reveal>
          <GiveChooser />
        </div>
      </section>

      {/* How to partner: a real sequence, so it's numbered. */}
      <section
        id="how-to-partner"
        aria-labelledby="partner-heading"
        className="scroll-mt-20 bg-[#003E45] text-white dark:bg-[#003E45]/45"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
          <Reveal className="max-w-2xl">
            <h2 id="partner-heading" className="text-[28px] leading-tight font-bold tracking-[-0.02em] md:text-[40px]">
              How to partner with us
            </h2>
            <p className="mt-3 text-[17px] leading-[1.65] text-white/75">
              We welcome mission-aligned organizations to collaborate with us in creating sustainable impact.
            </p>
          </Reveal>

          <StaggerGroup onViewport className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.06}>
            <StaggerItem>
              <Step n={1}>
                <p className="text-[17px] leading-[1.6] text-white">Contact us by email.</p>
                <a
                  href={`mailto:${PARTNER_EMAIL}`}
                  className="mt-3 inline-flex min-h-11 max-w-full items-start gap-2 py-2 text-[16px] font-semibold break-all text-[#5CE1E6] underline decoration-[#5CE1E6]/40 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#5CE1E6]"
                >
                  <Mail className="mt-[3px] size-4 shrink-0" aria-hidden="true" />
                  {PARTNER_EMAIL}
                </a>
              </Step>
            </StaggerItem>
            {PARTNER_STEPS.map((text, i) => (
              <StaggerItem key={text}>
                <Step n={i + 2}>
                  <p className="text-[17px] leading-[1.6] text-white/80">{text}</p>
                </Step>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Supporters: one logo plate, white in both modes so every mark stays legible. */}
      <section aria-labelledby="supporters-heading" className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <h2
            id="supporters-heading"
            className="text-[24px] leading-snug font-bold tracking-[-0.015em] md:text-[28px] lg:col-span-4"
          >
            Organizations and individuals that support and believe in our goal
          </h2>
          <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-black/10 bg-white sm:grid-cols-3 lg:col-span-8 dark:border-white/10">
            {SUPPORTERS.map((logo) => (
              <li
                key={logo.alt}
                className="-mb-px -ml-px flex h-28 items-center justify-center border-b border-l border-black/10 px-6 md:h-32"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-auto max-h-10 w-auto max-w-full object-contain opacity-80 grayscale"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      </ScrollLine>
    </div>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <span
        aria-hidden="true"
        className="flex size-10 items-center justify-center rounded-full border-2 border-[#5CE1E6] text-[15px] font-bold text-[#5CE1E6]"
      >
        {n}
      </span>
      <span className="sr-only">Step {n}. </span>
      <div className="mt-5">{children}</div>
    </div>
  );
}
