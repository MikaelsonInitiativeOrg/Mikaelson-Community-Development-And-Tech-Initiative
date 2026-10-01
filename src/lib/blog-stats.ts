import { getDb } from "./db";

/**
 * Story stats: how many people saw a story, how many read it to the end,
 * and likes / dislikes. Each visitor counts once per story (an anonymous
 * random ID in a cookie; no names, emails or IP addresses are stored), so
 * refreshing a page never inflates the numbers. A visitor has at most one
 * reaction per story and can change or remove it.
 *
 * Without a database (local development), stats live in memory.
 */

export type Reaction = "like" | "dislike";
export type StoryStats = { views: number; reads: number; likes: number; dislikes: number; mine: Reaction | null };

type Mem = { seen: Set<string>; reactions: Map<string, Reaction> };
const mem = ((globalThis as { __mikaelsonBlogStats?: Mem }).__mikaelsonBlogStats ??= {
  seen: new Set(),
  reactions: new Map(),
});

let ready = false;
async function ensureTables() {
  const sql = getDb();
  if (!sql || ready) return sql;
  // One statement per call (Neon's HTTP driver).
  await sql`CREATE TABLE IF NOT EXISTS blog_views (
    post_id TEXT NOT NULL, visitor_id TEXT NOT NULL, kind TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, visitor_id, kind))`;
  await sql`CREATE TABLE IF NOT EXISTS blog_reactions (
    post_id TEXT NOT NULL, visitor_id TEXT NOT NULL, reaction TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, visitor_id))`;
  ready = true;
  return sql;
}

/** Counts a view or a read, once per visitor per story. */
export async function recordView(postId: string, visitorId: string, kind: "view" | "read") {
  const sql = await ensureTables();
  if (!sql) {
    mem.seen.add(`${postId}|${visitorId}|${kind}`);
    if (kind === "read") mem.seen.add(`${postId}|${visitorId}|view`);
    return;
  }
  await sql`INSERT INTO blog_views (post_id, visitor_id, kind) VALUES (${postId}, ${visitorId}, ${kind}) ON CONFLICT DO NOTHING`;
  // Anyone who read it also saw it.
  if (kind === "read") {
    await sql`INSERT INTO blog_views (post_id, visitor_id, kind) VALUES (${postId}, ${visitorId}, 'view') ON CONFLICT DO NOTHING`;
  }
}

/** Sets, changes or (with null) removes this visitor's reaction. */
export async function setReaction(postId: string, visitorId: string, reaction: Reaction | null) {
  const sql = await ensureTables();
  const key = `${postId}|${visitorId}`;
  if (!sql) {
    if (reaction) mem.reactions.set(key, reaction);
    else mem.reactions.delete(key);
    return;
  }
  if (reaction) {
    await sql`INSERT INTO blog_reactions (post_id, visitor_id, reaction) VALUES (${postId}, ${visitorId}, ${reaction})
      ON CONFLICT (post_id, visitor_id) DO UPDATE SET reaction = EXCLUDED.reaction, updated_at = NOW()`;
  } else {
    await sql`DELETE FROM blog_reactions WHERE post_id = ${postId} AND visitor_id = ${visitorId}`;
  }
}

export async function getStats(postId: string, visitorId?: string): Promise<StoryStats> {
  const sql = await ensureTables();
  if (!sql) {
    const count = (kind: string) => [...mem.seen].filter((k) => k.startsWith(`${postId}|`) && k.endsWith(`|${kind}`)).length;
    const reacts = [...mem.reactions].filter(([k]) => k.startsWith(`${postId}|`)).map(([, r]) => r);
    return {
      views: count("view"),
      reads: count("read"),
      likes: reacts.filter((r) => r === "like").length,
      dislikes: reacts.filter((r) => r === "dislike").length,
      mine: (visitorId && mem.reactions.get(`${postId}|${visitorId}`)) || null,
    };
  }
  const [v] = (await sql`SELECT
      COUNT(*) FILTER (WHERE kind = 'view')::int AS views,
      COUNT(*) FILTER (WHERE kind = 'read')::int AS reads
    FROM blog_views WHERE post_id = ${postId}`) as { views: number; reads: number }[];
  const [r] = (await sql`SELECT
      COUNT(*) FILTER (WHERE reaction = 'like')::int AS likes,
      COUNT(*) FILTER (WHERE reaction = 'dislike')::int AS dislikes
    FROM blog_reactions WHERE post_id = ${postId}`) as { likes: number; dislikes: number }[];
  let mine: Reaction | null = null;
  if (visitorId) {
    const m = (await sql`SELECT reaction FROM blog_reactions WHERE post_id = ${postId} AND visitor_id = ${visitorId}`) as {
      reaction: Reaction;
    }[];
    mine = m[0]?.reaction ?? null;
  }
  return { views: v?.views ?? 0, reads: v?.reads ?? 0, likes: r?.likes ?? 0, dislikes: r?.dislikes ?? 0, mine };
}

/** Every story's totals, for the Studio. */
export async function getAllStats(): Promise<Record<string, Omit<StoryStats, "mine">>> {
  const sql = await ensureTables();
  const out: Record<string, Omit<StoryStats, "mine">> = {};
  const bump = (id: string, field: keyof Omit<StoryStats, "mine">, n: number) => {
    out[id] ??= { views: 0, reads: 0, likes: 0, dislikes: 0 };
    out[id][field] += n;
  };
  if (!sql) {
    for (const k of mem.seen) {
      const [id, , kind] = k.split("|");
      bump(id, kind === "read" ? "reads" : "views", 1);
    }
    for (const [k, r] of mem.reactions) bump(k.split("|")[0], r === "like" ? "likes" : "dislikes", 1);
    return out;
  }
  const views = (await sql`SELECT post_id, kind, COUNT(*)::int AS n FROM blog_views GROUP BY post_id, kind`) as {
    post_id: string;
    kind: string;
    n: number;
  }[];
  for (const row of views) bump(row.post_id, row.kind === "read" ? "reads" : "views", row.n);
  const reacts = (await sql`SELECT post_id, reaction, COUNT(*)::int AS n FROM blog_reactions GROUP BY post_id, reaction`) as {
    post_id: string;
    reaction: string;
    n: number;
  }[];
  for (const row of reacts) bump(row.post_id, row.reaction === "like" ? "likes" : "dislikes", row.n);
  return out;
}

/** Removes a story's stats (when the story is deleted). */
export async function deleteStats(postId?: string) {
  const sql = await ensureTables();
  if (!sql) {
    for (const k of [...mem.seen]) if (!postId || k.startsWith(`${postId}|`)) mem.seen.delete(k);
    for (const k of [...mem.reactions.keys()]) if (!postId || k.startsWith(`${postId}|`)) mem.reactions.delete(k);
    return;
  }
  if (postId) {
    await sql`DELETE FROM blog_views WHERE post_id = ${postId}`;
    await sql`DELETE FROM blog_reactions WHERE post_id = ${postId}`;
  } else {
    await sql`DELETE FROM blog_views`;
    await sql`DELETE FROM blog_reactions`;
  }
}
