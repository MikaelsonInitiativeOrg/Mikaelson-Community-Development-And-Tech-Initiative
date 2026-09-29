"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The redesign's signature: one hand-drawn turquoise line that "drops" down
 * the page's left lane as you scroll, and undraws as you scroll back up.
 * It ties a small cursive loop beside each heading it passes and ends in an
 * underline under the last one.
 *
 * Stops are the elements marked `data-stop` inside the wrapper; if there are
 * none, every visible h1/h2 is used. The path is built from layout
 * positions (offsetLeft/offsetTop, never getBoundingClientRect) and rebuilt
 * when the page's size changes. Drawing is tied to scroll position: the tip
 * sits a little below the middle of the screen. Updates are rAF-throttled
 * and write the dash offset straight to the path (no React render per
 * frame). Reduced motion: the whole line is shown, still. Decorative and
 * aria-hidden.
 *
 * Stops also marked `data-branch` (e.g. cards) get touched: when the line
 * passes one, a short branch draws across from the lane to its edge and
 * the element gets `data-reached`, so its own CSS can pop it in; the last
 * one reached also gets `data-current`. Scrolling back up removes them. The wrapper gets `data-line-ready` once the
 * line is live, so "waiting" styles never apply without JavaScript.
 *
 * A group marked `data-wrap` with children marked `data-wrap-item` gets
 * wrapped: when the line reaches the group, it leaves the lane and runs
 * around each item in turn (a timed sequence, WRAP_SEG ms per item), and
 * the group gets `data-reached` so its CSS can bring each item forward as
 * the line finishes circling it (use `--i` and the same timing).
 *
 * Elements marked `data-circle` (e.g. team cards) get a hand-drawn loop
 * around them, scroll-linked and one at a time: within a row the tip
 * reaches them left to right. Circled ones get `data-reached`; the most
 * recent gets `data-current` so it can come forward.
 *
 * A section marked `data-line-ink="#hex"` (e.g. a turquoise hero, where a
 * turquoise line would vanish) gets the line in that colour instead.
 */

type Stop = { x: number; y: number; top: number; bottom: number; underline: number; el: HTMLElement };
type Branch = { d: string; y: number; el: HTMLElement };
type Wrap = { el: HTMLElement; y: number; segs: string[] };
type Circle = { el: HTMLElement; y: number; d: string };

/** A rounded rectangle, clockwise, starting and ending at its top-left
 * corner's end of the top edge. */
function roundRect(x0: number, y0: number, x1: number, y1: number, r: number) {
  return (
    ` H ${f(x1 - r)} Q ${f(x1)} ${f(y0)} ${f(x1)} ${f(y0 + r)} V ${f(y1 - r)} Q ${f(x1)} ${f(y1)} ${f(x1 - r)} ${f(y1)}` +
    ` H ${f(x0 + r)} Q ${f(x0)} ${f(y1)} ${f(x0)} ${f(y1 - r)} V ${f(y0 + r)} Q ${f(x0)} ${f(y0)} ${f(x0 + r)} ${f(y0)}`
  );
}

const TIP = 0.62;
/** ms for the line to reach and circle one wrapped item. */
export const WRAP_SEG = 800; // where the drawn tip sits, as a fraction of the viewport height
const f = (n: number) => n.toFixed(1);

function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let l = 0;
  let t = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    l += node.offsetLeft;
    t += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { l, t };
}

/** A gentle wobbly run down the lane from y0 to y1. */
function run(x: number, y0: number, y1: number, amp: number, flip: number) {
  if (y1 <= y0) return "";
  const pieces = Math.max(1, Math.round((y1 - y0) / 420));
  const step = (y1 - y0) / pieces;
  let d = "";
  for (let j = 0; j < pieces; j++) {
    const a = y0 + j * step;
    const s = (j + flip) % 2 === 0 ? 1 : -1;
    d += ` C ${f(x + amp * s)} ${f(a + step / 3)}, ${f(x - amp * s)} ${f(a + (2 * step) / 3)}, ${f(x)} ${f(a + step)}`;
  }
  return d;
}

function buildPath(stops: Stop[], lane: number, wide: boolean) {
  const amp = wide ? 16 : 7;
  const r = wide ? 12 : 7;
  let cy = stops[0].top + 24;
  let d = `M ${f(lane)} ${f(cy)}`;
  for (let i = 1; i < stops.length; i++) {
    const s = stops[i];
    if (i < stops.length - 1) {
      d += run(lane, cy, s.y - r, amp, i);
      d += ` C ${f(lane + 1.45 * r)} ${f(s.y - r)}, ${f(lane + 1.45 * r)} ${f(s.y + r)}, ${f(lane)} ${f(s.y + r)}`;
      d += ` C ${f(lane - 1.45 * r)} ${f(s.y + r)}, ${f(lane - 1.3 * r)} ${f(s.y - 1.1 * r)}, ${f(lane + 0.2 * r)} ${f(s.y - 1.05 * r)}`;
      cy = s.y - 1.05 * r;
    } else {
      const uy = s.bottom + (wide ? 10 : 8);
      d += run(lane, cy, uy - 34, amp, i);
      d += ` C ${f(lane)} ${f(uy - 8)}, ${f(lane + 8)} ${f(uy + 2)}, ${f(s.x + 6)} ${f(uy)}`;
      const end = s.x + s.underline;
      const mid = s.x + s.underline * 0.55;
      d += ` C ${f(s.x + s.underline * 0.25)} ${f(uy - 3)}, ${f(mid - 20)} ${f(uy - 4)}, ${f(mid)} ${f(uy - 1)}`;
      d += ` C ${f(mid + 30)} ${f(uy + 2)}, ${f(end - 30)} ${f(uy + 3)}, ${f(end)} ${f(uy - 4)}`;
    }
  }
  return d;
}

function visible(el: HTMLElement) {
  if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;
  if (el.closest("[inert], [hidden], [aria-hidden='true'], dialog, [role='dialog']")) return false;
  return true;
}

export function ScrollLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const samples = useRef<{ len: number; y: number }[]>([]);
  const total = useRef(0);
  const branchRefs = useRef<(SVGPathElement | null)[]>([]);
  const touch = useRef<{ y: number; el: HTMLElement }[]>([]);
  const wrapRefs = useRef<(SVGPathElement | null)[][]>([]);
  const wrapState = useRef<boolean[]>([]);
  const circleRefs = useRef<(SVGPathElement | null)[]>([]);
  const circleState = useRef<boolean[]>([]);
  type Ink = { from: number; to: number; color: string };
  const [geo, setGeo] = useState<{
    w: number;
    h: number;
    d: string;
    branches: Branch[];
    inks: Ink[];
    wraps: Wrap[];
    circles: Circle[];
  } | null>(null);
  const reduce = useReducedMotion() ?? false;

  // Build the path from the stops' layout, and rebuild when sizes change
  // (fonts, images and lazy sections all move headings).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let frame = 0;
    const build = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marked = Array.from(wrap.querySelectorAll<HTMLElement>("[data-stop]"));
        const pool = marked.length ? marked : Array.from(wrap.querySelectorAll<HTMLElement>("h1, h2"));
        const els = pool.filter(visible);
        if (els.length < 2) {
          setGeo(null);
          return;
        }
        const wide = wrap.clientWidth >= 1024;
        const stops = els
          .map((el) => {
            const { l, t } = offsetWithin(el, wrap);
            const u = el.querySelector<HTMLElement>("[data-underline]");
            return {
              x: l,
              y: t + Math.min(el.offsetHeight / 2, 28),
              top: t,
              bottom: t + el.offsetHeight,
              underline: Math.min(u ? u.offsetWidth : el.offsetWidth, 320),
              el,
            };
          })
          .sort((a, b) => a.top - b.top);
        const minX = Math.min(...stops.map((s) => s.x));
        const lane = Math.max(6, minX - (wide ? 52 : 14));
        // Branches: from the lane straight across to the element's edge.
        const branches: Branch[] = stops
          .filter((s) => s.el.hasAttribute("data-branch"))
          .map((s) => ({
            y: s.y,
            el: s.el,
            d: `M ${f(lane)} ${f(s.y)} C ${f(lane + 24)} ${f(s.y - 6)}, ${f(s.x - 24)} ${f(s.y + 4)}, ${f(s.x + 14)} ${f(s.y)}`,
          }));
        touch.current = stops.map((s) => ({ y: s.y, el: s.el }));
        const inks = Array.from(wrap.querySelectorAll<HTMLElement>("[data-line-ink]")).map((el) => {
          const { t } = offsetWithin(el, wrap);
          return { from: t, to: t + el.offsetHeight, color: el.dataset.lineInk || "#5CE1E6" };
        });
        // Wraps: from the lane, around each item in turn.
        const o = 12;
        const r = 22;
        const wraps: Wrap[] = Array.from(wrap.querySelectorAll<HTMLElement>("[data-wrap]"))
          .filter(visible)
          .map((group) => {
            const items = Array.from(group.querySelectorAll<HTMLElement>("[data-wrap-item]"))
              .filter(visible)
              .map((el) => {
                const { l, t } = offsetWithin(el, wrap);
                return { x0: l - o, y0: t - o, x1: l + el.offsetWidth + o, y1: t + el.offsetHeight + o };
              })
              .sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
            if (!items.length) return null;
            const startY = Math.min(...items.map((b) => b.y0)) - 36;
            const segs = items.map((b, i) => {
              const tx = b.x0 + r;
              let d: string;
              if (i === 0) {
                d = `M ${f(lane)} ${f(startY)} C ${f(lane)} ${f(b.y0 - 6)}, ${f(tx - 40)} ${f(b.y0)}, ${f(tx)} ${f(b.y0)}`;
              } else {
                const p = items[i - 1];
                const sx = p.x0 + r;
                const sy = p.y0;
                d =
                  sy === b.y0
                    ? `M ${f(sx)} ${f(sy)} C ${f(sx + 60)} ${f(sy - 22)}, ${f(tx - 60)} ${f(b.y0 - 22)}, ${f(tx)} ${f(b.y0)}`
                    : `M ${f(sx)} ${f(sy)} C ${f(p.x0 - 18)} ${f(sy + 40)}, ${f(b.x0 - 18)} ${f(b.y0 - 40)}, ${f(tx)} ${f(b.y0)}`;
              }
              return d + roundRect(b.x0, b.y0, b.x1, b.y1, r);
            });
            return { el: group, y: startY, segs };
          })
          .filter((w): w is Wrap => w !== null);
        // Circles: a loop around each marked element, reached left to right
        // within its row as the tip moves down through the row.
        const boxes = Array.from(wrap.querySelectorAll<HTMLElement>("[data-circle]"))
          .filter(visible)
          .map((el) => {
            const { l, t } = offsetWithin(el, wrap);
            return { el, l, t, w: el.offsetWidth, h: el.offsetHeight };
          });
        const rows = new Map<number, typeof boxes>();
        boxes.forEach((b) => rows.set(Math.round(b.t), [...(rows.get(Math.round(b.t)) || []), b]));
        const co = 9;
        const cr = 18;
        const circles: Circle[] = [];
        [...rows.entries()]
          .sort((a, b) => a[0] - b[0])
          .forEach(([, row]) => {
            row.sort((a, b) => a.l - b.l);
            row.forEach((b, col) => {
              const x0 = b.l - co;
              const y0 = b.t - co;
              const x1 = b.l + b.w + co;
              const y1 = b.t + b.h + co;
              circles.push({
                el: b.el,
                y: b.t + b.h * (0.1 + (0.75 * col) / Math.max(1, row.length)),
                // around once, then a little past the start, like a pen loop
                d: `M ${f(x0 + cr)} ${f(y0)}` + roundRect(x0, y0, x1, y1, cr) + ` H ${f(x0 + cr + 40)}`,
              });
            });
          });
        const next = {
          circles,
          w: wrap.clientWidth,
          h: wrap.clientHeight,
          d: buildPath(stops, lane, wide),
          branches,
          inks,
          wraps,
        };
        // Unchanged layout keeps the same object, so our own re-render (which
        // the MutationObserver also sees) never loops.
        setGeo((prev) =>
          prev &&
          prev.w === next.w &&
          prev.h === next.h &&
          prev.d === next.d &&
          prev.circles.length === next.circles.length &&
          prev.circles.every((c, i) => c.el === next.circles[i].el && c.d === next.circles[i].d) &&
          prev.wraps.length === next.wraps.length &&
          prev.wraps.every((w, i) => w.el === next.wraps[i].el && w.segs.join() === next.wraps[i].segs.join()) &&
          prev.inks.length === next.inks.length &&
          prev.inks.every((k, i) => k.from === next.inks[i].from && k.to === next.inks[i].to) &&
          prev.branches.length === next.branches.length &&
          prev.branches.every((b, i) => b.d === next.branches[i].d && b.el === next.branches[i].el)
            ? prev
            : next,
        );
      });
    };
    const resize = new ResizeObserver(build);
    resize.observe(wrap);
    // Content swapped in place (e.g. tabs) brings new stops without a resize.
    const mutate = new MutationObserver(build);
    mutate.observe(wrap, { childList: true, subtree: true });
    build();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutate.disconnect();
    };
  }, []);

  // Sample the path once per build: length → y, so a scroll position maps
  // to how much of the line to show.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geo) return;
    const len = path.getTotalLength();
    total.current = len;
    const n = Math.max(60, Math.round(len / 12));
    const list: { len: number; y: number }[] = [];
    let maxY = -Infinity;
    for (let i = 0; i <= n; i++) {
      const at = (len * i) / n;
      maxY = Math.max(maxY, path.getPointAtLength(at).y); // loops go back up; keep it monotonic
      list.push({ len: at, y: maxY });
    }
    samples.current = list;
    path.style.strokeDasharray = `${len} ${len}`;
  }, [geo]);

  // Follow the scroll.
  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path || !geo) return;
    wrap.setAttribute("data-line-ready", "");
    wrapState.current = [];
    circleState.current = [];
    const mark = (tipY: number) => {
      // The last one reached is "current": the one the line is on now.
      let current: HTMLElement | null = null;
      for (const t of touch.current) {
        if (!t.el.hasAttribute("data-branch")) continue;
        if (tipY >= t.y) {
          t.el.setAttribute("data-reached", "");
          current = t.el;
        } else t.el.removeAttribute("data-reached");
      }
      for (const t of touch.current) {
        if (t.el === current && tipY !== Infinity) t.el.setAttribute("data-current", "");
        else t.el.removeAttribute("data-current");
      }
      let currentCircle: HTMLElement | null = null;
      geo.circles.forEach((c, i) => {
        const on = tipY >= c.y;
        if (on) currentCircle = c.el;
        if (circleState.current[i] === on) return;
        circleState.current[i] = on;
        if (on) c.el.setAttribute("data-reached", "");
        else c.el.removeAttribute("data-reached");
        const el = circleRefs.current[i];
        if (!el) return;
        el.style.transition = tipY === Infinity ? "none" : "stroke-dashoffset 650ms cubic-bezier(0.65, 0, 0.35, 1)";
        el.style.strokeDashoffset = on ? "0" : "1";
      });
      geo.circles.forEach((c) => {
        if (c.el === currentCircle && tipY !== Infinity) c.el.setAttribute("data-current", "");
        else c.el.removeAttribute("data-current");
      });
      geo.wraps.forEach((w, gi) => {
        const on = tipY >= w.y + 20;
        if (wrapState.current[gi] === on) return;
        wrapState.current[gi] = on;
        if (on) w.el.setAttribute("data-reached", "");
        else w.el.removeAttribute("data-reached");
        (wrapRefs.current[gi] || []).forEach((el, i) => {
          if (!el) return;
          el.style.transition =
            tipY === Infinity
              ? "none"
              : on
                ? `stroke-dashoffset ${WRAP_SEG}ms cubic-bezier(0.65, 0, 0.35, 1) ${i * WRAP_SEG}ms`
                : "stroke-dashoffset 300ms ease";
          el.style.strokeDashoffset = on ? "0" : "1";
        });
      });
      geo.branches.forEach((b, i) => {
        const el = branchRefs.current[i];
        if (el) el.style.strokeDashoffset = tipY >= b.y ? "0" : "1";
      });
    };
    if (reduce) {
      path.style.strokeDashoffset = "0";
      mark(Infinity);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const tipY = window.scrollY + window.innerHeight * TIP - (wrap.getBoundingClientRect().top + window.scrollY);
      const list = samples.current;
      let drawn = 0;
      // Largest length whose point is above the tip (binary search).
      let lo = 0;
      let hi = list.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (list[mid].y <= tipY) {
          drawn = list[mid].len;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      path.style.strokeDashoffset = String(total.current - drawn);
      mark(tipY);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geo, reduce]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {children}
      {geo && (
        <svg
          aria-hidden="true"
          data-scroll-line=""
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          className="pointer-events-none absolute top-0 left-0 z-10 overflow-visible"
        >
          {geo.inks.length > 0 && (
            <defs>
              <linearGradient id="scroll-line-ink" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
                {geo.inks.flatMap((k, i) => {
                  const a = k.from / geo.h;
                  const b = k.to / geo.h;
                  return [
                    <stop key={`${i}a`} offset={a} stopColor="#5CE1E6" />,
                    <stop key={`${i}b`} offset={a} stopColor={k.color} />,
                    <stop key={`${i}c`} offset={b} stopColor={k.color} />,
                    <stop key={`${i}d`} offset={b} stopColor="#5CE1E6" />,
                  ];
                })}
              </linearGradient>
            </defs>
          )}
          <path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke={geo.inks.length ? "url(#scroll-line-ink)" : "#5CE1E6"}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDashoffset: 1e6 }}
          />
          {geo.circles.map((c, i) => (
            <path
              key={`circle-${i}`}
              ref={(el) => {
                circleRefs.current[i] = el;
              }}
              d={c.d}
              pathLength={1}
              fill="none"
              stroke="#5CE1E6"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              style={{ strokeDashoffset: 1 }}
            />
          ))}
          {geo.wraps.map((w, gi) =>
            w.segs.map((d, i) => (
              <path
                key={`wrap-${gi}-${i}`}
                ref={(el) => {
                  (wrapRefs.current[gi] ||= [])[i] = el;
                }}
                d={d}
                pathLength={1}
                fill="none"
                stroke="#5CE1E6"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 1"
                style={{ strokeDashoffset: 1 }}
              />
            )),
          )}
          {geo.branches.map((b, i) => (
            <path
              key={`${b.y}-${i}`}
              ref={(el) => {
                branchRefs.current[i] = el;
              }}
              d={b.d}
              pathLength={1}
              fill="none"
              stroke="#5CE1E6"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="1 1"
              style={{
                strokeDashoffset: 1,
                transition: reduce ? "none" : "stroke-dashoffset 320ms cubic-bezier(0.77, 0, 0.175, 1)",
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
