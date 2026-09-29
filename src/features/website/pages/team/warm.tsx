"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInViewOnce } from "@/components/site/motion/use-in-view-once";
import styles from "./warm.module.css";

/** Hand-drawn turquoise underline that draws itself once. */
export function DrawnUnderline({ immediate = false, className = "" }: { immediate?: boolean; className?: string }) {
  const [ref, visible] = useInViewOnce<SVGSVGElement>({ immediate });
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      data-visible={visible || undefined}
      className={`${styles.line} pointer-events-none ${className}`}
    >
      <path
        d="M4 16 C 58 7, 122 5, 182 10 S 268 19, 296 8"
        pathLength={1}
        fill="none"
        stroke="#5CE1E6"
        strokeWidth={5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A photo that settles in like a pinned print. */
export function Print({
  children,
  tilt = 0,
  delay = 0,
  immediate = false,
  className = "",
}: {
  children: ReactNode;
  tilt?: number;
  delay?: number;
  immediate?: boolean;
  className?: string;
}) {
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ immediate });
  return (
    <div
      ref={ref}
      data-visible={visible || undefined}
      className={`${styles.print} ${className}`}
      style={{ "--tilt": `${tilt}deg`, "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
