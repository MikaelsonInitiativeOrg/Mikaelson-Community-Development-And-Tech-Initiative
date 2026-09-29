"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has scrolled into view, then never false again —
 * reveals fire once and don't re-animate on every scroll-by.
 * `immediate` skips the observer and flips on the next frame (hero content
 * that should animate on load, not on scroll).
 */
export function useInViewOnce<T extends Element>({
  immediate = false,
  margin = "0px 0px -80px 0px",
}: { immediate?: boolean; margin?: string } = {}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, margin]);

  return [ref, visible] as const;
}
