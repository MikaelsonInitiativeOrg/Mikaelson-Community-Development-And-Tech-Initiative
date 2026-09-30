"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ClippedTabs } from "@/components/site/clipped-tabs";
import { Reveal } from "@/components/site/motion/reveal";
import { categoryId, type Post } from "./posts";
import Image from "next/image";
import { LeadCard, StoryCard } from "./post-cards";
import { PostParamSync } from "./post-param-sync";
import { DrawnLine } from "./drawn-line";
import { Reader, loadArticleBody, type ReaderRefs } from "./reader";

/* ------------------------------------------------------------------ */
/* Motion values                                                       */
/* ------------------------------------------------------------------ */

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
/** Card → reader: the panel, image and title travel together. */
const OPEN_MS = 480;
/** Meta, excerpt and body fade in once the header has nearly landed. */
const FADE_DELAY_MS = 240;
const FADE_MS = 260;
/** Reader → card: faster than the open. Travel ends at 72%, then the panel fades so the card's own text shows. */
const CLOSE_MS = 400;
const CLOSE_LAND = 0.72;
const REDUCED_IN_MS = 200;
const REDUCED_OUT_MS = 150;

/** Stories are rounded-3xl: the panel starts as that shape. */
const CARD_RADIUS = 24;

const INVITES = [
  { label: "Volunteer", text: "Share your time and skills with students.", href: "/volunteer" },
  { label: "Sponsor", text: "Help a programme reach more students.", href: "/sponsor" },
  { label: "Get in touch", text: "Ask a question or start a conversation.", href: "/contact" },
];

type Phase = "closed" | "opening" | "open" | "closing";
type Rect = { x: number; y: number; w: number; h: number };

/** Layout position in the viewport from offsets, so a card mid-press
 * (scale 0.97) or mid-reveal (translateY) is measured where it really sits. */
function layoutRect(el: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x: x - window.scrollX, y: y - window.scrollY, w: el.offsetWidth, h: el.offsetHeight };
}

/** The reader's own elements are untransformed when measured (their
 * animations are cancelled first), so their client rect is their layout. */
function clientRect(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

function px(value: string) {
  return parseFloat(value) || 0;
}

/** The panel clipped to the card's box. */
function panelClip(card: Rect, panel: HTMLElement, radius: number) {
  const right = panel.offsetWidth - (card.x + card.w);
  const bottom = panel.offsetHeight - (card.y + card.h);
  return `inset(${card.y}px ${right}px ${bottom}px ${card.x}px round ${radius}px)`;
}

/**
 * The reader image drawn exactly over the card's image tile: scaled so it
 * covers the tile, then clipped to the tile's shape (object-cover crops
 * both from the centre, so the picture lines up). Aspect ratios can differ.
 */
function imageFrom(card: Rect, reader: Rect, cardRadius: number) {
  const s = Math.max(card.w / reader.w, card.h / reader.h);
  const insetX = Math.max(0, (reader.w - card.w / s) / 2);
  const insetY = Math.max(0, (reader.h - card.h / s) / 2);
  const tx = card.x - reader.x - insetX * s;
  const ty = card.y - reader.y - insetY * s;
  return {
    transform: `translate(${tx}px, ${ty}px) scale(${s})`,
    clipPath: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${cardRadius / s}px)`,
  };
}

function titleFrom(card: Rect, reader: Rect, cardFont: number, readerFont: number) {
  const s = cardFont / readerFont;
  return { transform: `translate(${card.x - reader.x}px, ${card.y - reader.y}px) scale(${s})` };
}

function inViewport(r: Rect) {
  return r.y + r.h > 0 && r.y < window.innerHeight && r.w > 0;
}

/* ------------------------------------------------------------------ */
/* Page lock while the reader is open                                  */
/* ------------------------------------------------------------------ */

function lockPage(readerRoot: HTMLElement | null) {
  const html = document.documentElement;
  const scrollbar = window.innerWidth - html.clientWidth;
  html.style.overflow = "hidden";
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  const inerted: Element[] = [];
  for (const child of Array.from(document.body.children)) {
    if (child === readerRoot || child.hasAttribute("inert") || child.tagName === "SCRIPT") continue;
    child.setAttribute("inert", "");
    inerted.push(child);
  }
  return () => {
    html.style.overflow = "";
    document.body.style.paddingRight = "";
    inerted.forEach((el) => el.removeAttribute("inert"));
  };
}

/* ------------------------------------------------------------------ */

export function BlogLab({ posts }: { posts: Post[] }) {
  const reduce = useReducedMotion();

  const [category, setCategory] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("closed");
  const [underlaySrc, setUnderlaySrc] = useState<string | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const refs: ReaderRefs = {
    panel: useRef<HTMLDivElement>(null),
    image: useRef<HTMLDivElement>(null),
    title: useRef<HTMLHeadingElement>(null),
    article: useRef<HTMLElement>(null),
    close: useRef<HTMLButtonElement>(null),
  };
  const refsRef = useRef(refs);
  refsRef.current = refs;

  // Mutable mirrors, so history events and timers see the latest state.
  const phaseRef = useRef<Phase>("closed");
  const openSlugRef = useRef<string | null>(null);
  const pushedRef = useRef(false); // did we add the ?post= history entry?
  const flipRef = useRef(false); // should this open grow out of its card?
  const pendingCloseRef = useRef(false);
  const unlockRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);
  const animationsRef = useRef<Animation[]>([]);
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;

  const bySlug = useMemo(() => new Map(posts.map((p) => [p.slug.current, p])), [posts]);
  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    [posts],
  );
  const visible = category === "all" ? posts : posts.filter((p) => p.category && categoryId(p.category) === category);
  const [lead, ...rest] = visible;
  const activeCategory = categories.find((c) => categoryId(c) === category);

  const setPhaseBoth = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const stopAnimations = () => {
    animationsRef.current.forEach((a) => a.cancel());
    animationsRef.current = [];
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const cardParts = (slug: string) => {
    const card = listRef.current?.querySelector<HTMLElement>(`[data-post-card="${CSS.escape(slug)}"]`);
    if (!card) return null;
    return {
      card,
      image: card.querySelector<HTMLElement>('[data-shared="image"]'),
      title: card.querySelector<HTMLElement>('[data-shared="title"]'),
      button: card.querySelector<HTMLButtonElement>("button"),
    };
  };

  /* ---------------- open ---------------- */

  const beginOpen = (slug: string) => {
    stopAnimations();
    const parts = cardParts(slug);
    const rect = parts ? layoutRect(parts.card) : null;
    flipRef.current = Boolean(parts && rect && inViewport(rect) && !reduceRef.current);
    setUnderlaySrc(
      flipRef.current ? (parts?.image?.querySelector("img") as HTMLImageElement | null)?.currentSrc || null : null,
    );
    openSlugRef.current = slug;
    setOpenSlug(slug);
    setPhaseBoth("opening");
  };

  // Runs once the reader has rendered in its final layout.
  useLayoutEffect(() => {
    if (phase !== "opening" || !openSlug) return;
    const { panel, image, title } = refsRef.current;
    const panelEl = panel.current;
    if (!panelEl) return;

    unlockRef.current?.();
    unlockRef.current = lockPage(panelEl.parentElement);

    const fades = Array.from(panelEl.querySelectorAll<HTMLElement>("[data-reader-fade]"));
    const parts = cardParts(openSlug);
    const anims: Animation[] = [];
    let total: number;

    if (flipRef.current && parts) {
      const card = layoutRect(parts.card);
      const timing = { duration: OPEN_MS, easing: EASE_IN_OUT, fill: "both" as const };

      anims.push(
        panelEl.animate([{ clipPath: panelClip(card, panelEl, CARD_RADIUS) }, { clipPath: "inset(0px 0px 0px 0px round 0px)" }], timing),
      );

      if (parts.image && image.current) {
        const radius = px(getComputedStyle(parts.image).borderTopLeftRadius);
        const from = imageFrom(layoutRect(parts.image), clientRect(image.current), radius);
        anims.push(image.current.animate([from, { transform: "none", clipPath: "inset(0px 0px 0px 0px round 24px)" }], timing));
      }

      if (parts.title && title.current) {
        const from = titleFrom(
          layoutRect(parts.title),
          clientRect(title.current),
          px(getComputedStyle(parts.title).fontSize),
          px(getComputedStyle(title.current).fontSize),
        );
        anims.push(title.current.animate([from, { transform: "none" }], timing));
      }

      fades.forEach((el) =>
        anims.push(
          el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
            duration: FADE_MS,
            delay: FADE_DELAY_MS,
            easing: EASE_OUT,
            fill: "both",
          }),
        ),
      );
      total = FADE_DELAY_MS + FADE_MS;
    } else {
      // Deep link, card filtered out or off screen, or reduced motion: fade.
      total = reduceRef.current ? REDUCED_IN_MS : 240;
      anims.push(panelEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: total, easing: EASE_OUT, fill: "both" }));
    }

    animationsRef.current = anims;
    refsRef.current.title.current?.focus({ preventScroll: true });

    // Advance on a timer, never on animation events (they don't fire in a
    // hidden tab). Cancelling leaves the elements in their natural, open layout.
    timerRef.current = window.setTimeout(() => {
      stopAnimations();
      setPhaseBoth("open");
      if (pendingCloseRef.current) {
        pendingCloseRef.current = false;
        beginClose();
      }
    }, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, openSlug]);

  /* ---------------- close ---------------- */

  const finishClose = () => {
    const slug = openSlugRef.current;
    stopAnimations();
    unlockRef.current?.();
    unlockRef.current = null;
    openSlugRef.current = null;
    setOpenSlug(null);
    setUnderlaySrc(null);
    setPhaseBoth("closed");
    const parts = slug ? cardParts(slug) : null;
    (parts?.button ?? listRef.current?.querySelector<HTMLElement>("[data-list-heading]"))?.focus({ preventScroll: true });
  };

  function beginClose() {
    if (phaseRef.current === "closing" || phaseRef.current === "closed") return;
    if (phaseRef.current === "opening") {
      pendingCloseRef.current = true;
      return;
    }
    const slug = openSlugRef.current;
    const { panel, image, title } = refsRef.current;
    const panelEl = panel.current;
    if (!slug || !panelEl) return finishClose();
    stopAnimations();
    setPhaseBoth("closing");

    let parts = cardParts(slug);
    const reduced = Boolean(reduceRef.current);

    // A card below or above the fold (after a deep link, or "Next"): bring
    // it into view behind the reader, so the reader folds back into it.
    if (parts && !reduced) {
      const r = layoutRect(parts.card);
      if (!inViewport(r) || r.y < 0 || r.y + r.h > window.innerHeight) {
        window.scrollTo({ top: window.scrollY + r.y - Math.max(80, (window.innerHeight - r.h) / 2), behavior: "instant" });
        parts = cardParts(slug);
      }
    }

    const fades = Array.from(panelEl.querySelectorAll<HTMLElement>("[data-reader-fade]"));
    const anims: Animation[] = [];
    let total: number;

    if (parts && !reduced) {
      const card = layoutRect(parts.card);
      const land = { offset: CLOSE_LAND };
      const timing = { duration: CLOSE_MS, fill: "both" as const };

      fades.forEach((el) =>
        anims.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: EASE_OUT, fill: "both" })),
      );

      const clip = panelClip(card, panelEl, CARD_RADIUS);
      anims.push(
        panelEl.animate(
          [
            { clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1, easing: EASE_IN_OUT },
            { clipPath: clip, opacity: 1, ...land, easing: EASE_OUT },
            { clipPath: clip, opacity: 0 },
          ],
          timing,
        ),
      );

      if (parts.image && image.current) {
        const radius = px(getComputedStyle(parts.image).borderTopLeftRadius);
        const to = imageFrom(layoutRect(parts.image), clientRect(image.current), radius);
        anims.push(
          image.current.animate(
            [{ transform: "none", clipPath: "inset(0px 0px 0px 0px round 24px)", easing: EASE_IN_OUT }, { ...to, ...land }, to],
            timing,
          ),
        );
      }

      if (parts.title && title.current) {
        const to = titleFrom(
          layoutRect(parts.title),
          clientRect(title.current),
          px(getComputedStyle(parts.title).fontSize),
          px(getComputedStyle(title.current).fontSize),
        );
        anims.push(title.current.animate([{ transform: "none", easing: EASE_IN_OUT }, { ...to, ...land }, to], timing));
      }
      total = CLOSE_MS;
    } else {
      total = REDUCED_OUT_MS;
      anims.push(panelEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: total, easing: EASE_OUT, fill: "both" }));
    }

    animationsRef.current = anims;
    timerRef.current = window.setTimeout(finishClose, total);
  }

  /* ---------------- history ---------------- */

  const withPost = (slug: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) params.set("post", slug);
    else params.delete("post");
    const query = params.toString();
    return `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  };

  const requestOpen = (slug: string) => {
    if (phaseRef.current !== "closed") return;
    pushedRef.current = true;
    window.history.pushState(null, "", withPost(slug));
  };

  const requestClose = () => {
    if (phaseRef.current === "closing" || phaseRef.current === "closed") return;
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back(); // PostParamSync sees the param go and closes
    } else {
      // Arrived with ?post= in the URL: drop it without leaving the page.
      window.history.replaceState(null, "", withPost(null));
      beginClose();
    }
  };

  const showNext = (slug: string) => {
    window.history.replaceState(null, "", withPost(slug));
  };

  // The URL is the source of truth: clicks, Back/Forward and deep links all
  // arrive here.
  const onParam = useCallback(
    (slug: string | null) => {
      const current = openSlugRef.current;
      if (slug && bySlug.has(slug)) {
        if (!current) {
          beginOpen(slug);
        } else if (slug !== current && phaseRef.current === "open") {
          // "Next article" inside the reader: swap the content in place.
          openSlugRef.current = slug;
          setOpenSlug(slug);
          const { panel, article, title } = refsRef.current;
          panel.current?.scrollTo({ top: 0, behavior: "instant" });
          if (!reduceRef.current) {
            article.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: EASE_OUT });
          }
          requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
        }
      } else if (current) {
        pushedRef.current = false;
        beginClose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bySlug],
  );

  // Escape closes (instant decision, the fold is the response).
  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSlug]);

  // Portal host, created on the client, plus cleanup if the page unmounts mid-read.
  useEffect(() => {
    const host = document.createElement("div");
    host.setAttribute("data-blog-reader-root", "");
    document.body.appendChild(host);
    setPortalRoot(host);
    return () => {
      stopAnimations();
      unlockRef.current?.();
      host.remove();
    };
  }, []);

  const prefetchBody = useCallback(() => {
    void loadArticleBody();
  }, []);

  const openPost = openSlug ? bySlug.get(openSlug) : undefined;

  return (
    <>
      <Suspense fallback={null}>
        <PostParamSync onChange={onParam} />
      </Suspense>

      {/* Masthead: what these stories are, with a real session photo. */}
      <section className="overflow-hidden bg-white dark:bg-[#050a0a]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 pt-16 pb-16 md:grid-cols-12 md:px-10 md:pt-24 md:pb-24">
          <div className="md:col-span-7">
            <p className="text-[13px] font-semibold text-[#003e45] dark:text-[#5ce1e6]">Stories from the Mikaelson Initiative</p>
            <h1 className="mt-4 text-[2.375rem] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003e45] md:text-[3.75rem] dark:text-white">
              Ideas, leadership and growth, told by the people living them
            </h1>
            <DrawnLine immediate className="mt-3 h-5 w-56 md:h-6 md:w-80" />
            <p className="mt-6 max-w-[50ch] text-base leading-[1.7] text-[#555] md:text-lg dark:text-white/60">
              Stories written to help students think bigger, grow with intention and take meaningful action, and
              for the parents, teachers and mentors walking beside them.
            </p>
            <div className="mt-5">
              <Link
                href="/studio"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003e45]/70 underline decoration-[#5ce1e6] underline-offset-4 transition-colors hover:text-[#003e45] dark:text-white/50 dark:hover:text-white"
              >
                <span>Team member? Open Writer Studio &rarr;</span>
              </Link>
            </div>
          </div>
          <figure className="md:col-span-5">
            <div className="relative aspect-[4/5] -rotate-[1.5deg] overflow-hidden rounded-3xl bg-[#e8f7f8] shadow-[0_24px_48px_-24px_rgba(0,62,69,0.35)] motion-reduce:rotate-0 dark:bg-white/5">
              <Image
                src="/assets/images/community-2.png"
                alt="A Mikaelson session: a facilitator speaks while students listen around the tables"
                fill
                priority
                sizes="(min-width: 1200px) 440px, (min-width: 768px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-sm text-[#555] md:pl-2 dark:text-white/60">
              A Mikaelson session, with students and a facilitator.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The stories */}
      <section className="bg-white pb-24 md:pb-32 dark:bg-[#050a0a]" aria-labelledby="articles-heading">
        <div ref={listRef} className="mx-auto max-w-[1200px] px-4 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2
                id="articles-heading"
                data-list-heading
                tabIndex={-1}
                className="text-[1.75rem] leading-tight font-bold tracking-[-0.02em] text-[#003e45] outline-none md:text-[2.5rem] dark:text-white"
              >
                {activeCategory ? `Stories about ${activeCategory.toLowerCase()}` : "Latest stories"}
              </h2>
              {posts.length > 0 ? (
                <p className="mt-2 text-sm text-[#555] dark:text-white/60" aria-live="polite">
                  {visible.length} {visible.length === 1 ? "story" : "stories"}
                </p>
              ) : null}
            </div>
            {categories.length > 1 ? (
              <ClippedTabs
                ariaLabel="Show stories by theme"
                items={[{ id: "all", label: "All stories" }, ...categories.map((c) => ({ id: categoryId(c), label: c }))]}
                active={category}
                onChange={setCategory}
              />
            ) : null}
          </div>

          <div
            id={`panel-${category}`}
            role={categories.length > 1 ? "tabpanel" : undefined}
            aria-labelledby={categories.length > 1 ? `tab-${category}` : undefined}
            className="mt-10 md:mt-14"
          >
            {lead ? (
              <>
                <LeadCard key={lead._id} post={lead} onOpen={requestOpen} onIntent={prefetchBody} />
                {rest.length > 0 ? (
                  <div className="mt-20 grid gap-x-10 gap-y-16 md:mt-28 md:grid-cols-2">
                    {rest.map((post) => (
                      <Reveal key={post._id}>
                        <StoryCard post={post} onOpen={requestOpen} onIntent={prefetchBody} />
                      </Reveal>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-3xl bg-[#eefcfc] p-8 md:p-12 dark:bg-white/5">
                <p className="text-xl font-semibold text-[#003e45] dark:text-white">
                  {category === "all" ? "No stories yet" : "No stories on this theme yet"}
                </p>
                <p className="mt-3 max-w-[46ch] text-base leading-[1.7] text-[#555] dark:text-white/60">
                  {category === "all"
                    ? "Stories about students, leadership and growth are on the way."
                    : "Try another theme."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The one warm band: a gentle invitation to help. */}
      <section className="bg-[#003e45] text-white" aria-labelledby="walk-with-us">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-24 md:grid-cols-12 md:px-10 md:py-32">
          <div className="md:col-span-5">
            <h2 id="walk-with-us" className="text-[1.75rem] leading-tight font-bold tracking-[-0.02em] md:text-[2.5rem]">
              Every story here has people walking beside a student
            </h2>
            <DrawnLine variant="path" className="mt-5 h-6 w-40" />
            <p className="mt-6 max-w-[44ch] text-base leading-[1.7] text-white/75 md:text-lg">
              You could be one of them. Give some time, back a programme, or just say hello.
            </p>
          </div>
          <ul className="grid gap-3 md:col-span-6 md:col-start-7 md:self-end">
            {INVITES.map((invite) => (
              <li key={invite.href}>
                <Link
                  href={invite.href}
                  className="group flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-white/[0.06] px-6 py-5 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ce1e6] active:scale-[0.98] motion-reduce:active:scale-100"
                >
                  <span>
                    <span className="block text-lg font-semibold text-[#5ce1e6]">{invite.label}</span>
                    <span className="mt-1 block text-[15px] leading-snug text-white/75">{invite.text}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-white/70" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {portalRoot && openPost
        ? createPortal(
            <Reader
              post={openPost}
              refs={refs}
              underlaySrc={underlaySrc}
              posts={posts}
              onClose={requestClose}
              onNext={showNext}
            />,
            portalRoot,
          )
        : null}
    </>
  );
}
