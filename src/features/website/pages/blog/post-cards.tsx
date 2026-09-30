"use client";

import Image from "next/image";
import { formatDate, imageUrl, readingMinutes, type Post } from "./posts";

/*
 * Stories, laid out like a magazine: a large photograph and the words
 * beside or beneath it, no boxes. The whole story is one button (the
 * title's button stretched over it with ::after). data-post-card /
 * data-shared mark the parts the reader grows out of: the photo and title.
 */

type CardProps = {
  post: Post;
  onOpen: (slug: string) => void;
  onIntent: () => void;
};

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-[#555] dark:text-white/60">
      {post.category ? (
        <span className="rounded-full bg-[#e8f7f8] px-3 py-1 text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
          {post.category}
        </span>
      ) : null}
      {post.author?.name ? <span>by {post.author.name}</span> : null}
      {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, "long")}</time> : null}
      <span>{readingMinutes(post.body)} min read</span>
    </div>
  );
}

function OpenButton({ post, onOpen, onIntent }: CardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(post.slug.current)}
      onPointerEnter={onIntent}
      onFocus={onIntent}
      className="text-left decoration-[#5ce1e6] decoration-[3px] underline-offset-[7px] outline-none after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:underline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[#5ce1e6]"
    >
      {post.title}
    </button>
  );
}

function Photo({ post, width, sizes, priority = false }: { post: Post; width: number; sizes: string; priority?: boolean }) {
  return post.coverImage ? (
    <Image
      src={imageUrl(post.coverImage, width)}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover"
    />
  ) : (
    <div className="absolute inset-0 grid place-items-center">
      <span className="text-[5rem] leading-none font-extrabold text-[#003e45]/15 select-none dark:text-[#5ce1e6]/20">
        {post.category?.charAt(0) ?? "M"}
      </span>
    </div>
  );
}

/** The newest story, as the opening spread. */
export function LeadCard({ post, onOpen, onIntent }: CardProps) {
  return (
    <article
      data-post-card={post.slug.current}
      className="group relative grid items-center gap-8 rounded-3xl md:grid-cols-12 md:gap-12"
    >
      <div
        data-shared={post.coverImage ? "image" : undefined}
        className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#e8f7f8] md:col-span-7 dark:bg-white/5"
      >
        <Photo post={post} width={1400} priority sizes="(min-width: 1200px) 660px, (min-width: 768px) 56vw, 100vw" />
      </div>
      <div className="md:col-span-5">
        <Meta post={post} />
        <h3
          data-shared="title"
          className="mt-5 origin-top-left text-[2rem] leading-[1.08] font-extrabold tracking-[-0.025em] text-[#003e45] md:text-[2.75rem] dark:text-white"
        >
          <OpenButton post={post} onOpen={onOpen} onIntent={onIntent} />
        </h3>
        {post.excerpt ? (
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-[#555] md:text-lg dark:text-white/60">
            {post.excerpt}
          </p>
        ) : null}
        <span
          aria-hidden="true"
          className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#003e45] px-7 text-sm font-semibold text-white transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-active:scale-[0.97] motion-reduce:group-active:scale-100 dark:bg-[#5ce1e6] dark:text-black"
        >
          Read the story
        </span>
      </div>
    </article>
  );
}

/** Every other story: photograph on top, words beneath. */
export function StoryCard({ post, onOpen, onIntent }: CardProps) {
  return (
    <article data-post-card={post.slug.current} className="group relative rounded-3xl">
      <div
        data-shared={post.coverImage ? "image" : undefined}
        className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-[#e8f7f8] dark:bg-white/5"
      >
        <Photo post={post} width={1000} sizes="(min-width: 1200px) 540px, (min-width: 768px) 46vw, 100vw" />
      </div>
      <div className="mt-6">
        <Meta post={post} />
        <h3
          data-shared="title"
          className="mt-4 origin-top-left text-[1.5rem] leading-[1.15] font-bold tracking-[-0.02em] text-[#003e45] md:text-[1.875rem] dark:text-white"
        >
          <OpenButton post={post} onOpen={onOpen} onIntent={onIntent} />
        </h3>
        {post.excerpt ? (
          <p className="mt-3 max-w-[52ch] text-base leading-[1.7] text-[#555] md:text-[1.0625rem] dark:text-white/60">
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
