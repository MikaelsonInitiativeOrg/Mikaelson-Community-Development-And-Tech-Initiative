"use client";

import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

type TabItem = { id: string; label: string };

/**
 * Research-area tabs with a clipped highlight, used by the library archive
 * and books pages. The active style
 * is a second, aria-hidden copy of the tab row, clipped to the selected
 * tab. Moving the clip changes background and text colour together, since
 * it's one element being revealed rather than several colours being faded.
 *
 * Clicks slide the clip over 250ms with a strong ease-in-out (it's
 * movement on screen). Arrow keys move it instantly: keyboard actions don't animate. Reduced
 * motion also moves it instantly.
 *
 * Tabs get id `tab-<id>` and control `panel-<id>`, matching the pages'
 * tabpanels.
 */
export function ClippedTabs({
  items,
  active,
  onChange,
  ariaLabel,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [clip, setClip] = useState<string | null>(null);
  const [instant, setInstant] = useState(false);
  const activeIndex = Math.max(
    items.findIndex((item) => item.id === active),
    0,
  );

  const measure = useCallback(() => {
    const list = listRef.current;
    const tab = tabRefs.current[activeIndex];
    if (!list || !tab) return;
    // client* (inside the border), matching the overlay's inset-0 box.
    const left = tab.offsetLeft;
    const right = list.clientWidth - (tab.offsetLeft + tab.offsetWidth);
    const top = tab.offsetTop;
    const bottom = list.clientHeight - (tab.offsetTop + tab.offsetHeight);
    setClip(`inset(${top}px ${right}px ${bottom}px ${left}px round 999px)`);
  }, [activeIndex]);

  // Re-measure on resize and when fonts swap in (both change tab widths).
  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [measure]);

  const select = (index: number, viaKeyboard: boolean) => {
    setInstant(viaKeyboard);
    onChange(items[index].id);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight" ? (activeIndex === last ? 0 : activeIndex + 1)
      : event.key === "ArrowLeft" ? (activeIndex === 0 ? last : activeIndex - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
    tabRefs.current[next]?.focus();
  };

  const tabClass = "rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap";

  return (
    <div className="-m-1 mt-5 overflow-x-auto p-1">
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="relative flex w-max gap-1 rounded-full border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-[#0f0f0f]"
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i, false)}
              // Until the clip is measured (before hydration), the real tab
              // carries the active style so the selection is never missing.
              className={`${tabClass} transition-colors duration-150 ease-[ease] focus-visible:outline-2 focus-visible:outline-[#5ce1e6] ${
                isActive && clip === null ? "bg-[#003e45] text-white" : "text-[#555] hover:text-[#003e45] dark:text-white/60 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}

        <div
          aria-hidden="true"
          data-instant={instant || undefined}
          className="pointer-events-none absolute inset-0 flex gap-1 rounded-full bg-[#003e45] p-1 [transition:clip-path_250ms_cubic-bezier(0.77,0,0.175,1)] data-[instant]:[transition:none] motion-reduce:[transition:none]"
          style={clip ? { clipPath: clip } : { visibility: "hidden" }}
        >
          {items.map((item) => (
            <span key={item.id} className={`${tabClass} text-white`}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
