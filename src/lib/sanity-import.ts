/**
 * One-time import of the original blog stories from Sanity into the blog
 * database. The blog moved from Sanity to the Studio's Postgres table, and
 * the three stories already written in Sanity were never copied across.
 *
 * Sanity's public CDN API is read directly (the dataset is public, so no
 * token is needed). Story bodies are Portable Text; they are converted to
 * the Markdown-style text the blog's ArticleBody renders (## / ### headings,
 * > quotes, - and 1. lists, **bold**, *italic*, [links](url), ![images](url)).
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "zhokelqs";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

type Span = { _type: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
type Block = {
  _type: string;
  style?: string;
  listItem?: "bullet" | "number";
  children?: Span[];
  markDefs?: MarkDef[];
  asset?: { _ref?: string };
  alt?: string;
};

export type ImportedStory = {
  sanityId: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  body: string;
};

/** image-<id>-<w>x<h>-<ext> → the Sanity CDN URL. */
export function sanityImageUrl(ref?: string): string | undefined {
  const m = ref?.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  return m ? `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${m[1]}-${m[2]}.${m[3]}` : undefined;
}

function spansToText(block: Block): string {
  const links = new Map((block.markDefs ?? []).map((d) => [d._key, d]));
  return (block.children ?? [])
    .map((span) => {
      let t = span.text ?? "";
      if (!t.trim()) return t;
      for (const mark of span.marks ?? []) {
        if (mark === "strong") t = `**${t}**`;
        else if (mark === "em") t = `*${t}*`;
        else if (mark === "code") t = `\`${t}\``;
        else if (links.get(mark)?.href) t = `[${t}](${links.get(mark)!.href})`;
      }
      return t;
    })
    .join("")
    .trim();
}

/** Portable Text → the blog's Markdown-style body. */
export function portableTextToMarkdown(blocks: Block[] = []): string {
  const out: string[] = [];
  let list: string[] = [];
  let listKind: Block["listItem"] | null = null;
  const flush = () => {
    if (list.length) out.push(list.join("\n"));
    list = [];
    listKind = null;
  };

  for (const b of blocks) {
    if (b._type === "image") {
      flush();
      const url = sanityImageUrl(b.asset?._ref);
      if (url) out.push(`![${b.alt ?? ""}](${url})`);
      continue;
    }
    if (b._type !== "block") continue;
    const text = spansToText(b);
    if (!text) continue;

    if (b.listItem) {
      if (listKind && listKind !== b.listItem) flush();
      listKind = b.listItem;
      list.push(`${b.listItem === "number" ? `${list.length + 1}.` : "-"} ${text}`);
      continue;
    }
    flush();
    const style = b.style ?? "normal";
    if (style === "h1" || style === "h2") out.push(`## ${text}`);
    else if (/^h[3-6]$/.test(style)) out.push(`### ${text}`);
    else if (style === "blockquote") out.push(`> ${text}`);
    else out.push(text);
  }
  flush();
  return out.join("\n\n");
}

const QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, category, excerpt, publishedAt, _createdAt, coverImage, mainImage, body
}`;

export async function fetchSanityStories(): Promise<ImportedStory[]> {
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
  const data = (await res.json()) as { result?: Record<string, any>[] };
  return (data.result ?? []).map((p) => ({
    sanityId: p._id,
    title: String(p.title ?? "").trim(),
    slug: String(p.slug),
    category: p.category?.trim() || "General",
    excerpt: p.excerpt?.trim() || "",
    coverImage: sanityImageUrl((p.coverImage ?? p.mainImage)?.asset?._ref),
    publishedAt: p.publishedAt || p._createdAt || new Date().toISOString(),
    body: portableTextToMarkdown(p.body),
  }));
}
