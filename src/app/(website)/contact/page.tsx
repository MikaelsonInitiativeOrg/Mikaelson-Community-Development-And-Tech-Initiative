import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { ContactForm } from "@/features/website/pages/contact/contact-form";
import { ScrollLine } from "@/components/site/scroll-line";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions, feedback or partnership ideas? Write to the Mikaelson Initiative. We would love to hear from you.",
  alternates: { canonical: "https://www.mikaelsoninitiative.org/contact" },
  openGraph: {
    title: "Contact Us | Mikaelson Initiative",
    description: "Questions, feedback or partnership ideas? Write to the Mikaelson Initiative. We would love to hear from you.",
    url: "https://www.mikaelsoninitiative.org/contact",
    images: [{ url: "/assets/images/mikaelsonlogo.png", width: 1200, height: 630, alt: "Mikaelson Initiative" }],
  },
};

// The contact page shows the partnership address; the rest are the site's
// own details from src/components/footer.tsx.
const EMAILS = [
  { address: "partnership@mikaelsoninitiative.org", use: "Partnerships and questions" },
  { address: "hello@mikaelsoninitiative.org", use: "General" },
];

const SOCIALS = [
  { label: "X (Twitter)", href: "https://x.com/mcdti_org" },
  { label: "Instagram", href: "https://www.instagram.com/mikaelson_initiative/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mikaelson-initiative/" },
  { label: "YouTube", href: "https://www.youtube.com/@TheMikaelsonCommunity" },
];

export default function ContactPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>

      <section className="mx-auto max-w-[1200px] px-4 pt-14 pb-12 sm:px-6 md:pt-20 md:pb-16">
        <Reveal immediate>
          <h1 className="text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white">
            Contact us
          </h1>
        </Reveal>
        <Reveal immediate delay={0.08}>
          <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
            Thank you for your interest in the Mikaelson Initiative. We&rsquo;d love to hear from you! Whether you have
            questions, feedback, or want to partner with us, drop us a message below or email us directly.
          </p>
        </Reveal>
      </section>

      <section aria-label="Write to us" className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6 md:pb-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* The letter. No overflow clipping here: the envelope flies out of it. */}
          <Reveal immediate delay={0.12} className="lg:col-span-7">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_2px_rgb(0_62_69/0.06),0_12px_32px_-12px_rgb(0_62_69/0.18)] sm:p-10 dark:border-white/10 dark:bg-[#0b1414] dark:shadow-none">
              <ContactForm />
            </div>
          </Reveal>

          {/* Direct details */}
          <Reveal immediate delay={0.16} className="lg:col-span-5">
            <aside
              aria-label="Other ways to reach us"
              className="flex h-full flex-col gap-10 rounded-2xl bg-[#003E45] p-6 text-white sm:p-10 dark:bg-[#003E45]/45 dark:ring-1 dark:ring-white/10"
            >
              <div>
                <h2 className="text-[22px] font-semibold">Email us directly</h2>
                <ul className="mt-5 flex flex-col gap-4">
                  {EMAILS.map((e) => (
                    <li key={e.address}>
                      <p className="text-[13px] font-semibold text-[#5CE1E6]">{e.use}</p>
                      <a
                        href={`mailto:${e.address}`}
                        className="mt-1 inline-flex min-h-11 max-w-full items-center gap-2 text-[16px] font-medium break-all text-white underline decoration-white/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#5CE1E6] sm:text-[17px]"
                      >
                        <Mail className="size-4 shrink-0 text-[#5CE1E6]" aria-hidden="true" />
                        {e.address}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-[22px] font-semibold">Where we are</h2>
                <a
                  href="https://www.google.com/maps/place/Lagos,+Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-[17px] text-white underline decoration-white/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#5CE1E6]"
                >
                  <MapPin className="size-4 shrink-0 text-[#5CE1E6]" aria-hidden="true" />
                  Lagos, Nigeria
                </a>
              </div>

              <div>
                <h2 className="text-[22px] font-semibold">Follow along</h2>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  {SOCIALS.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1.5 text-[16px] font-medium text-white underline decoration-white/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#5CE1E6]"
                      >
                        {s.label}
                        <ArrowUpRight className="size-4 shrink-0 text-white/60" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
      </ScrollLine>
    </div>
  );
}
