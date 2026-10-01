"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpenCheck, Eye, ThumbsDown, ThumbsUp } from "lucide-react";

/**
 * Under each story: how many people have seen it and read it, and like /
 * dislike buttons. Opening the story counts a view. It counts as read when
 * this panel (at the end of the story) comes into view and the reader has
 * spent long enough on it to have read it: 40% of its reading time,
 * between 10 and 90 seconds. Each visitor counts once per story (handled
 * by /api/blog/[slug]/stats). The dislike count is private to the team,
 * so only the button shows here.
 */

type Stats = { views: number; reads: number; likes: number; dislikes: number | null; mine: "like" | "dislike" | null };

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export function StoryStats({ slug, minutes }: { slug: string; minutes: number }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const opened = useRef(Date.now());
  const readSent = useRef(false);
  const url = `/api/blog/${encodeURIComponent(slug)}/stats`;

  const send = async (action: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) setStats(await res.json());
    return res.ok;
  };

  // A view, once, when the story opens.
  useEffect(() => {
    opened.current = Date.now();
    readSent.current = false;
    send("view").catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // A read: the end of the story is on screen and enough time has passed.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const needed = Math.min(90, Math.max(10, minutes * 60 * 0.4)) * 1000;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const markRead = () => {
      if (readSent.current) return;
      readSent.current = true;
      send("read").catch(() => {});
    };
    const io = new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (!entry.isIntersecting || readSent.current) return;
      const left = needed - (Date.now() - opened.current);
      if (left <= 0) markRead();
      else timer = setTimeout(markRead, left);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, minutes]);

  const react = async (choice: "like" | "dislike") => {
    if (!stats || busy) return;
    const next = stats.mine === choice ? null : choice;
    // Show it straight away; the server's counts replace this.
    setStats({
      ...stats,
      mine: next,
      likes: stats.likes + (next === "like" ? 1 : 0) - (stats.mine === "like" ? 1 : 0),
      dislikes:
        stats.dislikes === null
          ? null
          : stats.dislikes + (next === "dislike" ? 1 : 0) - (stats.mine === "dislike" ? 1 : 0),
    });
    setBusy(true);
    const ok = await send(next ?? "clear").catch(() => false);
    if (!ok) setStats(stats);
    setBusy(false);
  };

  const btn = (on: boolean) =>
    `inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097a7] ${
      on
        ? "border-[#003e45] bg-[#003e45] text-white dark:border-[#5ce1e6] dark:bg-[#5ce1e6] dark:text-[#050a0a]"
        : "border-[#003e45]/20 text-[#003e45] hover:border-[#003e45] dark:border-white/20 dark:text-white dark:hover:border-white"
    }`;

  return (
    <div
      ref={ref}
      className="mt-12 flex flex-col gap-5 rounded-2xl border border-[#003e45]/10 bg-[#eefcfc]/60 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div>
        <p className="text-[15px] font-semibold text-[#003e45] dark:text-white">Did this story help you?</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#555] dark:text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" aria-hidden="true" />
            {stats ? compact.format(stats.views) : "–"} seen
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpenCheck className="size-3.5" aria-hidden="true" />
            {stats ? compact.format(stats.reads) : "–"} read
          </span>
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => react("like")}
          aria-pressed={stats?.mine === "like"}
          aria-label={`Like this story${stats ? `, ${stats.likes} likes` : ""}`}
          disabled={!stats}
          className={btn(stats?.mine === "like")}
        >
          <ThumbsUp className="size-4" aria-hidden="true" />
          <span className="tabular-nums">{stats ? compact.format(stats.likes) : "–"}</span>
        </button>
        <button
          type="button"
          onClick={() => react("dislike")}
          aria-pressed={stats?.mine === "dislike"}
          aria-label="Dislike this story"
          disabled={!stats}
          className={btn(stats?.mine === "dislike")}
        >
          <ThumbsDown className="size-4" aria-hidden="true" />
          {stats?.dislikes !== null && stats?.dislikes !== undefined && (
            <span className="tabular-nums">{compact.format(stats.dislikes)}</span>
          )}
        </button>
      </div>
    </div>
  );
}
