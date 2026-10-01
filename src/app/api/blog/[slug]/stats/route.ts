import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/blog";
import { getStats, recordView, setReaction, type StoryStats } from "@/lib/blog-stats";

/**
 * A story's stats. GET returns the counts (and this visitor's reaction);
 * POST records an action: "view", "read", "like", "dislike" or "clear"
 * (remove my reaction). Visitors are an anonymous random ID in a cookie,
 * so each person counts once per story. Bots are never counted.
 *
 * The dislike count is not public (it is shown to the team in the
 * Studio); set PUBLIC_DISLIKES to true to show it under stories.
 */

const PUBLIC_DISLIKES = false;
const COOKIE = "mk_vid";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse|headless/i;

function publicStats(s: StoryStats) {
  return PUBLIC_DISLIKES ? s : { ...s, dislikes: null };
}

async function published(slug: string) {
  const post = await getPostBySlug(slug);
  return post && post.status === "published" ? post : null;
}

function visitor(request: NextRequest) {
  const existing = request.cookies.get(COOKIE)?.value;
  return existing && /^[a-f0-9-]{36}$/.test(existing) ? { id: existing, isNew: false } : { id: randomUUID(), isNew: true };
}

function withVisitor(res: NextResponse, v: { id: string; isNew: boolean }) {
  if (v.isNew) {
    res.cookies.set(COOKIE, v.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return res;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const post = await published(decodeURIComponent((await params).slug));
  if (!post) return NextResponse.json({ error: "Story not found" }, { status: 404 });
  const v = visitor(request);
  const stats = await getStats(post._id, v.isNew ? undefined : v.id);
  return withVisitor(NextResponse.json(publicStats(stats)), v);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const post = await published(decodeURIComponent((await params).slug));
  if (!post) return NextResponse.json({ error: "Story not found" }, { status: 404 });

  let action: unknown;
  try {
    ({ action } = await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!["view", "read", "like", "dislike", "clear"].includes(action as string)) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const v = visitor(request);
  const isBot = BOT.test(request.headers.get("user-agent") ?? "");
  if (!isBot) {
    if (action === "view" || action === "read") await recordView(post._id, v.id, action);
    else await setReaction(post._id, v.id, action === "clear" ? null : (action as "like" | "dislike"));
  }
  const stats = await getStats(post._id, v.id);
  return withVisitor(NextResponse.json(publicStats(stats)), v);
}
