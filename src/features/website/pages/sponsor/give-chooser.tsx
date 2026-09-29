"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Handshake, Presentation } from "lucide-react";
import { useInViewOnce } from "@/components/site/motion/use-in-view-once";
import { GIVE_OPTIONS, PARTNER_EMAIL, type GiveOption } from "./data";
import { DrawnCircle } from "./drawn-circle";
import { GiveButton } from "./give-dialog";
import { btn } from "./styles";

// A slight, fixed tilt per card, like cards pinned to a board.
const TILT = ["-1.5deg", "1deg", "-0.75deg"];

// Icons, not pictures: money to sponsor a student, a workshop, a handshake.
const ICONS = { money: Banknote, workshop: Presentation, partner: Handshake } as const;

/**
 * "What your support makes possible": each way to give is an icon and what
 * it changes for someone. Choosing one circles its name with a
 * hand-drawn turquoise line (900ms, once per choice); the chosen option's
 * details and button sit underneath. Arrow keys switch instantly.
 */
export function GiveChooser() {
  const [activeId, setActiveId] = useState<GiveOption["id"]>("student");
  const [instant, setInstant] = useState(false);
  // Once someone has chosen, the cards are plainly on screen: draw without waiting for the observer.
  const [chosen, setChosen] = useState(false);
  // The first circle waits until the cards are on screen, so it's seen drawing.
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ margin: "0px 0px -25% 0px" });
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = GIVE_OPTIONS.findIndex((o) => o.id === activeId);
  const active = GIVE_OPTIONS[activeIndex];

  const choose = (index: number, viaKeyboard: boolean) => {
    setInstant(viaKeyboard);
    setChosen(true);
    setActiveId(GIVE_OPTIONS[index].id);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const last = GIVE_OPTIONS.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? activeIndex === last ? 0 : activeIndex + 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? activeIndex === 0 ? last : activeIndex - 1
          : event.key === "Home" ? 0
            : event.key === "End" ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    choose(next, true);
    radios.current[next]?.focus();
  };

  return (
    <div ref={ref}>
      <div
        role="radiogroup"
        aria-label="Ways to give"
        onKeyDown={onKeyDown}
        className="grid gap-10 md:grid-cols-3 md:gap-8"
      >
        {GIVE_OPTIONS.map((option, i) => {
          const checked = option.id === activeId;
          return (
            <button
              key={option.id}
              ref={(el) => {
                radios.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-controls="give-chosen"
              tabIndex={checked ? 0 : -1}
              onClick={() => choose(i, false)}
              className="group flex cursor-pointer flex-col rounded-3xl p-2 text-left transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0097A7]"
            >
              <span
                className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl ring-1 transition-[box-shadow,background-color] duration-200 ease-[ease] ${
                  checked
                    ? "bg-[#E8F7F8] shadow-[0_18px_40px_-18px_rgb(0_62_69/0.45)] ring-[#003E45]/20 dark:bg-[#5CE1E6]/10"
                    : "bg-white ring-black/5 dark:bg-white/5 dark:ring-white/10"
                }`}
                style={{ transform: `rotate(${TILT[i]})` }}
              >
                {(() => {
                  const Icon = ICONS[option.icon];
                  return (
                    <span className="flex size-24 items-center justify-center rounded-full bg-[#003E45] text-[#5CE1E6] md:size-28 dark:bg-[#5CE1E6] dark:text-[#003E45]">
                      <Icon aria-hidden="true" className="size-11 md:size-12" strokeWidth={1.75} />
                    </span>
                  );
                })()}
              </span>
              <span className="mt-7 px-2">
                <span className="relative inline-block">
                  <span className="relative z-10 text-[22px] leading-tight font-bold tracking-[-0.01em] text-[#003E45] dark:text-white">
                    {option.title}
                  </span>
                  <DrawnCircle drawn={checked && (visible || chosen)} instant={instant} />
                </span>
              </span>
              <span className="mt-4 block px-2 text-base leading-[1.7] text-[#555] dark:text-white/65">
                {option.outcome}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="give-chosen"
        aria-live="polite"
        className="mt-14 rounded-2xl border border-[#003E45]/10 bg-white p-6 sm:p-8 md:mt-16 dark:border-white/10 dark:bg-white/[0.04]"
      >
        <div
          key={active.id}
          className="grid gap-6 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10"
        >
          <div>
            <p className="text-[13px] font-semibold text-[#0b6b75] dark:text-[#5CE1E6]">You&rsquo;ve chosen</p>
            <h3 className="mt-1 text-[22px] leading-tight font-bold text-[#111] dark:text-white">{active.title}</h3>
            <p className="mt-3 max-w-[65ch] text-base leading-[1.7] text-[#555] dark:text-white/65">
              {active.description}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            {active.action.kind === "give" ? (
              <>
                <GiveButton as="any" className={btn.primary}>
                  {active.action.label}
                </GiveButton>
                <span className="text-[15px] text-[#555] dark:text-white/60">By Paystack or bank transfer</span>
              </>
            ) : (
              <>
                <Link href={active.action.href} className={btn.dark}>
                  {active.action.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href={`mailto:${PARTNER_EMAIL}`}
                  className="text-[15px] break-all text-[#003E45] underline underline-offset-2 dark:text-[#5CE1E6]"
                >
                  {PARTNER_EMAIL}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-[15px] leading-relaxed text-[#555] dark:text-white/60">
        Not sure which fits? Write to us and we&rsquo;ll work it out together.{" "}
        <Link
          href="/contact"
          className="font-semibold text-[#003E45] underline underline-offset-2 dark:text-[#5CE1E6]"
        >
          Contact us
        </Link>
      </p>
    </div>
  );
}
