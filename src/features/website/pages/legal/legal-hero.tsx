import Link from "next/link";
import { Reveal } from "@/components/site/motion/reveal";
import { focusRing } from "./documents";

type LegalHeroProps = {
  title: string;
  summary: string;
  updated?: string;
  updatedIso?: string;
  /** Show the small "Legal" link back to the hub. */
  backToHub?: boolean;
};

/**
 * Centred, quiet hero: title, one plain sentence, the date. No pictures.
 * The h1 is inline-block so the scroll line's lane is set by the document
 * column below, not by the hero's full width.
 */
export function LegalHero({ title, summary, updated, updatedIso, backToHub = false }: LegalHeroProps) {
  return (
    <section className="mx-auto max-w-[900px] px-4 pt-14 pb-12 text-center sm:px-6 md:pt-20 md:pb-16">
      {backToHub && (
        <Reveal immediate>
          <Link
            href="/legal"
            className={`inline-flex min-h-11 items-center rounded-full px-3 text-[14px] font-semibold text-[#0b6b75] underline decoration-[#5CE1E6] decoration-2 underline-offset-4 dark:text-[#5CE1E6] ${focusRing}`}
          >
            Legal
          </Link>
        </Reveal>
      )}
      <Reveal immediate delay={backToHub ? 0.04 : 0}>
        <h1
          data-stop
          className="mt-2 inline-block text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white"
        >
          {title}
        </h1>
      </Reveal>
      <Reveal immediate delay={0.08}>
        <p className="mx-auto mt-6 max-w-[54ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">{summary}</p>
        {updated && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#EEFCFC] px-4 py-2 text-[14px] text-[#003E45] dark:bg-white/5 dark:text-white/75">
            <span className="font-semibold">Last updated</span>
            <time dateTime={updatedIso}>{updated}</time>
          </p>
        )}
      </Reveal>
    </section>
  );
}
