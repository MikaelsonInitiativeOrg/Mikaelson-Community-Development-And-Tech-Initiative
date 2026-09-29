"use client";

import { useInViewOnce } from "@/components/site/motion/use-in-view-once";
import styles from "./blog.module.css";

const PATHS = {
  // A loose hand-drawn underline, like a teacher's marker.
  underline: "M4 18 C 60 8, 120 22, 180 13 S 290 6, 356 15",
  // A short path with a gentle turn, used as a divider.
  path: "M4 20 C 40 4, 80 30, 120 16 S 190 6, 236 18",
};

/**
 * The turquoise hand-drawn line. Draws itself once (stroke-dashoffset,
 * 900ms, strong ease-in-out) when it scrolls into view; visible without JS;
 * under reduced motion it just fades in.
 */
export function DrawnLine({
  variant = "underline",
  className = "",
  immediate = false,
}: {
  variant?: keyof typeof PATHS;
  className?: string;
  immediate?: boolean;
}) {
  const [ref, visible] = useInViewOnce<SVGSVGElement>({ immediate });
  const width = variant === "underline" ? 360 : 240;
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${width} 30`}
      fill="none"
      preserveAspectRatio="none"
      data-visible={visible || undefined}
      className={`${styles.drawn} ${className}`}
    >
      <path d={PATHS[variant]} pathLength={1} stroke="#5ce1e6" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
