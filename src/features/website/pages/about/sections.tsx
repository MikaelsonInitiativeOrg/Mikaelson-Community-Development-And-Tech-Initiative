import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Info } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/motion/stagger";
import { DrawnUnderline } from "@/features/website/pages/team/warm";
import circle from "@/components/site/circle.module.css";
import { PARTS, PROMISES, STORY } from "./content";
import { body, btn, h2, textLink, wrap } from "./styles";
import styles from "./what-we-do.module.css";

/** Centred, no photos: who we are, in one warm sentence. */
export function AboutHero() {
  return (
    <section className="mx-auto max-w-[900px] px-4 pt-14 pb-20 text-center sm:px-6 md:pt-20 lg:pb-28">
      <Reveal immediate>
        <p className="text-[13px] font-semibold text-[#003E45] dark:text-[#5CE1E6]">About the Mikaelson Initiative</p>
        <h1 className="mt-4 text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white">
          Building a better Africa,{" "}
          <span className="relative inline-block whitespace-nowrap">
            one student
            <DrawnUnderline immediate className="absolute -bottom-3 left-0 h-4 w-full sm:-bottom-4 sm:h-5" />
          </span>{" "}
          at a time
        </h1>
      </Reveal>
      <Reveal immediate delay={0.08}>
        <p className={`mx-auto mt-8 max-w-[58ch] ${body}`}>
          The Mikaelson Community Development and Tech Initiative is a standalone organisation dedicated to fostering
          innovation and sustainable community development across Africa, through technology-driven solutions and
          educational empowerment.
        </p>
        <a href="#story" className={`${btn.dark} mt-9`}>
          Read our story
          <ArrowRight className="size-4 rotate-90" aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  );
}

/** Who we are and why: the organisation, then mission, vision and values. */
export function WhoWeAre() {
  return (
    <section aria-labelledby="who-heading" className="bg-[#EEFCFC] dark:bg-[#071010]">
      <div className={`${wrap} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-16`}>
        <Reveal className="lg:col-span-5">
          <h2 id="who-heading" className={h2}>
            Who we are, and why we exist
          </h2>
          <p className={`mt-5 max-w-[52ch] ${body}`}>
            We were founded to empower African communities by providing accessible technology, educational resources
            and sustainable development programmes that create lasting, positive impact.
          </p>
          <p className={`mt-4 max-w-[52ch] ${body}`}>
            As an independent initiative, we keep full autonomy over our programmes, partnerships and direction. We are
            committed to transparency, authenticity, and building genuine partnerships that drive meaningful change.
          </p>
          <div className="mt-8 flex max-w-[52ch] gap-3 rounded-2xl border border-[#003E45]/15 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <Info className="mt-0.5 size-5 shrink-0 text-[#0097A7] dark:text-[#5CE1E6]" aria-hidden="true" />
            <p className="text-[15px] leading-[1.65] text-[#333] dark:text-white/75">
              <strong className="font-semibold text-[#003E45] dark:text-white">Please note:</strong>{" "}the Mikaelson
              Initiative is not associated with any NGO, foundation or other entity bearing the name
              &lsquo;Mikaelson&rsquo;.
            </p>
          </div>
        </Reveal>
        <StaggerGroup onViewport className="flex flex-col gap-5 lg:col-span-7">
          {PROMISES.map((p) => (
            <StaggerItem key={p.title}>
              <div className="rounded-2xl bg-white p-6 shadow-[0_14px_36px_-24px_rgb(0_62_69/0.35)] ring-1 ring-[#003E45]/8 sm:p-8 dark:bg-[#0E1819] dark:shadow-none dark:ring-white/10">
                <h3 className="text-[19px] font-semibold text-[#003E45] md:text-[21px] dark:text-[#5CE1E6]">
                  {p.title}
                </h3>
                <p className="mt-2 text-base leading-[1.7] text-[#555] dark:text-white/70">{p.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/** The founder's story, as a calm reading column. */
export function OurStory() {
  return (
    <section id="story" aria-labelledby="story-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-[760px] px-4 py-24 sm:px-6 md:py-32">
        <Reveal>
          <p className="text-[13px] font-semibold text-[#0b6b75] dark:text-[#5CE1E6]">Where it began</p>
          <h2 id="story-heading" className={`mt-3 ${h2}`}>
            Our story
          </h2>
        </Reveal>
        <div className="mt-8 flex flex-col gap-6">
          {STORY.map((para, i) => (
            <Reveal key={i}>
              <p
                className={
                  i === 0
                    ? "text-[18px] leading-[1.75] text-[#222] sm:text-[20px] dark:text-white/85"
                    : `${body} sm:leading-[1.75]`
                }
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** What we do: the four parts of the ecosystem, detailing the problems we solve and circled by the scroll line. */
export function WhatWeDo() {
  return (
    <section aria-labelledby="do-heading" className="border-t border-[#003E45]/10 dark:border-white/10">
      <div className={`${wrap} py-24 md:py-32`}>
        <Reveal>
          <p className="text-[13px] font-semibold text-[#0b6b75] dark:text-[#5CE1E6]">
            The problems we solve & our ecosystem
          </p>
          <h2 id="do-heading" className={`mt-2 ${h2}`}>
            What we do
          </h2>
          <p className={`mt-5 max-w-[64ch] ${body}`}>
            We tackle the structural challenges holding young Africans back—from academic drift and the lack of habit
            systems in secondary schools and universities, to the absence of authentic African research and scholarship.
            Here is what we are solving across four integrated pillars of one ecosystem.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          {PARTS.map((part, i) => (
            <article
              key={part.id}
              data-circle
              className={`${circle.item} ${styles.card} flex h-full flex-col rounded-2xl border border-[#003E45]/12 bg-white p-6 shadow-sm transition-[border-color,box-shadow] sm:p-8 dark:border-white/10 dark:bg-[#0E1819]`}
              style={{ "--lift": 1.025 } as CSSProperties}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[13px] font-bold tracking-wider text-[#0b6b75] uppercase dark:text-[#5CE1E6]">
                  Part 0{i + 1} of 04
                </span>
                <span
                  className={`${styles.cardBadge} rounded-full bg-[#EEFCFC] px-3 py-1 text-[12px] font-semibold text-[#003E45] transition-colors dark:bg-white/10 dark:text-[#5CE1E6]`}
                >
                  {part.badge}
                </span>
              </div>

              <h3 className="mt-4 text-[22px] font-bold tracking-tight text-[#111] md:text-[24px] dark:text-white">
                {part.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#555] dark:text-white/70">
                {part.text}
              </p>

              <div className="mt-5 rounded-xl border border-[#003E45]/10 bg-[#003E45]/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-[12px] font-bold tracking-wider text-[#003E45] uppercase dark:text-[#5CE1E6]">
                  The Problem We Solve
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.65] text-[#444] dark:text-white/80">
                  {part.problem}
                </p>
              </div>

              <div className="mt-3.5 rounded-xl border border-[#0097A7]/20 bg-[#EEFCFC]/70 p-4 dark:border-[#5CE1E6]/20 dark:bg-[#5CE1E6]/[0.05]">
                <p className="text-[12px] font-bold tracking-wider text-[#0b6b75] uppercase dark:text-[#5CE1E6]">
                  How We Solve It
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.65] text-[#333] dark:text-white/85">
                  {part.solution}
                </p>
              </div>

              <ul className="mt-5 grow space-y-2">
                {part.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[#555] dark:text-white/75"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0097A7] dark:bg-[#5CE1E6]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-[#003E45]/10 pt-4 dark:border-white/10">
                {part.cta.external ? (
                  <a href={part.cta.href} target="_blank" rel="noopener noreferrer" className={textLink}>
                    {part.cta.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <Link href={part.cta.href} className={textLink}>
                    {part.cta.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The one warm teal band: three ways to walk with us. */
export function JoinBand() {
  return (
    <section aria-labelledby="join-heading" className="bg-[#003E45] py-20 text-center text-white sm:py-24 lg:py-32 dark:bg-[#003E45]/45">
      <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 lg:px-8">
        <h2 id="join-heading" className="text-[28px] leading-tight font-bold tracking-[-0.02em] sm:text-[40px]">
          Join our{" "}
          <span className="relative inline-block whitespace-nowrap">
            movement
            <DrawnUnderline className="absolute -bottom-2.5 left-0 h-3.5 w-full sm:h-4" />
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-[56ch] text-base leading-[1.7] text-white/80 sm:text-[18px]">
          Be part of the generation that transforms Africa. Join our community of ambitious students and changemakers
          today.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/volunteer" className={btn.primaryOnTeal}>
            Volunteer with us
          </Link>
          <Link href="/sponsor" className={btn.onTeal}>
            Support our work
          </Link>
          <Link href="/contact" className={btn.onTeal}>
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
