import type { CSSProperties } from "react";
import styles from "./hero-art.module.css";

/**
 * The home hero's art: Uli, the Igbo (Nigeria) tradition of flowing line
 * painting, drawn in code in the brand turquoise on a white hero. Fine
 * spirals, crescents and curves sit around the edges, each with the dot
 * clusters Uli loves, and draw themselves in one after another on load.
 * Inspired by the tradition, not a copy of any work. Reduced motion shows
 * them finished. Decorative.
 *
 * (Eight other directions were explored in the redesign and dropped: see
 * docs/REDESIGN.md.)
 */

const TURQ = "#5CE1E6";

/* ----------------------------------------------------------------- Uli */

function spiral(turns: number, r: number) {
  let d = "";
  const steps = turns * 28;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * turns * Math.PI * 2;
    const rr = (i / steps) * r;
    d += `${i ? "L" : "M"}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)} `;
  }
  return d;
}

const ULI_MOTIFS: { d: string; x: string; y: string; s: number; rot: number }[] = [
  { d: spiral(3, 40), x: "8%", y: "18%", s: 1.2, rot: 0 },
  { d: "M-60 0 C-30 -40 30 40 60 0", x: "20%", y: "80%", s: 1.4, rot: -10 },
  { d: "M0 -40 A40 40 0 1 0 0 40 A28 28 0 1 1 0 -40", x: "90%", y: "22%", s: 1, rot: 20 },
  { d: spiral(2.5, 32), x: "86%", y: "76%", s: 1.3, rot: 90 },
  { d: "M-40 30 L0 -34 L40 30 M-24 30 L0 -8 L24 30", x: "7%", y: "55%", s: 1, rot: 0 },
  { d: "M-50 0 C-50 -30 -10 -30 -10 0 C-10 30 30 30 30 0 C30 -18 50 -18 50 0", x: "94%", y: "50%", s: 1, rot: 90 },
  { d: "M-30 -30 C0 -10 0 10 -30 30 M0 -30 C30 -10 30 10 0 30", x: "30%", y: "10%", s: 0.9, rot: 90 },
  { d: "M-30 -30 C0 -10 0 10 -30 30 M0 -30 C30 -10 30 10 0 30", x: "70%", y: "90%", s: 0.9, rot: 90 },
];

export function HeroArt() {
  return (
    <svg aria-hidden="true" className={styles.fill}>
      {ULI_MOTIFS.map((m, i) => (
        <svg key={i} x={m.x} y={m.y} overflow="visible">
          <g transform={`rotate(${m.rot}) scale(${m.s})`}>
            <path
              d={m.d}
              pathLength={1}
              fill="none"
              stroke={TURQ}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.drawIn}
              style={{ "--i": i } as CSSProperties}
            />
          </g>
          {/* Uli loves dots beside its lines */}
          <g className={styles.fadeIn} style={{ "--i": i } as CSSProperties}>
            <circle cx={58 * m.s} cy={-10} r="3" fill={TURQ} />
            <circle cx={70 * m.s} cy={4} r="3" fill={TURQ} />
            <circle cx={58 * m.s} cy={18} r="3" fill={TURQ} />
          </g>
        </svg>
      ))}
    </svg>
  );
}

