"use client";

import type { ReactNode } from "react";
import { useInViewOnce } from "@/components/site/motion/use-in-view-once";
import styles from "./drawn-line.module.css";

/**
 * Underlines a phrase with a hand-drawn turquoise stroke, like a teacher's
 * marker. Draws once (900ms, strong ease-in-out) when it scrolls into view.
 * Reduced motion: the line fades in.
 */
export function DrawnUnderline({ children }: { children: ReactNode }) {
  const [ref, visible] = useInViewOnce<HTMLSpanElement>({ margin: "0px 0px -15% 0px" });
  return (
    <span ref={ref} className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
        data-drawn={visible || undefined}
        className={`${styles.line} pointer-events-none absolute -bottom-2 left-0 h-3.5 w-full overflow-visible`}
      >
        <path
          d="M4 13 C 60 5, 130 4, 190 8 C 230 10, 262 12, 296 6"
          pathLength={1}
          fill="none"
          stroke="#5CE1E6"
          strokeWidth={5}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
