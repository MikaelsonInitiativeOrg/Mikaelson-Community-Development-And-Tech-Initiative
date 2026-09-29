"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { imageUrl, type PortableBlock } from "./posts";

/**
 * The story text, set for long reading: 68ch measure, 18px (17px on
 * phones), 1.75 leading. Loaded on first open (dynamic import), so the
 * PortableText renderer isn't in the index page's first load. Nothing here
 * animates: the text is for reading.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-6 first:mt-0">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-14 text-[1.625rem] leading-tight font-bold tracking-[-0.02em] text-[#111] dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 text-[1.3125rem] leading-snug font-semibold tracking-[-0.01em] text-[#111] dark:text-white">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-[3px] border-[#5ce1e6] pl-6 text-[1.25rem] leading-relaxed font-medium text-[#003e45] dark:text-[#5ce1e6]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-6 space-y-3 pl-0">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-[#003e45] dark:marker:text-[#5ce1e6]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-7">
        <span aria-hidden="true" className="absolute top-[0.62em] left-0 size-2 rounded-full bg-[#5ce1e6]" />
        {children}
      </li>
    ),
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#111] dark:text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-[#003e45] underline decoration-[#5ce1e6] decoration-2 underline-offset-[3px] transition-colors duration-150 ease-[ease] hover:decoration-[#003e45] dark:text-[#5ce1e6] dark:hover:decoration-white"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="my-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#e8f7f8] dark:bg-white/5">
            <Image
              src={imageUrl(value, 1400)}
              alt={value.alt || ""}
              fill
              sizes="(min-width: 768px) 680px, 100vw"
              className="object-cover"
            />
          </div>
          {value.alt ? (
            <figcaption className="mt-3 text-sm leading-relaxed text-[#555] dark:text-white/60">{value.alt}</figcaption>
          ) : null}
        </figure>
      ) : null,
  },
};

export default function ArticleBody({ body }: { body: PortableBlock[] }) {
  return (
    <div className="max-w-[68ch] text-[1.0625rem] leading-[1.75] text-[#333] md:text-[1.125rem] dark:text-white/75">
      <PortableText value={body as any} components={components} />
    </div>
  );
}
