"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { focusRing } from "./documents";

export type TocItem = { id: string; number?: string; label: string };

// The band (below the sticky header, top ~40% of the screen) a section's
// heading has to cross to become the current one.
const HEADER = 96;
const BAND = 0.4;

/**
 * Which section is being read. An IntersectionObserver wakes up whenever a
 * section crosses the reading band; the current one is then the last
 * section whose top is above the band's bottom edge.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const pick = () => {
      const line = window.innerHeight * BAND;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      if (atEnd && els[els.length - 1].getBoundingClientRect().top < window.innerHeight) current = els[els.length - 1].id;
      setActive(current);
    };
    const io = new IntersectionObserver(pick, {
      rootMargin: `-${HEADER}px 0px -${Math.round((1 - BAND) * 100)}% 0px`,
      threshold: [0, 1],
    });
    els.forEach((el) => io.observe(el));
    pick();
    return () => io.disconnect();
  }, [ids]);

  return [active, setActive] as const;
}

const BAR = 20; // the marker's layout height; it is scaled to fit the item

/**
 * The document's contents. `rail` is the sticky list beside the text on
 * desktop, with a turquoise bar that slides to the current section
 * (transform only). `disclosure` is the compact "On this page" toggle
 * shown above the text on smaller screens.
 */
export function LegalToc({ items, variant }: { items: TocItem[]; variant: "rail" | "disclosure" }) {
  const [ids] = useState(() => items.map((i) => i.id));
  const [active, setActive] = useActiveSection(ids);
  const listRef = useRef<HTMLOListElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [bar, setBar] = useState<{ y: number; h: number } | null>(null);

  // Move the marker to the current item; keep that item in view if the
  // rail itself scrolls (short screens).
  useLayoutEffect(() => {
    if (variant !== "rail") return;
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const link = list.querySelector<HTMLElement>(`[data-toc="${active}"]`);
      if (!link) return;
      setBar({ y: link.offsetTop, h: link.offsetHeight });
      const nav = navRef.current;
      if (nav && nav.scrollHeight > nav.clientHeight) {
        const top = link.offsetTop + list.offsetTop;
        if (top < nav.scrollTop) nav.scrollTop = top - 8;
        else if (top + link.offsetHeight > nav.scrollTop + nav.clientHeight)
          nav.scrollTop = top + link.offsetHeight - nav.clientHeight + 8;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active, variant]);

  const link = (item: TocItem, className: string) => {
    const current = item.id === active;
    return (
      <a
        href={`#${item.id}`}
        data-toc={item.id}
        aria-current={current ? "location" : undefined}
        onClick={() => {
          setActive(item.id);
          if (detailsRef.current) detailsRef.current.open = false;
        }}
        className={`${className} ${focusRing} flex min-h-11 items-start gap-2.5 rounded-md text-[14.5px] leading-snug transition-colors duration-150 ease-[ease] ${
          current
            ? "font-semibold text-[#003E45] dark:text-white"
            : "text-[#555] hover:text-[#003E45] dark:text-white/65 dark:hover:text-white"
        }`}
      >
        {item.number && (
          <span className={`w-6 shrink-0 tabular-nums ${current ? "text-[#0097A7] dark:text-[#5CE1E6]" : ""}`}>
            {item.number}
          </span>
        )}
        <span>{item.label}</span>
      </a>
    );
  };

  if (variant === "disclosure") {
    return (
      <details
        ref={detailsRef}
        className="group rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0b1414]"
      >
        <summary
          className={`flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 text-[15px] font-semibold text-[#003E45] dark:text-white [&::-webkit-details-marker]:hidden ${focusRing}`}
        >
          On this page
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <nav aria-label="On this page" className="border-t border-black/10 px-3 py-2 dark:border-white/10">
          <ol>
            {items.map((item) => (
              <li key={item.id}>{link(item, "px-2 py-2.5")}</li>
            ))}
          </ol>
        </nav>
      </details>
    );
  }

  return (
    <nav
      ref={navRef}
      aria-label="On this page"
      className="sticky top-28 max-h-[calc(100vh-8.5rem)] overflow-y-auto overscroll-contain pr-2 pb-4"
    >
      <p className="text-[13px] font-semibold tracking-[0.06em] text-[#0b6b75] uppercase dark:text-[#5CE1E6]">
        On this page
      </p>
      <ol ref={listRef} className="relative mt-4 border-l border-black/10 dark:border-white/10">
        <span
          aria-hidden="true"
          className="absolute top-0 -left-px w-[3px] origin-top rounded-full bg-[#5CE1E6] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{
            height: BAR,
            opacity: bar ? 1 : 0,
            transform: bar ? `translateY(${bar.y}px) scaleY(${bar.h / BAR})` : undefined,
          }}
        />
        {items.map((item) => (
          <li key={item.id}>{link(item, "py-2 pr-2 pl-4")}</li>
        ))}
      </ol>
    </nav>
  );
}
