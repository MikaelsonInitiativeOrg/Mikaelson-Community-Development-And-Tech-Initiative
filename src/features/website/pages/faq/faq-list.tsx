"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, Plus } from "lucide-react";
import { ClippedTabs } from "@/components/site/clipped-tabs";
import { FAQS, FAQ_GROUPS, type FaqGroup } from "./questions";
import styles from "./accordion.module.css";

type Tab = FaqGroup | "all";

/**
 * Category tabs over one accordion. Items keep their anchor ids
 * (/faq#membership-fee), so the Help Center's search can link straight to
 * an answer: on load and on hash change, the matching question opens and
 * the tabs go back to "All questions" so it is on screen.
 */
export function FaqList() {
  const [tab, setTab] = useState<Tab>("all");
  const [open, setOpen] = useState<string[]>([FAQS[0].id]);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!FAQS.some((q) => q.id === id)) return;
      setTab("all");
      setOpen((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };
    // After the first paint, so the server markup hydrates as rendered.
    const frame = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  const shown = tab === "all" ? FAQS : FAQS.filter((q) => q.group === tab);

  return (
    <div>
      <div className="flex justify-center">
        <ClippedTabs
          items={FAQ_GROUPS}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
          ariaLabel="Question categories"
        />
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-10 text-left">
        <AccordionPrimitive.Root
          type="multiple"
          value={open}
          onValueChange={setOpen}
          className="border-t border-black/10 dark:border-white/10"
        >
          {shown.map((item) => (
            <AccordionPrimitive.Item
              key={item.id}
              value={item.id}
              id={item.id}
              className="scroll-mt-28 border-b border-black/10 dark:border-white/10"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-4 text-left text-[18px] leading-snug font-semibold text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] sm:text-[19px] dark:text-white">
                  {item.question}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition-[background-color,border-color] duration-150 ease-[ease] group-data-[state=open]:border-[#5CE1E6] group-data-[state=open]:bg-[#5CE1E6] dark:border-white/15">
                    <Plus
                      aria-hidden="true"
                      className="size-4 text-[#003E45] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[state=open]:rotate-45 motion-reduce:transition-none dark:text-white dark:group-data-[state=open]:text-black"
                    />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className={styles.content}>
                <div className="max-w-[62ch] pb-7 text-base leading-[1.7] text-[#555] sm:pr-14 dark:text-white/65">
                  {item.paragraphs.map((p) => (
                    <p key={p} className="mt-3 first:mt-0">
                      {p}
                    </p>
                  ))}
                  {item.list && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {item.list.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-[#0097A7]" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.links && (
                    <ul className="mt-4 flex flex-wrap gap-x-6">
                      {item.links.map((l) => {
                        const isExternal = l.external || l.href.startsWith("http");
                        const linkClass =
                          "inline-flex min-h-11 items-center gap-1.5 font-semibold text-[#003E45] underline decoration-[#003E45]/25 underline-offset-4 transition-[text-decoration-color] duration-150 ease-[ease] hover:decoration-[#003E45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] dark:text-[#5CE1E6] dark:decoration-[#5CE1E6]/30 dark:hover:decoration-[#5CE1E6]";
                        return (
                          <li key={l.href}>
                            {isExternal ? (
                              <a href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                                {l.label}
                                <ArrowRight className="size-4" aria-hidden="true" />
                              </a>
                            ) : (
                              <Link href={l.href} className={linkClass}>
                                {l.label}
                                <ArrowRight className="size-4" aria-hidden="true" />
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </div>
  );
}
