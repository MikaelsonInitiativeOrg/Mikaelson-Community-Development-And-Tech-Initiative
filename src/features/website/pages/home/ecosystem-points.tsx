import type { CSSProperties } from "react";
import { ecosystems } from "./ecosystem-data";
import styles from "./ecosystem-points.module.css";

/**
 * The four point cards under each ecosystem tab (the original cards, same
 * look), now touched by the page's turquoise line. Each card is a stop
 * marked `data-branch`: as you scroll, the line drops past it, sends a
 * branch across into the card, and ScrollLine sets `data-reached`. The
 * card then pops up and reveals, in order, its number, what the point
 * means and the explanation. Scrolling back up settles it again. Until
 * the line is live (no JS yet) the cards simply show as they are.
 */

type Eco = (typeof ecosystems)[number];

function PointCard({ eco, index }: { eco: Eco; index: number }) {
  return (
    <article
      data-stop
      data-branch
      className={`${styles.card} relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl border border-[#5CE1E6]/40 bg-[#d0f4f6] p-6 text-[#050a0a] md:min-h-[260px] md:rounded-3xl md:border-[#5CE1E6]/60 md:p-12`}
    >
      {/* glow */}
      <div
        className={`${styles.glow} pointer-events-none absolute top-0 left-0 h-[65%] w-[55%]`}
        style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(92,225,230,0.30) 0%, transparent 70%)" }}
      />
      {/* grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#0097a7 1px, transparent 1px), linear-gradient(90deg, #0097a7 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* big number */}
      <div
        aria-hidden="true"
        className={`${styles.number} pointer-events-none absolute top-4 right-6 leading-none font-black text-[#C9A84C]/40 select-none`}
        style={{ fontSize: "clamp(80px, 10vw, 160px)", letterSpacing: "-0.05em" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="relative z-10 max-w-2xl">
        <p className={`${styles.seq} mb-3 text-xs font-semibold tracking-[0.18em] text-[#0097a7] uppercase`} style={{ "--k": 0 } as CSSProperties}>
          <span className="hidden md:inline">{eco.label} · </span>Point {index + 1} of {eco.bullets.length}
        </p>
        <h4
          className={`${styles.seq} text-[22px] leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[30px]`}
          style={{ "--k": 1 } as CSSProperties}
        >
          {eco.titles[index]}
        </h4>
        <p
          className={`${styles.seq} mt-3 text-[15px] leading-[1.6] text-[#050a0a]/75 md:text-[17px]`}
          style={{ "--k": 2 } as CSSProperties}
        >
          {eco.bullets[index]}
        </p>
      </div>

      {/* bottom accent: fills in from the side the line came from */}
      <div
        className={`${styles.accent} absolute right-0 bottom-0 left-0 h-[3px]`}
        style={{ background: "linear-gradient(90deg, #5CE1E6, #5CE1E6 60%, transparent)" }}
      />
    </article>
  );
}

export function EcosystemBlock({ eco }: { eco: Eco }) {
  return (
    <div className="w-full px-4 md:px-6">
      <div className={`${styles.stage} mx-auto flex w-full max-w-6xl flex-col gap-3 pb-10 md:gap-5 md:pb-0`}>
        {eco.bullets.map((_, i) => (
          <PointCard key={`${eco.id}-${i}`} eco={eco} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function EcosystemSection({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="w-full py-4">
      <EcosystemBlock eco={ecosystems[activeIndex]} />
    </div>
  );
}
