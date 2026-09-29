import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { ScrollLine } from "@/components/site/scroll-line";
import { Reveal } from "@/components/site/motion/reveal";
import { LegalHero } from "./legal-hero";
import { LegalToc } from "./legal-toc";
import styles from "./legal.module.css";

export type LegalSection = {
  id: string;
  number?: string;
  title: string;
  content: ReactNode;
  /** Let the scroll line loop beside this heading (keep these few). */
  stop?: boolean;
};

type LegalDocumentProps = {
  title: string;
  summary: string;
  updated: string;
  updatedIso: string;
  /** Short "In plain words" points, written only from the text itself. */
  plainWords?: ReactNode[];
  sections: LegalSection[];
  /** Closing block (e.g. related links), rendered after the last section. */
  closing?: ReactNode;
};

/**
 * A legal document page: centred hero, then the text in a readable column
 * with a sticky contents rail beside it on desktop (a compact disclosure
 * above it on smaller screens).
 */
export function LegalDocument({ title, summary, updated, updatedIso, plainWords, sections, closing }: LegalDocumentProps) {
  const toc = sections.map((s) => ({ id: s.id, number: s.number, label: s.title }));

  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>
        <LegalHero title={title} summary={summary} updated={updated} updatedIso={updatedIso} backToHub />

        <div className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 md:pb-32 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
          <aside className="hidden lg:block">
            <LegalToc items={toc} variant="rail" />
          </aside>

          <article className="min-w-0 max-w-[68ch]">
            <div className="lg:hidden">
              <LegalToc items={toc} variant="disclosure" />
            </div>

            {plainWords && plainWords.length > 0 && (
              <Reveal immediate delay={0.12}>
                <aside
                  aria-labelledby="plain-words-heading"
                  className="mt-8 rounded-2xl bg-[#EEFCFC] p-6 sm:p-8 lg:mt-0 dark:bg-[#003E45]/35 dark:ring-1 dark:ring-white/10"
                >
                  <h2 id="plain-words-heading" className="text-[20px] font-bold text-[#003E45] dark:text-white">
                    In plain words
                  </h2>
                  <p className="mt-1 text-[15px] text-[#555] dark:text-white/65">
                    A short guide to help you read what follows.
                  </p>
                  <ul className="mt-5 flex flex-col gap-3 text-[16px] leading-[1.65] text-[#111] dark:text-white/85">
                    {plainWords.map((point, i) => (
                      <li key={i} className="flex gap-3">
                        <Check className="mt-1.5 size-4 shrink-0 text-[#0097A7] dark:text-[#5CE1E6]" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </Reveal>
            )}

            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-heading`}
                className="mt-12 scroll-mt-24 border-t border-black/10 pt-10 dark:border-white/10"
              >
                <h2
                  id={`${s.id}-heading`}
                  data-stop={s.stop ? "" : undefined}
                  className="flex gap-3 text-[24px] leading-tight font-bold tracking-[-0.015em] text-[#003E45] md:text-[28px] dark:text-white"
                >
                  {s.number && (
                    <span className="shrink-0 font-semibold text-[#0097A7] tabular-nums dark:text-[#5CE1E6]">{s.number}.</span>
                  )}
                  <span>{s.title}</span>
                </h2>
                <div className={`${styles.prose} mt-5`}>{s.content}</div>
              </section>
            ))}

            {closing}
          </article>
        </div>
      </ScrollLine>
    </div>
  );
}
