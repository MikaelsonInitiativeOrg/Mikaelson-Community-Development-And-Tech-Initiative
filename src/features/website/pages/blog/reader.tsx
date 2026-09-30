"use client";

import { useMemo, type RefObject } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import { formatDate, imageUrl, readingMinutes, type Post } from "./posts";
import { DrawnLine } from "./drawn-line";
import { ShareBar } from "./share-bar";
import styles from "./blog.module.css";

function BodyLoading() {
  return (
    <div role="status" className="py-2 text-base text-[#555] dark:text-white/60">
      Loading the story…
      <span aria-hidden="true" className="mt-3 block h-1 w-40 overflow-hidden rounded-full bg-[#5ce1e6]/20">
        <span className={`${styles.loadingLine} block h-full w-full rounded-full bg-[#5ce1e6]`} />
      </span>
    </div>
  );
}

// The PortableText renderer only loads when someone opens an article.
export const loadArticleBody = () => import("./article-body");
const ArticleBody = dynamic(loadArticleBody, { ssr: false, loading: BodyLoading });

export type ReaderRefs = {
  panel: RefObject<HTMLDivElement | null>;
  image: RefObject<HTMLDivElement | null>;
  title: RefObject<HTMLHeadingElement | null>;
  article: RefObject<HTMLElement | null>;
  close: RefObject<HTMLButtonElement | null>;
};

/**
 * The full-screen story reader. Presentational: the open/close motion is
 * run by BlogLab on the refs, so this renders the final (open) layout and
 * the elements get animated from their card's position into it. Elements
 * marked data-reader-fade fade in after the image and title have landed.
 */
export function Reader({
  post,
  refs,
  underlaySrc,
  posts,
  onClose,
  onNext,
}: {
  post: Post;
  refs: ReaderRefs;
  underlaySrc: string | null;
  posts: Post[];
  onClose: () => void;
  onNext: (slug: string) => void;
}) {
  const slug = post.slug.current;
  const body = post.body || "";
  const minutes = readingMinutes(post.body);
  const index = posts.findIndex((p) => p._id === post._id);
  const next = posts.length > 1 ? posts[(index + 1) % posts.length] : null;

  const titleId = `reader-title-${slug}`;

  return (
    <div
      ref={refs.panel}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-reader
      className="fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto overscroll-contain bg-white dark:bg-[#050a0a]"
    >
      {/* Top bar */}
      <div
        data-reader-fade
        className="sticky top-0 z-10 border-b border-black/10 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#050a0a]/95"
      >
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-4 md:px-10">
          <button
            type="button"
            onClick={onClose}
            className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#003e45] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#e8f7f8] focus-visible:outline-2 focus-visible:outline-[#5ce1e6] active:scale-[0.97] motion-reduce:active:scale-100 dark:text-white dark:hover:bg-white/10"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            All stories
          </button>

          <p className="hidden min-w-0 truncate text-sm font-semibold text-[#111] sm:block dark:text-white">
            {post.title}
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={`/blog/${slug}`}
              title="Open full page article"
              className="inline-flex size-11 items-center justify-center rounded-full border border-black/10 text-[#003e45] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#e8f7f8] active:scale-[0.97] motion-reduce:active:scale-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
            >
              <ExternalLink size={16} aria-hidden="true" />
            </Link>

            <button
              ref={refs.close}
              type="button"
              onClick={onClose}
              aria-label="Close story"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#003e45] text-white transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ce1e6] active:scale-[0.97] motion-reduce:active:scale-100 dark:bg-[#5ce1e6] dark:text-black"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div aria-hidden="true" className={`${styles.progress} absolute inset-x-0 -bottom-px h-[3px] bg-[#5ce1e6]`} />
      </div>

      <article ref={refs.article} className="mx-auto max-w-[1120px] px-4 pt-6 pb-24 md:px-10 md:pt-10">
        {post.coverImage ? (
          <div
            ref={refs.image}
            className="relative aspect-[4/3] origin-top-left overflow-hidden rounded-3xl bg-[#e8f7f8] sm:aspect-[16/9] lg:aspect-[21/9] dark:bg-white/5"
          >
            {underlaySrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={underlaySrc} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
            ) : null}
            <Image
              src={imageUrl(post.coverImage, 1800)}
              alt={post.title}
              fill
              loading="eager"
              sizes="(min-width: 1120px) 1040px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[180px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside data-reader-fade className="order-2 md:order-1">
            <dl className="flex flex-wrap gap-x-8 gap-y-4 text-sm md:sticky md:top-24 md:flex-col">
              {post.category ? (
                <div>
                  <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Category</dt>
                  <dd className="mt-1.5">
                    <span className="inline-flex rounded-full bg-[#e8f7f8] px-3 py-1 text-[13px] font-semibold text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
                      {post.category}
                    </span>
                  </dd>
                </div>
              ) : null}

              {post.author?.name ? (
                <div>
                  <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Written by</dt>
                  <dd className="mt-1.5">
                    <p className="font-semibold text-[#111] dark:text-white">{post.author.name}</p>
                    {post.author.role ? (
                      <p className="text-xs text-[#666] dark:text-white/50">{post.author.role}</p>
                    ) : null}
                  </dd>
                </div>
              ) : null}

              {post.publishedAt ? (
                <div>
                  <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Published</dt>
                  <dd className="mt-1.5 font-medium text-[#111] dark:text-white">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, "long")}</time>
                  </dd>
                </div>
              ) : null}

              <div>
                <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Reading time</dt>
                <dd className="mt-1.5 font-medium text-[#111] dark:text-white">{minutes} min</dd>
              </div>
            </dl>
          </aside>

          <div className="order-1 min-w-0 md:order-2">
            <h1
              ref={refs.title}
              id={titleId}
              tabIndex={-1}
              className="max-w-[22ch] origin-top-left text-[2.25rem] leading-[1.08] font-extrabold tracking-[-0.025em] text-[#003e45] outline-none md:text-[3.5rem] dark:text-white"
            >
              {post.title}
            </h1>
            <div data-reader-fade>
              {post.excerpt ? (
                <p className="mt-6 max-w-[60ch] text-[1.1875rem] leading-relaxed text-[#555] md:text-[1.3125rem] dark:text-white/60">
                  {post.excerpt}
                </p>
              ) : null}
              <DrawnLine variant="path" className="mt-8 mb-10 h-6 w-40" />
              {body.length ? (
                <ArticleBody body={body} />
              ) : (
                <p className="text-base text-[#555] dark:text-white/60">This story has no text yet.</p>
              )}

              {/* Share Bar */}
              <div className="mt-12 border-y border-black/10 py-6 dark:border-white/10">
                <ShareBar title={post.title} slug={slug} excerpt={post.excerpt} />
              </div>
            </div>
          </div>
        </div>

        {/* End of the story: where to go next, and a gentle way to help. */}
        <div data-reader-fade className="mt-20 md:ml-[calc(180px+3rem)] lg:ml-[calc(220px+3rem)]">
          <div className="rounded-3xl bg-[#eefcfc] p-6 md:p-10 dark:bg-white/5">
            <p className="max-w-[40ch] text-[1.375rem] leading-snug font-semibold text-[#003e45] md:text-[1.625rem] dark:text-white">
              Stories like this start with a student who decides to grow, and the people who walk beside them.
            </p>
            <p className="mt-4 max-w-[52ch] text-base leading-[1.7] text-[#555] dark:text-white/60">
              You can be one of those people.{" "}
              <Link
                href="/volunteer"
                className="font-semibold text-[#003e45] underline decoration-[#5ce1e6] decoration-2 underline-offset-[3px] dark:text-[#5ce1e6]"
              >
                Volunteer your time
              </Link>{" "}
              or{" "}
              <Link
                href="/sponsor"
                className="font-semibold text-[#003e45] underline decoration-[#5ce1e6] decoration-2 underline-offset-[3px] dark:text-[#5ce1e6]"
              >
                sponsor a programme
              </Link>
              .
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {next ? (
              <button
                type="button"
                onClick={() => onNext(next.slug.current)}
                className="inline-flex min-h-12 max-w-full items-center justify-between gap-3 rounded-full bg-[#5ce1e6] px-6 text-left text-sm font-semibold text-black transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003e45] active:scale-[0.97] motion-reduce:active:scale-100 dark:focus-visible:outline-white"
              >
                <span className="min-w-0 truncate">Next story: {next.title}</span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#003e45]/25 px-6 text-sm font-semibold text-[#003e45] transition-[transform,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#003e45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ce1e6] active:scale-[0.97] motion-reduce:active:scale-100 dark:border-white/25 dark:text-white dark:hover:border-white"
            >
              Back to all stories
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
