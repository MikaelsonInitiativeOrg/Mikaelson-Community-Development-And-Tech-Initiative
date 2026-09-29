"use client";

import { useLayoutEffect, type CSSProperties, type ReactNode } from "react";
import { useInViewOnce } from "./use-in-view-once";
import styles from "./motion.module.css";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between items. Clamped to the 30–80ms range the skills allow. */
  staggerChildren?: number;
  /** Reveal when scrolled into view rather than on load. */
  onViewport?: boolean;
};

/**
 * Drop-in replacement for @/components/motion/stagger. Children must be
 * <StaggerItem>s. The original defaults to 120ms between items; long gaps
 * read as slow, so this clamps to 30–80ms.
 */
export function StaggerGroup({
  children,
  className = "",
  staggerChildren = 0.05,
  onViewport = false,
}: StaggerGroupProps) {
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ immediate: !onViewport });
  const stagger = Math.min(Math.max(staggerChildren, 0.03), 0.08);

  // Number the items from the DOM: children may come from a server
  // component, where comparing element types isn't reliable. Set once per
  // item (not per frame), so the inherited variable is cheap.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    Array.from(el.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty("--i", String(i));
    });
  });

  return (
    <div
      ref={ref}
      className={`${styles.staggerGroup} ${className}`}
      data-visible={visible || undefined}
      style={{ "--stagger": `${stagger * 1000}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.staggerItem} ${className}`}>{children}</div>;
}
