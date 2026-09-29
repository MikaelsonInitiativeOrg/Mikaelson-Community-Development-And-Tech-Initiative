"use client";

import type { ReactNode } from "react";
import { useInViewOnce } from "./use-in-view-once";
import styles from "./motion.module.css";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Use sparingly, e.g. the hero's title → subtext → CTA order. */
  delay?: number;
  /** Animate on load instead of on scroll (above-the-fold content). */
  immediate?: boolean;
};

/**
 * Drop-in replacement for @/components/motion/reveal. Same API, but a CSS
 * transition (off the main thread, so it stays smooth while the page loads)
 * with the strong ease-out curve, and content stays visible without JS.
 */
export function Reveal({ children, className = "", delay = 0, immediate = false }: RevealProps) {
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ immediate });

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-visible={visible || undefined}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
