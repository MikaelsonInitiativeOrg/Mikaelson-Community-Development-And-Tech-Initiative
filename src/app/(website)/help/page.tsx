import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircleQuestion, PenLine } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { ScrollLine } from "@/components/site/scroll-line";
import wrap from "@/components/site/wrap.module.css";
import { HelpSearch } from "@/features/website/pages/help/help-search";
import { HELP_CATEGORIES } from "@/features/website/pages/help/topics";
import { btn } from "@/features/website/pages/volunteer/styles";

const description =
  "Find answers, get support, and learn how to make the most of your Mikaelson Initiative experience.";

export const metadata: Metadata = {
  title: "Help Center",
  description,
  alternates: { canonical: "https://www.mikaelsoninitiative.org/help" },
  openGraph: {
    title: "Help Center | Mikaelson Initiative",
    description,
    url: "https://www.mikaelsoninitiative.org/help",
    images: [{ url: "/assets/images/mikaelsonlogo.png", width: 1200, height: 630, alt: "Mikaelson Initiative" }],
  },
};

const POLICIES = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
  { label: "All legal pages", href: "/legal" },
];

const inlineLink =
  "font-semibold text-[#003E45] underline decoration-[#003E45]/25 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#003E45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] dark:text-[#5CE1E6] dark:decoration-[#5CE1E6]/30 dark:hover:decoration-[#5CE1E6]";

export default function HelpPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>
        {/* Hero, centred, with the search. */}
        <section className="mx-auto max-w-[900px] px-4 pt-14 pb-20 text-center sm:px-6 md:pt-20 md:pb-28">
          <Reveal immediate>
            <h1 className="text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white">
              How can we help?
            </h1>
          </Reveal>
          <Reveal immediate delay={0.08}>
            <p className="mx-auto mt-6 max-w-[52ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
              Find answers, get support, and learn how to make the most of your Mikaelson Initiative experience.
            </p>
          </Reveal>
          <Reveal immediate delay={0.14}>
            <HelpSearch />
          </Reveal>
        </section>

        {/* Categories. The line wraps around each card in turn and it comes
            forward as it does (ScrollLine's data-wrap). */}
        <section aria-labelledby="topics-heading" className="bg-[#EEFCFC] dark:bg-[#071010]">
          <div className="mx-auto max-w-[1100px] px-4 py-24 sm:px-6 md:py-32">
            <Reveal className="text-center">
              <h2
                id="topics-heading"
                className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-[#003E45] md:text-[40px] dark:text-white"
              >
                Browse by topic
              </h2>
              <p className="mx-auto mt-4 max-w-[48ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
                Pick the area closest to your question. Each one points you to the right place.
              </p>
            </Reveal>

            <div data-wrap className={`${wrap.stage} mt-14 grid gap-6 md:grid-cols-2 md:gap-8`}>
              {HELP_CATEGORIES.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={c.id} data-wrap-item className={`${wrap.item} h-full`} style={{ "--i": i } as CSSProperties}>
                    <article
                      aria-labelledby={`${c.id}-title`}
                      className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgb(0_62_69/0.06),0_12px_32px_-16px_rgb(0_62_69/0.2)] sm:p-8 dark:bg-[#0b1414] dark:shadow-none dark:ring-1 dark:ring-white/10"
                    >
                      <span className="flex size-12 items-center justify-center rounded-full bg-[#E8F7F8] text-[#003E45] dark:bg-[#003E45] dark:text-[#5CE1E6]">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h3
                        id={`${c.id}-title`}
                        className="mt-5 text-[21px] font-semibold tracking-[-0.01em] text-[#111] dark:text-white"
                      >
                        {c.title}
                      </h3>
                      <p className="mt-2 text-base leading-[1.7] text-[#555] dark:text-white/65">{c.description}</p>
                      <ul className="mt-6 flex flex-col border-t border-black/10 dark:border-white/10">
                        {c.topics.map((t) => (
                          <li key={t.title} className="border-b border-black/10 last:border-b-0 dark:border-white/10">
                            <Link
                              href={t.href}
                              className="group -mx-2 flex min-h-11 items-center gap-4 rounded-lg px-2 py-3.5 transition-[background-color] duration-150 ease-[ease] hover:bg-[#EEFCFC] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#0097A7] dark:hover:bg-white/5"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block text-[16px] font-semibold text-[#003E45] dark:text-white">
                                  {t.title}
                                </span>
                                <span className="mt-0.5 block text-[15px] leading-[1.6] text-[#555] dark:text-white/65">
                                  {t.description}
                                </span>
                              </span>
                              <ArrowRight
                                className="size-4 shrink-0 text-[#0097A7] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transition-none dark:text-[#5CE1E6]"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Still need help? The one warm teal band. */}
        <section aria-labelledby="still-heading" className="bg-[#003E45] text-white dark:bg-[#003E45]/45">
          <div className="mx-auto max-w-[1100px] px-4 py-24 sm:px-6 md:py-32">
            <Reveal className="text-center">
              <h2 id="still-heading" className="text-[28px] leading-tight font-bold tracking-[-0.02em] md:text-[40px]">
                Still need help?
              </h2>
              <p className="mx-auto mt-4 max-w-[46ch] text-[18px] leading-[1.7] text-white/80">
                Can&rsquo;t find what you&rsquo;re looking for? Write to us, or see if the FAQ has it covered.
              </p>
            </Reveal>

            <div className="mx-auto mt-12 grid max-w-[860px] gap-6 md:grid-cols-2">
              <Reveal>
                <div className="flex h-full flex-col rounded-2xl bg-white p-6 text-[#111] sm:p-8 dark:bg-[#0b1414] dark:text-white dark:ring-1 dark:ring-white/10">
                  <PenLine className="size-6 text-[#0097A7] dark:text-[#5CE1E6]" aria-hidden="true" />
                  <h3 className="mt-4 text-[21px] font-semibold text-[#003E45] dark:text-white">Write to us</h3>
                  <p className="mt-2 flex-1 text-base leading-[1.7] text-[#555] dark:text-white/65">
                    Get detailed help by message or email.
                  </p>
                  <div className="mt-6 flex flex-col items-start gap-2">
                    <Link href="/contact" className={btn.primary}>
                      Contact us
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                    <a
                      href="mailto:hello@mikaelsoninitiative.org"
                      className={`${inlineLink} inline-flex min-h-11 max-w-full items-center gap-2 break-all`}
                    >
                      <Mail className="size-4 shrink-0" aria-hidden="true" />
                      hello@mikaelsoninitiative.org
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="flex h-full flex-col rounded-2xl bg-white p-6 text-[#111] sm:p-8 dark:bg-[#0b1414] dark:text-white dark:ring-1 dark:ring-white/10">
                  <MessageCircleQuestion className="size-6 text-[#0097A7] dark:text-[#5CE1E6]" aria-hidden="true" />
                  <h3 className="mt-4 text-[21px] font-semibold text-[#003E45] dark:text-white">Read the FAQ</h3>
                  <p className="mt-2 flex-1 text-base leading-[1.7] text-[#555] dark:text-white/65">
                    Common questions answered, from what we do to how to get involved.
                  </p>
                  <div className="mt-6">
                    <Link href="/faq" className={btn.dark}>
                      View the FAQ
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <p className="mt-12 text-center text-[15px] leading-[1.9] text-white/75">
                Looking for our policies?{" "}
                {POLICIES.map((p, i) => (
                  <span key={p.href}>
                    <Link
                      href={p.href}
                      className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/30 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#5CE1E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6]"
                    >
                      {p.label}
                    </Link>
                    {i < POLICIES.length - 1 && <span aria-hidden="true" className="px-2 text-white/40">·</span>}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
        </section>
      </ScrollLine>
    </div>
  );
}
