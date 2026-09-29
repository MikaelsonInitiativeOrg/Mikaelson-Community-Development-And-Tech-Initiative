import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Gift, HandHeart, Handshake } from "lucide-react";
import { audience } from "@/components/client-page/data";
import { HeroArt } from "./hero-art";
import { Reveal } from "@/components/site/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/motion/stagger";
import styles from "./home.module.css";
import walk from "@/components/site/wrap.module.css";

/* No photos on the home page (the user's call): the page is carried by
   type, the brand colours, a map drawn in code and the scroll line. Headings marked
   data-stop are where the line ties its loops. */

export const container = "mx-auto max-w-[1200px] px-4 sm:px-8";
export const lane = "pl-8 lg:pl-24";

const h2 = "text-[28px] leading-[1.15] font-bold tracking-[-0.02em] sm:text-[40px]";
const body = "text-[16px] leading-[1.7] sm:text-[18px]";
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2";
const btnTurquoise = `${styles.press} inline-flex min-h-11 items-center gap-2 rounded-full bg-[#5ce1e6] px-6 text-[15px] font-semibold text-black hover:bg-[#4bcdd2] ${focusRing} focus-visible:outline-[#003e45] dark:focus-visible:outline-white`;
// The School Club's chunky button (a solid "shadow step" that presses down):
// turquoise with black text (13.4:1) on a deep-teal step.
const btnChunky = `inline-flex min-h-11 items-center gap-2 rounded-full bg-[#5ce1e6] px-6 py-3 text-[15px] font-bold text-[#050a0a] shadow-[0_10px_0_-2px_#003e45] transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:translate-y-[2px] hover:shadow-[0_6px_0_-2px_#003e45] active:translate-y-[6px] active:shadow-[0_2px_0_-2px_#003e45] ${focusRing} focus-visible:outline-[#003e45]`;

const CLUB = "https://club.mikaelsoninitiative.org";

/* ---------------------------------------------------------------- Hero */

/* White, with a centred campaign-style headline (after She Code
   Africa's) over African art drawn in code (HeroArt), not a photo. */

export function Hero() {
  return (
    <section
      className="relative flex min-h-[calc(100svh-7rem)] items-center overflow-hidden bg-white py-[72px] text-[#050a0a] md:py-[96px]"
    >
      {/* Uli line art around the edges (HeroArt), drawn in code, with a
          white centre so any line near the words fades out behind them. */}
      <HeroArt />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_50%_48%,rgb(255_255_255/0.9),rgb(255_255_255/0))]"
      />

      <div className={`${container} relative w-full`}>
        <div className="mx-auto max-w-[1100px] text-center">
          <Reveal immediate>
            <h1 data-stop className="font-extrabold tracking-[-0.03em]">
              <span className="block text-[20px] leading-[1.3] text-[#050a0a] sm:text-[28px] lg:text-[34px]">
                Building the
              </span>
              <span className="mt-3 block text-[42px] leading-[1] text-[#003e45] sm:mt-4 sm:text-[64px] lg:text-[80px] xl:text-[92px]">
                Habits, Knowledge, Communities, and Capacity
              </span>
              <span className="mt-3 block text-[20px] leading-[1.3] text-[#050a0a] sm:mt-5 sm:text-[28px] lg:text-[34px]">
                Behind the People Who Will Build What Africa Becomes.
              </span>
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className={`mx-auto mt-8 max-w-[44rem] text-balance text-[#003e45] ${body}`}>
              Mikaelson Initiative is a youth and community development institution building practical systems for
              human development, education, technology, and African knowledge.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#our-ecosystem" className={btnChunky}>
                Explore our ecosystem
                <ArrowRight aria-hidden="true" size={16} className={styles.arrow} />
              </a>
              <a
                href="#walk-with-us"
                className={`${styles.press} inline-flex min-h-11 items-center rounded-full border-[1.5px] border-[#003e45] bg-white/30 px-6 text-[15px] font-semibold text-[#003e45] hover:bg-white/60 ${focusRing} focus-visible:outline-[#003e45]`}
              >
                Walk with us
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Who we serve */

export function WhoWeServe() {
  return (
    <section className="bg-[#eefcfc] py-24 md:py-32 dark:bg-[#0d1515]">
      <div className={container}>
        <div className={`${lane} grid gap-12 lg:grid-cols-12 lg:gap-10`}>
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 data-stop className={`${h2} text-[#003e45] dark:text-white`}>
                Who we serve
              </h2>
              <p className={`mt-6 max-w-[30rem] text-[#555] dark:text-white/65 ${body}`}>
                Some are in secondary school. Some are at university. Some have an idea they can&rsquo;t stop thinking
                about. What they share is a wish to grow, and growing is easier together.
              </p>
            </div>
          </Reveal>

          <StaggerGroup onViewport staggerChildren={0.06} className="lg:col-span-7 lg:col-start-6">
            {audience.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex gap-5 border-t border-[#003e45]/15 py-8 first:border-t-0 first:pt-0 sm:gap-7 dark:border-white/10">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#003e45] shadow-[0_6px_18px_-10px_rgb(0_62_69/0.5)] dark:bg-white/10 dark:text-[#5ce1e6]">
                    <item.icon aria-hidden="true" size={22} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[#111] sm:text-[24px] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.7] text-[#555] dark:text-white/65">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Walk with us */

const WAYS = [
  {
    icon: HandHeart,
    title: "Volunteer",
    text: "Give your time and what you know. Help at sessions, share your skills and be someone a student can look up to.",
    cta: "Volunteer with us",
    href: "/volunteer",
  },
  {
    icon: Gift,
    title: "Sponsor",
    text: "Sponsor a student or fund a workshop, so more young people get a place in the room.",
    cta: "Become a sponsor",
    href: "/sponsor",
  },
  {
    icon: Handshake,
    title: "Partner",
    text: "Bring your school or organization into the network and help students go further. Tell us what you have in mind.",
    cta: "Get in touch",
    href: "/contact",
  },
];

export function WalkWithUs() {
  return (
    <section id="walk-with-us" className="scroll-mt-16 bg-white py-24 md:py-32 dark:bg-[#0a0f0f]">
      <div className={container}>
        <div className={lane}>
          <Reveal>
            <h2 data-stop className={`${h2} text-[#003e45] dark:text-white`}>
              Walk with us
            </h2>
            <p className={`mt-6 max-w-[40rem] text-[#555] dark:text-white/65 ${body}`}>
              There&rsquo;s a place for you in this. Give your time, give support, or bring your organization along.
              Every one of these puts someone beside a student.
            </p>
          </Reveal>

          {/* The line wraps around each of these in turn (ScrollLine's data-wrap),
              and each one comes forward as it does. */}
          <div data-wrap className={`${walk.stage} mt-16 grid gap-10 md:grid-cols-3 md:gap-12`}>
            {WAYS.map((way, i) => (
              <div key={way.title} data-wrap-item className={`${walk.item} h-full`} style={{ "--i": i } as CSSProperties}>
                <Link
                  href={way.href}
                  className={`${styles.card} ${styles.press} group flex h-full flex-col rounded-2xl border border-black/10 p-6 hover:border-[#5ce1e6] sm:p-7 dark:border-white/10 dark:hover:border-[#5ce1e6] ${focusRing} focus-visible:outline-[#0097a7]`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eefcfc] text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
                    <way.icon aria-hidden="true" size={22} />
                  </span>
                  <span className="mt-6 block text-[20px] font-semibold tracking-[-0.01em] text-[#111] sm:text-[22px] dark:text-white">
                    {way.title}
                  </span>
                  <span className="mt-2 block text-[16px] leading-[1.7] text-[#555] dark:text-white/65">{way.text}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-[#003e45] dark:text-[#5ce1e6]">
                    {way.cta}
                    <ArrowRight aria-hidden="true" size={16} className={styles.arrow} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Closing */

export function Closing() {
  return (
    <section className="bg-[#003e45] py-24 text-white md:py-28 dark:bg-[#062a2f]">
      <div className={container}>
        <Reveal className={`${lane} max-w-[52rem]`}>
          <h2 data-stop className={h2}>
            <span data-underline>Every step is easier with someone beside you</span>
          </h2>
          <p className={`mt-8 text-white/75 ${body}`}>
            Start a club at your school, or tell us how you&rsquo;d like to help. We&rsquo;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className={btnTurquoise}>
              Get in touch
            </Link>
            <a
              href={CLUB}
              target="_blank"
              rel="noreferrer"
              className={`${styles.press} inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-white/30 px-6 text-[15px] font-semibold text-white hover:border-white ${focusRing} focus-visible:outline-[#5ce1e6]`}
            >
              Start a School Club
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
