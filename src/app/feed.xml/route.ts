import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import type { Post } from "@/features/website/pages/blog/posts";

export const revalidate = 60;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikaelsoninitiative.org";

  let posts: Post[] = [];
  try {
    posts = await getAllPosts();
  } catch {
    posts = [];
  }

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug.current}`;
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
      const category = post.category ? `<category>${escapeXml(post.category)}</category>` : "";
      const description = post.excerpt ? `<![CDATA[${post.excerpt}]]>` : "";

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${category}
      <description>${description}</description>
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mikaelson Initiative Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Articles on leadership, personal development, and student growth across Africa from the Mikaelson Initiative.</description>
    <language>en-NG</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
