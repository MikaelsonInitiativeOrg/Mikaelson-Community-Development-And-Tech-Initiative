import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { focusRing } from "./documents";

export type LegalLink = { title: string; text?: string; href: string; cta: string };

/** The "Questions?" block at the end of a document: a quiet list of next steps. */
export function LegalLinks({ heading, intro, links }: { heading: string; intro: string; links: LegalLink[] }) {
  return (
    <section aria-labelledby="legal-links-heading" className="mt-16 rounded-2xl bg-[#E8F7F8] p-6 sm:p-8 dark:bg-white/5">
      <h2
        id="legal-links-heading"
        data-stop
        className="text-[24px] leading-tight font-bold tracking-[-0.015em] text-[#003E45] md:text-[28px] dark:text-white"
      >
        {heading}
      </h2>
      <p className="mt-2 text-[17px] leading-[1.7] text-[#555] dark:text-white/65">{intro}</p>
      <ul className="mt-6 border-t border-[#003E45]/10 dark:border-white/10">
        {links.map((l) => {
          const external = !l.href.startsWith("/");
          const className = `${focusRing} group flex min-h-11 items-center justify-between gap-4 rounded-md py-4`;
          const inner = (
            <>
              <span>
                <span className="block text-[17px] font-semibold text-[#111] dark:text-white">{l.title}</span>
                {l.text && <span className="mt-0.5 block text-[15px] text-[#555] dark:text-white/65">{l.text}</span>}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-[#003E45] dark:text-[#5CE1E6]">
                {l.cta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
            </>
          );
          return (
            <li key={l.title} className="border-b border-[#003E45]/10 dark:border-white/10">
              {external ? (
                <a href={l.href} className={className}>
                  {inner}
                </a>
              ) : (
                <Link href={l.href} className={className}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
