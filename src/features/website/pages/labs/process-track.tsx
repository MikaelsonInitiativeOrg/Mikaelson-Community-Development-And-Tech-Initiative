"use client";

import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { useInViewOnce } from "@/components/site/motion/use-in-view-once";
import styles from "./process.module.css";
import { container } from "./ui";

// Copy from the original labs-innovation-process.tsx. This is a real
// sequence, so it keeps its numbers.
const STEPS = [
  {
    number: "01",
    title: "Research & Discovery",
    description:
      "We engage with communities to understand their unique challenges and identify opportunities for technological intervention.",
  },
  {
    number: "02",
    title: "Design & Prototype",
    description:
      "Our team designs user-centered solutions and builds functional prototypes for testing and validation.",
  },
  {
    number: "03",
    title: "Test & Iterate",
    description:
      "We conduct extensive testing with real users, gathering feedback and refining our solutions for optimal performance.",
  },
  {
    number: "04",
    title: "Deploy & Scale",
    description: "Successful solutions are deployed across communities and scaled to maximize their positive impact.",
  },
];

export function ProcessTrack() {
  const [ref, visible] = useInViewOnce<HTMLOListElement>({ margin: "0px 0px -25% 0px" });

  return (
    <section className="bg-white py-20 dark:bg-[#0B1213] sm:py-24 lg:py-32">
      <div className={container}>
        <div className="max-w-2xl">
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#111] dark:text-white sm:text-[40px]">
            Our innovation process
          </h2>
          <p className="mt-4 max-w-[56ch] text-base leading-[1.65] text-[#555] dark:text-white/60 sm:text-[17px]">
            From idea to implementation, we follow a structured approach to ensure our solutions create meaningful
            impact.
          </p>
        </div>

        <ol
          ref={ref}
          data-visible={visible || undefined}
          className={`${styles.track} mt-14 grid gap-10 md:grid-cols-4 md:gap-8 lg:mt-20`}
        >
          {STEPS.map((step, i) => (
            <li
              key={step.number}
              className={`${styles.step} grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-5 md:block`}
              style={{ "--i": i } as CSSProperties}
            >
              <span aria-hidden className={styles.square}>
                <Check className={`${styles.check} size-4`} strokeWidth={2.5} />
              </span>
              {i < STEPS.length - 1 ? <span aria-hidden className={styles.segment} /> : null}
              <div className="md:mt-6">
                <p className="text-[13px] font-semibold text-[#003E45] dark:text-[#5CE1E6]">Step {step.number}</p>
                <h3 className="mt-1 text-[19px] font-semibold leading-snug text-[#111] dark:text-white sm:text-[22px]">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-[1.65] text-[#555] dark:text-white/60">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
