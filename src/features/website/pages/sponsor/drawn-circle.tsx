import styles from "./drawn-line.module.css";

/**
 * A hand-drawn turquoise loop, like a marker circling something on a
 * noticeboard. Draws with stroke-dashoffset (pathLength 1) over 900ms on
 * the strong ease-in-out when `drawn` turns on; when it turns off it fades
 * in 150ms and the dash resets only after the fade, so it never visibly
 * un-draws. `instant` (keyboard) skips the draw. Reduced motion: fade only.
 */
export function DrawnCircle({ drawn, instant = false }: { drawn: boolean; instant?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 90"
      preserveAspectRatio="none"
      data-drawn={drawn || undefined}
      data-instant={instant || undefined}
      className={`${styles.line} pointer-events-none absolute -top-3 -left-4 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)] overflow-visible`}
    >
      <path
        d="M34 22 C 70 6, 170 4, 214 20 C 244 32, 238 62, 204 74 C 160 88, 70 88, 30 72 C 4 60, 8 34, 40 20 C 62 11, 96 9, 128 9"
        pathLength={1}
        fill="none"
        stroke="#5CE1E6"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
