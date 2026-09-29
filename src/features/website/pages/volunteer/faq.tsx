"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import styles from "./faq.module.css";

// Copy from src/features/website/components/volunteer/volunteer-faq.tsx.
export const QUESTIONS = [
  {
    question: "How much time do I need to commit?",
    answer:
      "Most volunteer roles require 3-10 hours per week, depending on your availability and the project needs. We work with your schedule.",
  },
  {
    question: "Is this opportunity remote?",
    answer:
      "Yes! Most of our volunteer opportunities are remote-friendly. Some projects may have optional in-person events or meetups.",
  },
  {
    question: "Do I need specific qualifications?",
    answer:
      "We welcome volunteers from all backgrounds! What matters most is your passion, commitment, and willingness to learn.",
  },
  {
    question: "Will I receive any certification?",
    answer:
      "Yes, we provide volunteer certificates and recognition letters that you can use for your professional portfolio.",
  },
  {
    question: "Can I volunteer while working full-time?",
    answer:
      "Absolutely! Many of our volunteers balance this with their full-time jobs. We offer flexible scheduling and various commitment levels.",
  },
];

/**
 * A plain list with hairlines instead of boxed cards. Opening is an
 * occasional action: height + opacity, 200ms in and 150ms out (height has
 * no transform equivalent here). The plus turns into a cross.
 */
export function VolunteerFaq() {
  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={["q-0"]}
      className="border-t border-black/10 dark:border-white/10"
    >
      {QUESTIONS.map((item, i) => (
        <AccordionPrimitive.Item key={item.question} value={`q-${i}`} className="border-b border-black/10 dark:border-white/10">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-4 text-left text-[18px] leading-snug font-semibold text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] sm:text-[19px] dark:text-white">
              {item.question}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition-[background-color,border-color] duration-150 ease-[ease] group-data-[state=open]:border-[#5CE1E6] group-data-[state=open]:bg-[#5CE1E6] dark:border-white/15">
                <Plus
                  aria-hidden="true"
                  className="size-4 text-[#003E45] transition-transform duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] group-data-[state=open]:rotate-45 motion-reduce:transition-none dark:text-white dark:group-data-[state=open]:text-black"
                />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className={styles.content}>
            <p className="max-w-[62ch] pr-14 pb-6 text-base leading-[1.65] text-[#555] dark:text-white/65">{item.answer}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
