"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { imageUrl, readingMinutes, type Post } from "../blog/posts";

interface BlogPopupProps {
  post: Post | null;
}

const STORAGE_KEY = "mikaelson_dismissed_blog_popup";

export function BlogAnnouncementPopup({ post }: BlogPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!post?.slug?.current) return;

    // Check if user already dismissed this specific post
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed === post.slug.current) {
        return;
      }
    } catch {
      // localStorage may fail in private mode
    }

    // Delay popup slightly after page load so user sees hero first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [post]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!mounted || !isOpen || !post || !post.slug?.current) {
    return null;
  }

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      if (post?.slug?.current) {
        localStorage.setItem(STORAGE_KEY, post.slug.current);
      }
    } catch {
      // Ignore storage error
    }
  };

  const minutes = readingMinutes(post.body);
  const postUrl = `/blog/${encodeURIComponent(post.slug.current)}`;

  return (
    <aside
      aria-label="Featured blog announcement"
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-[390px] animate-in fade-in slide-in-from-bottom-6 duration-300 sm:bottom-6 sm:right-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#003e45]/20 bg-white/95 p-4 shadow-2xl shadow-[#003e45]/25 backdrop-blur-md sm:p-5 dark:border-white/15 dark:bg-[#081010]/95 dark:shadow-black/70">
        {/* Glow accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-[#5ce1e6]/20 blur-2xl dark:bg-[#5ce1e6]/10"
        />

        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f7f8] px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
            <Sparkles className="size-3 text-[#0097a7] dark:text-[#5ce1e6]" aria-hidden="true" />
            <span>{post.showAsPopup ? "Featured Story" : "New from our Blog"}</span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss story announcement"
            className="inline-flex size-7 items-center justify-center rounded-full text-[#666] transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Content body */}
        <div className="mt-3 flex gap-3.5">
          {post.coverImage ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#e8f7f8] dark:bg-white/5 sm:size-20">
              <Image
                src={imageUrl(post.coverImage, 240)}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            {post.category ? (
              <span className="text-[11px] font-semibold text-[#003e45]/80 dark:text-[#5ce1e6]/90">
                {post.category}
              </span>
            ) : null}

            <Link
              href={postUrl}
              onClick={handleDismiss}
              className="mt-0.5 block line-clamp-2 text-sm font-bold leading-snug text-[#111] hover:text-[#003e45] dark:text-white dark:hover:text-[#5ce1e6]"
            >
              {post.title}
            </Link>

            {post.excerpt ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#555] dark:text-white/60">
                {post.excerpt}
              </p>
            ) : null}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/5 pt-3 dark:border-white/10">
          <span className="text-[11px] font-medium text-[#777] dark:text-white/50">
            {minutes} min read
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-2 py-1 text-xs font-semibold text-[#666] hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              Later
            </button>

            <Link
              href={postUrl}
              onClick={handleDismiss}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#003e45] px-3.5 py-1.5 text-xs font-semibold text-white transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#002b30] active:scale-95 motion-reduce:active:scale-100 dark:bg-[#5ce1e6] dark:text-[#050a0a] dark:hover:bg-[#4bcdd2]"
            >
              <span>Read story</span>
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
