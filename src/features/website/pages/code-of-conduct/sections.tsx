import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowDown,
  Check,
  HandHeart,
  Mail,
  ShieldCheck,
  Sprout,
  X,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/motion/stagger";
import circle from "@/components/site/circle.module.css";
import { btn } from "@/features/website/pages/volunteer/styles";
import {
  ATTRIBUTION,
  CHANNELS,
  CONDUCT_EMAIL,
  CONFIDENTIALITY,
  ENFORCEMENT_INTRO,
  EXPECTED,
  INVESTIGATION,
  LADDER,
  LAST_UPDATED,
  NOTIFY,
  PARTICIPATION,
  PLEDGE,
  REPORT_MAILTO,
  REVIEW,
  SCOPE,
  SCOPE_NOTE,
  SUPPORT,
  UNACCEPTABLE,
  VALUES,
  VISION,
  WHAT_TO_INCLUDE,
} from "./content";

const h2 = "text-[28px] leading-tight font-bold tracking-[-0.02em] text-[#003E45] md:text-[40px] dark:text-white";
const lede = "text-[18px] leading-[1.7] text-[#555] dark:text-white/65";
const body = "text-base leading-[1.7] text-[#555] dark:text-white/65";
const h3 = "text-[19px] font-semibold text-[#111] md:text-[21px] dark:text-white";
const card =
  "rounded-2xl bg-white p-6 ring-1 ring-[#003E45]/10 sm:p-8 dark:bg-[#0b1414] dark:ring-white/10";
const link =
  "font-semibold text-[#003E45] underline underline-offset-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] dark:text-[#5CE1E6]";
const wrap = "mx-auto max-w-[1200px] px-4 sm:px-6";

const VALUE_ICON: Record<(typeof VALUES)[number]["key"], LucideIcon> = {
  growth: Sprout,
  together: HandHeart,
  integrity: ShieldCheck,
};

function Dots({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`flex flex-col gap-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-[1.6] text-[#333] dark:text-white/80">
          <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-[#0097A7]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionHead({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="max-w-[720px]">
      <h2 id={id} className={h2}>
        {title}
      </h2>
      {children ? <div className={`mt-5 ${lede}`}>{children}</div> : null}
    </Reveal>
  );
}

export function ConductHero() {
  return (
    <section className="mx-auto max-w-[900px] px-4 pt-14 pb-20 text-center sm:px-6 md:pt-20 lg:pb-28">
      <Reveal immediate>
        <h1 className="text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white">
          Code of Conduct
        </h1>
      </Reveal>
      <Reveal immediate delay={0.08}>
        <p className={`mx-auto mt-6 max-w-[58ch] ${lede}`}>
          Our pledge to maintain a safe, inclusive, and respectful community. It is a promise between everyone who
          takes part in the Mikaelson Initiative: community members, participants, volunteers, and staff. Here is how
          we treat each other, and what happens when something goes wrong.
        </p>
        <p className="mt-5 text-[14px] text-[#555] dark:text-white/60">Last updated {LAST_UPDATED}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="#report" className={btn.primary}>
            Report a concern
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
          <a href="#values" className={btn.outline}>
            Read our values
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function Pledge() {
  return (
    <section aria-labelledby="pledge-heading" className={`${wrap} grid gap-10 pb-24 md:pb-32 lg:grid-cols-12 lg:gap-16`}>
      <Reveal className="lg:col-span-4">
        <h2 id="pledge-heading" className={h2}>
          Our pledge
        </h2>
      </Reveal>
      <Reveal className="lg:col-span-8">
        <div className="flex flex-col gap-5">
          {PLEDGE.map((p) => (
            <p key={p.slice(0, 24)} className={lede}>
              {p}
            </p>
          ))}
        </div>
        <figure className="mt-10 rounded-2xl border-l-4 border-[#5CE1E6] bg-[#EEFCFC] p-6 sm:p-8 dark:bg-white/5">
          <figcaption className="text-[13px] font-semibold text-[#0b6b75] dark:text-[#5CE1E6]">Community vision</figcaption>
          <blockquote className="mt-2 text-[20px] leading-[1.5] font-medium text-[#003E45] md:text-[22px] dark:text-white">
            {VISION}
          </blockquote>
        </figure>
      </Reveal>
    </section>
  );
}

export function Values() {
  return (
    <section id="values" aria-labelledby="values-heading" className="scroll-mt-20 bg-[#EEFCFC] dark:bg-[#071010]">
      <div className={`${wrap} py-24 md:py-32`}>
        <SectionHead id="values-heading" title="What we value">
          <p>Three things we ask of each other, and of ourselves.</p>
        </SectionHead>
        {/* The scroll line loops around each value in turn, and the one it
            is on comes forward (ScrollLine's data-circle). */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {VALUES.map((v) => {
            const Icon = VALUE_ICON[v.key];
            return (
              <article
                key={v.key}
                data-circle
                className={`${circle.item} ${card}`}
                style={{ "--lift": 1.03 } as CSSProperties}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-[#EEFCFC] text-[#003E45] dark:bg-[#003E45] dark:text-[#5CE1E6]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className={`mt-5 ${h3}`}>{v.title}</h3>
                <p className={`mt-2 ${body}`}>{v.text}</p>
                <Dots items={v.points} className="mt-5" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Standards() {
  return (
    <section aria-labelledby="standards-heading" className={`${wrap} py-24 md:py-32`}>
      <SectionHead id="standards-heading" title="How we treat each other">
        <p>What helps our community feel safe and welcoming, and what has no place in it.</p>
      </SectionHead>
      <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
        <Reveal>
          <div className={`${card} h-full`}>
            <h3 className={h3}>What we expect</h3>
            <p className={`mt-2 ${body}`}>
              Examples of behavior that contributes to a positive environment for our community include:
            </p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {EXPECTED.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-[1.6] text-[#333] dark:text-white/80">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#5CE1E6]/35 text-[#003E45] dark:bg-[#5CE1E6]/20 dark:text-[#5CE1E6]">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={`${card} h-full`}>
            <h3 className={h3}>What is not okay</h3>
            <p className={`mt-2 ${body}`}>Examples of unacceptable behavior include:</p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {UNACCEPTABLE.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-[1.6] text-[#333] dark:text-white/80">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#b3261e]/10 text-[#9a1f18] dark:bg-[#ff8a80]/15 dark:text-[#ffb4ab]">
                    <X className="size-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Participation() {
  return (
    <section aria-labelledby="participation-heading" className="bg-[#E8F7F8]/60 dark:bg-[#071010]">
      <div className={`${wrap} py-24 md:py-32`}>
        <SectionHead id="participation-heading" title="Wherever we meet">
          <p>In a workshop, on a video call or in your own work, the same care applies.</p>
        </SectionHead>
        <StaggerGroup onViewport className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {PARTICIPATION.map((p) => (
            <StaggerItem key={p.title}>
              <div className={`${card} h-full`}>
                <h3 className={h3}>{p.title}</h3>
                <p className={`mt-2 ${body}`}>{p.text}</p>
                <Dots items={p.points} className="mt-5" />
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function Enforcement() {
  return (
    <section aria-labelledby="enforcement-heading" className={`${wrap} py-24 md:py-32`}>
      <SectionHead id="enforcement-heading" title="If something goes wrong">
        <p>{ENFORCEMENT_INTRO}</p>
      </SectionHead>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <h3 className={h3}>How we look into a report</h3>
          <p className={`mt-2 ${body}`}>All reports will be reviewed promptly and thoroughly:</p>
          <Dots items={INVESTIGATION} className="mt-5" />
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <h3 className={h3}>What the consequences can be</h3>
            <p className={`mt-2 ${body}`}>
              Community leaders will follow these Community Impact Guidelines in determining the consequences for any
              action they deem in violation of this Code of Conduct:
            </p>
          </Reveal>
          <Reveal className="mt-6">
            <ol className="flex flex-col gap-4">
              {LADDER.map((step, i) => (
                  <li key={step.title} className="flex gap-4 rounded-2xl bg-[#EEFCFC] p-5 sm:p-6 dark:bg-white/5">
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#003E45] text-[15px] font-bold text-white dark:bg-[#5CE1E6] dark:text-[#003E45]"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-[17px] font-semibold text-[#003E45] dark:text-white">
                        <span className="sr-only">Step {i + 1}: </span>
                        {step.title}
                      </h4>
                      <p className="mt-2 text-[15px] leading-[1.65] text-[#444] dark:text-white/75">
                        <strong className="font-semibold text-[#111] dark:text-white">Impact:</strong> {step.impact}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-[1.65] text-[#444] dark:text-white/75">
                        <strong className="font-semibold text-[#111] dark:text-white">Consequence:</strong>{" "}
                        {step.consequence}
                      </p>
                    </div>
                  </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const bandLink =
  "rounded-sm text-white underline decoration-white/35 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:decoration-[#5CE1E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6]";

export function ReportConcern() {
  return (
    <section
      id="report"
      aria-labelledby="report-heading"
      className="scroll-mt-20 bg-[#003E45] text-white dark:bg-[#003E45]/45"
    >
      <div className={`${wrap} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-14`}>
        <Reveal className="lg:col-span-5">
          <h2 id="report-heading" className="text-[28px] leading-tight font-bold tracking-[-0.02em] md:text-[40px]">
            Report a concern
          </h2>
          <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.7] text-white/85">
            If you experience or witness behavior that violates this Code of Conduct, please report it immediately.
            All community members are encouraged to report violations, even if they are not directly affected.
          </p>
          <a href={REPORT_MAILTO} className={`${btn.primary} mt-9 max-w-full`}>
            <Mail className="size-4 shrink-0" aria-hidden="true" />
            Email the Code of Conduct team
          </a>
          <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.6] text-white/70">
            This opens your own email app with a message to{" "}
            <a href={`mailto:${CONDUCT_EMAIL}`} className={`${bandLink} break-words`}>
              {CONDUCT_EMAIL}
            </a>
            , ready for you to fill in. Nothing is sent until you send it.
          </p>

          <div className="mt-10 rounded-2xl bg-white/8 p-6 ring-1 ring-white/15">
            <h3 className="text-[17px] font-semibold text-[#5CE1E6]">Confidentiality and support</h3>
            <p className="mt-2 text-base leading-[1.7] text-white/85">{CONFIDENTIALITY}</p>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-7">
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            <div>
              <h3 className="text-[17px] font-semibold text-[#5CE1E6]">Ways to reach us</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-white/75">
                You can report violations through any of the following channels:
              </p>
              <ul className="mt-5 flex flex-col gap-3.5">
                {CHANNELS.map((c) => (
                  <li key={c.text} className="flex gap-3 text-base leading-[1.6] text-white/90">
                    <Check className="mt-1 size-4 shrink-0 text-[#5CE1E6]" aria-hidden="true" />
                    {c.href ? (
                      <a href={c.href} className={`${bandLink} break-words`}>
                        {c.text}
                      </a>
                    ) : (
                      c.text
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#5CE1E6]">What to include</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-white/75">
                When reporting a violation, please provide as much information as possible:
              </p>
              <ul className="mt-5 flex flex-col gap-3.5">
                {WHAT_TO_INCLUDE.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-[1.6] text-white/90">
                    <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-[#5CE1E6]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/15 pt-8">
            <h3 className="text-[17px] font-semibold text-[#5CE1E6]">Questions about this code?</h3>
            <p className="mt-2 text-base leading-[1.7] text-white/85">
              For questions, concerns, or reports related to this Code of Conduct, visit our{" "}
              <Link href="/contact" className={bandLink}>
                contact page
              </Link>{" "}
              for general conduct inquiries, or write to the Code of Conduct team at{" "}
              <a href={`mailto:${CONDUCT_EMAIL}`} className={`${bandLink} break-words`}>
                {CONDUCT_EMAIL}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Scope() {
  return (
    <section aria-labelledby="scope-heading" className={`${wrap} grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:gap-16`}>
      <div className="lg:col-span-5">
        <SectionHead id="scope-heading" title="Where this code applies">
          <p>This Code of Conduct applies within all community spaces, including but not limited to:</p>
        </SectionHead>
      </div>
      <Reveal className="lg:col-span-7">
        <ul className="grid gap-3 sm:grid-cols-2">
          {SCOPE.map((s) => (
            <li
              key={s}
              className="rounded-xl bg-[#EEFCFC] px-5 py-4 text-base leading-[1.5] font-medium text-[#003E45] dark:bg-white/5 dark:text-white"
            >
              {s}
            </li>
          ))}
        </ul>
        <p className={`mt-8 ${body}`}>{SCOPE_NOTE}</p>
      </Reveal>
    </section>
  );
}

export function Support() {
  return (
    <section aria-labelledby="support-heading" className="bg-[#EEFCFC] dark:bg-[#071010]">
      <div className={`${wrap} py-24 md:py-32`}>
        <SectionHead id="support-heading" title="Support when you need it">
          <p>
            We are committed to supporting all community members and providing resources for those who need
            assistance.
          </p>
        </SectionHead>
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          <Reveal>
            <div className={`${card} h-full`}>
              <h3 className={h3}>Within our community</h3>
              <Dots items={SUPPORT.internal} className="mt-5" />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className={`${card} h-full`}>
              <h3 className={h3}>Beyond our community</h3>
              <p className={`mt-2 ${body}`}>
                For serious incidents or when additional support is needed, we can connect members with:
              </p>
              <Dots items={SUPPORT.external} className="mt-5" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Updates() {
  return (
    <section aria-labelledby="updates-heading" className={`${wrap} py-24 md:py-32`}>
      <SectionHead id="updates-heading" title="Keeping this code current">
        <p>
          This Code of Conduct is a living document that may be updated periodically to reflect the evolving needs of
          our community and best practices in community management.
        </p>
      </SectionHead>
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <h3 className={h3}>How we review it</h3>
          <Dots items={REVIEW} className="mt-5" />
        </Reveal>
        <Reveal delay={0.06}>
          <h3 className={h3}>When it changes, we will</h3>
          <Dots items={NOTIFY} className="mt-5" />
        </Reveal>
      </div>
    </section>
  );
}

export function Attribution() {
  return (
    <section aria-labelledby="attribution-heading" className="border-t border-[#003E45]/10 dark:border-white/10">
      <div className={`${wrap} grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5">
          <SectionHead id="attribution-heading" title="Where this code comes from" />
        </div>
        <Reveal className="lg:col-span-7">
          <div className="flex flex-col gap-5">
            {ATTRIBUTION.map((p) => (
              <p key={p.slice(0, 24)} className={body}>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className={btn.dark}>
              Ask us a question
            </Link>
            <Link href="/terms" className={btn.outline}>
              Read our terms
            </Link>
          </div>
          <p className={`mt-6 ${body}`}>
            Looking for something else? See our{" "}
            <Link href="/privacy" className={link}>
              privacy policy
            </Link>{" "}
            or the{" "}
            <Link href="/faq" className={link}>
              FAQ
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
