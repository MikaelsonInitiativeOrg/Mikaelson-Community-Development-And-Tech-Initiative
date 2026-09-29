"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { FAQS, faqText } from "@/features/website/pages/faq/questions";
import { HELP_CATEGORIES } from "./topics";
import styles from "./help-search.module.css";

type Entry = { key: string; kind: string; title: string; description: string; href: string; haystack: string };

// Every help topic and every FAQ answer, searched in the browser.
const INDEX: Entry[] = [
  ...HELP_CATEGORIES.flatMap((c) =>
    c.topics.map((t) => ({
      key: `${c.id}-${t.title}`,
      kind: c.title,
      title: t.title,
      description: t.description,
      href: t.href,
      haystack: `${c.title} ${c.description} ${t.title} ${t.description}`.toLowerCase(),
    })),
  ),
  ...FAQS.map((q) => {
    const text = faqText(q);
    return {
      key: `faq-${q.id}`,
      kind: "FAQ",
      title: q.question,
      description: text.length > 140 ? `${text.slice(0, 137).trimEnd()}…` : text,
      href: `/faq#${q.id}`,
      haystack: `${q.question} ${text}`.toLowerCase(),
    };
  }),
];

const SUGGESTIONS = ["Volunteer", "Membership fee", "Labs", "Events"];

/**
 * The hero's search. Filters as you type (every word must match), shows
 * up to eight results under the field and announces the count. Results
 * fade and rise in over 200ms; reduced motion keeps only the fade.
 */
export function HelpSearch() {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const results = words.length ? INDEX.filter((e) => words.every((w) => e.haystack.includes(w))) : [];

  const searching = words.length > 0;

  return (
    <div className="mx-auto mt-10 max-w-[640px] text-left">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={inputId} className="sr-only">
          Search help topics and questions
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-[#0097A7]"
            aria-hidden="true"
          />
          <input
            id={inputId}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search for help topics…"
            aria-describedby={`${inputId}-status`}
            className="min-h-14 w-full rounded-full border border-[#003E45]/20 bg-white py-3 pr-14 pl-13 text-[16px] text-[#111] shadow-[0_1px_2px_rgb(0_62_69/0.06),0_12px_32px_-16px_rgb(0_62_69/0.25)] transition-[border-color] duration-150 ease-[ease] placeholder:text-[#555]/80 focus:border-[#0097A7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] dark:border-white/15 dark:bg-[#0b1414] dark:text-white dark:shadow-none dark:placeholder:text-white/50"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#555] transition-[background-color] duration-150 ease-[ease] hover:bg-[#EEFCFC] focus-visible:outline-2 focus-visible:outline-[#0097A7] dark:text-white/65 dark:hover:bg-white/10"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      <p id={`${inputId}-status`} className="sr-only" aria-live="polite">
        {searching ? `${results.length} ${results.length === 1 ? "result" : "results"}` : ""}
      </p>

      {!searching && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[15px] text-[#555] dark:text-white/65">
          <span>Try</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="min-h-11 cursor-pointer rounded-full border border-[#003E45]/15 px-4 font-medium text-[#003E45] transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#003E45]/40 hover:bg-[#EEFCFC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] active:scale-[0.97] motion-reduce:active:scale-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {searching && (
        <div
          className={`${styles.results} mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_32px_-16px_rgb(0_62_69/0.25)] dark:border-white/10 dark:bg-[#0b1414] dark:shadow-none`}
        >
          {results.length > 0 ? (
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {results.slice(0, 8).map((r) => (
                <li key={r.key}>
                  <Link
                    href={r.href}
                    className="group flex min-h-11 items-start gap-4 px-5 py-4 transition-[background-color] duration-150 ease-[ease] hover:bg-[#EEFCFC] focus-visible:bg-[#EEFCFC] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0097A7] dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-semibold tracking-[0.02em] text-[#0b6b75] uppercase dark:text-[#5CE1E6]">
                        {r.kind}
                      </span>
                      <span className="mt-0.5 block text-[16px] font-semibold text-[#111] dark:text-white">{r.title}</span>
                      <span className="mt-1 block text-[15px] leading-[1.6] text-[#555] dark:text-white/65">
                        {r.description}
                      </span>
                    </span>
                    <ArrowRight
                      className="mt-6 size-4 shrink-0 text-[#003E45] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transition-none dark:text-[#5CE1E6]"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-6 text-center text-[16px] leading-[1.7] text-[#555] dark:text-white/65">
              <p>
                Nothing matches &ldquo;{query.trim()}&rdquo; yet.{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-[#003E45] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] dark:text-[#5CE1E6]"
                >
                  Ask us directly
                </Link>{" "}
                and we&rsquo;ll help.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
