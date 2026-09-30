"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ArticleBodyProps {
  body?: string | any;
}

export default function ArticleBody({ body }: ArticleBodyProps) {
  if (!body) {
    return <p className="text-base text-[#555] dark:text-white/60">This story has no text yet.</p>;
  }

  const rawText = typeof body === "string" ? body : JSON.stringify(body, null, 2);

  // Split into paragraphs / blocks by double newlines
  const blocks = rawText.split(/\n\s*\n/);

  return (
    <div className="max-w-[68ch] text-[1.0625rem] leading-[1.8] text-[#333] md:text-[1.125rem] dark:text-white/80">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 2 (## ...)
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="mt-14 mb-4 text-[1.625rem] leading-tight font-bold tracking-[-0.02em] text-[#003e45] first:mt-0 dark:text-white"
            >
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        // Heading 3 (### ...)
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="mt-10 mb-3 text-[1.3125rem] leading-snug font-semibold tracking-[-0.01em] text-[#003e45] first:mt-0 dark:text-white"
            >
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // Heading 1 (# ...)
        if (trimmed.startsWith("# ")) {
          return (
            <h2
              key={idx}
              className="mt-14 mb-4 text-[1.875rem] leading-tight font-extrabold tracking-[-0.02em] text-[#003e45] first:mt-0 dark:text-white"
            >
              {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
            </h2>
          );
        }

        // Blockquote (> ...)
        if (trimmed.startsWith("> ")) {
          const quoteText = trimmed
            .split("\n")
            .map((line) => line.replace(/^>\s*/, ""))
            .join(" ");

          return (
            <blockquote
              key={idx}
              className="my-10 border-l-[3.5px] border-[#5ce1e6] pl-6 text-[1.25rem] leading-relaxed font-medium text-[#003e45] italic dark:text-[#5ce1e6]"
            >
              {parseInlineMarkdown(quoteText)}
            </blockquote>
          );
        }

        // Image (![alt](url))
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          const alt = imgMatch[1] || "";
          const src = imgMatch[2];
          return (
            <figure key={idx} className="my-10">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#e8f7f8] dark:bg-white/5">
                <Image src={src} alt={alt} fill sizes="(min-width: 768px) 680px, 100vw" className="object-cover" />
              </div>
              {alt ? (
                <figcaption className="mt-3 text-center text-sm text-[#666] dark:text-white/60">{alt}</figcaption>
              ) : null}
            </figure>
          );
        }

        // Bullet list (- ... or * ...)
        if (trimmed.split("\n").every((l) => /^\s*[-*]\s+/.test(l))) {
          const items = trimmed.split("\n").map((l) => l.replace(/^\s*[-*]\s+/, ""));
          return (
            <ul key={idx} className="my-6 space-y-3 pl-0">
              {items.map((item, i) => (
                <li key={i} className="relative pl-7">
                  <span aria-hidden="true" className="absolute top-[0.62em] left-0 size-2 rounded-full bg-[#5ce1e6]" />
                  {parseInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered list (1. ... 2. ...)
        if (trimmed.split("\n").every((l) => /^\s*\d+\.\s+/.test(l))) {
          const items = trimmed.split("\n").map((l) => l.replace(/^\s*\d+\.\s+/, ""));
          return (
            <ol
              key={idx}
              className="my-6 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-[#003e45] dark:marker:text-[#5ce1e6]"
            >
              {items.map((item, i) => (
                <li key={i} className="pl-1">
                  {parseInlineMarkdown(item)}
                </li>
              ))}
            </ol>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="mt-6 first:mt-0">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/** Parses bold, italic, and links in a line */
function parseInlineMarkdown(text: string): React.ReactNode {
  // Regex to match markdown links [label](url), bold **bold**, italic *italic*
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for link [text](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    // Check for italic *text*
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/);

    // Find the earliest match
    const matches = [
      linkMatch ? { type: "link", match: linkMatch, index: linkMatch.index! } : null,
      boldMatch ? { type: "bold", match: boldMatch, index: boldMatch.index! } : null,
      italicMatch ? { type: "italic", match: italicMatch, index: italicMatch.index! } : null,
    ].filter(Boolean) as { type: string; match: RegExpMatchArray; index: number }[];

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const earliest = matches[0];

    // Push preceding text
    if (earliest.index > 0) {
      parts.push(remaining.substring(0, earliest.index));
    }

    if (earliest.type === "link") {
      const linkLabel = earliest.match[1];
      const linkUrl = earliest.match[2];
      const isExternal = /^https?:\/\//.test(linkUrl);

      parts.push(
        <a
          key={key++}
          href={linkUrl}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-semibold text-[#003e45] underline decoration-[#5ce1e6] decoration-2 underline-offset-[3px] transition-colors hover:text-[#0097a7] dark:text-[#5ce1e6] dark:hover:text-white"
        >
          {linkLabel}
        </a>,
      );
    } else if (earliest.type === "bold") {
      parts.push(
        <strong key={key++} className="font-bold text-[#111] dark:text-white">
          {earliest.match[1]}
        </strong>,
      );
    } else if (earliest.type === "italic") {
      parts.push(
        <em key={key++} className="italic">
          {earliest.match[1]}
        </em>,
      );
    }

    remaining = remaining.substring(earliest.index + earliest.match[0].length);
  }

  return parts.length === 1 ? parts[0] : parts;
}
