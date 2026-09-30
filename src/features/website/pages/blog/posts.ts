import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

/**
 * The index query plus each post's body. The posts are fetched
 * along with author, categorization, and metadata for rich display.
 */
export const postsWithBodyQuery = defineQuery(
  `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    publishedAt,
    _updatedAt,
    coverImage,
    body,
    author,
    showAsPopup,
    seoTitle,
    seoDescription
  }`,
);

export const postBySlugQuery = defineQuery(
  `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    publishedAt,
    _updatedAt,
    coverImage,
    body,
    author,
    showAsPopup,
    seoTitle,
    seoDescription
  }`,
);

export const popupPostQuery = defineQuery(
  `*[_type == "post" && defined(slug.current)] | order(showAsPopup desc, publishedAt desc)[0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    publishedAt,
    coverImage,
    showAsPopup
  }`,
);

export const allPostSlugsQuery = defineQuery(
  `*[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }`,
);

export type PortableBlock = {
  _type: string;
  _key: string;
  style?: string;
  listItem?: string;
  level?: number;
  markDefs?: { _key: string; _type: string; [key: string]: unknown }[];
  children?: { _type: string; _key: string; text?: string; marks?: string[] }[];
  [key: string]: unknown;
};

export interface Author {
  name: string;
  role?: string;
  avatar?: any;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  excerpt?: string;
  publishedAt?: string;
  _updatedAt?: string;
  coverImage?: any;
  body?: PortableBlock[];
  author?: Author;
  showAsPopup?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export function formatDate(dateStr?: string, month: "short" | "long" = "short") {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month, year: "numeric" });
}

function blockText(block: PortableBlock) {
  return (block.children ?? []).map((c) => c.text ?? "").join("");
}

/** Minutes at 200 words a minute, from the real body text. */
export function readingMinutes(body?: PortableBlock[]) {
  const words = (body ?? [])
    .filter((b) => b._type === "block")
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Tidies how posts were typed into Sanity, for reading (the words are
 * unchanged):
 * - One post is a single block with paragraphs separated by blank lines and
 *   headings typed as bold lines. Split it into real paragraphs, and turn a
 *   paragraph that is only bold text into a heading.
 * - Posts use h5 for their section headings; render h4–h6 as h3.
 * - Drop empty paragraphs.
 */
export function normalizeBody(body?: PortableBlock[]): PortableBlock[] {
  const out: PortableBlock[] = [];

  for (const block of body ?? []) {
    if (block._type !== "block" || !block.children) {
      out.push(block);
      continue;
    }

    const style = block.style && /^h[4-6]$/.test(block.style) ? "h3" : block.style;
    const hasBreaks = !block.listItem && block.children.some((c) => /\n\s*\n/.test(c.text ?? ""));

    if (!hasBreaks) {
      if (blockText(block).trim() || block.listItem) out.push({ ...block, style });
      continue;
    }

    // Split the spans at each blank line into separate paragraphs.
    let current: NonNullable<PortableBlock["children"]> = [];
    let part = 0;
    const flush = () => {
      const text = current.map((c) => c.text ?? "").join("").trim();
      if (text) {
        const onlyBold = current
          .filter((c) => (c.text ?? "").trim())
          .every((c) => c.marks?.includes("strong"));
        const last = current.length - 1;
        const children = current.map((c, i) => ({
          ...c,
          _key: `${c._key}-${part}-${i}`,
          text: (c.text ?? "")
            .replace(i === 0 ? /^\s+/ : /$^/, "")
            .replace(i === last ? /\s+$/ : /$^/, ""),
          // A heading carries its own weight; drop the bold mark.
          marks: onlyBold ? (c.marks ?? []).filter((m) => m !== "strong") : c.marks,
        }));
        out.push({
          ...block,
          _key: `${block._key}-${part}`,
          style: onlyBold && text.length < 90 ? "h3" : style,
          children,
        });
        part += 1;
      }
      current = [];
    };

    for (const child of block.children) {
      const pieces = (child.text ?? "").split(/\n\s*\n/);
      pieces.forEach((piece, i) => {
        if (i > 0) flush();
        if (piece) current.push({ ...child, text: piece });
      });
    }
    flush();
  }

  return out;
}

/**
 * A Sanity image URL at a width, as WebP. Safe fallback to default
 * placeholder if asset is missing.
 */
export function imageUrl(source: any, width: number = 1200) {
  if (!source) return "/assets/images/og-blog.png";
  try {
    return urlFor(source).width(width).format("webp").url();
  } catch {
    return "/assets/images/og-blog.png";
  }
}
