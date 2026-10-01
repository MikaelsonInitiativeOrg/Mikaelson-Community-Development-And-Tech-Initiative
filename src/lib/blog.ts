import { getDb } from "./db";
import { fetchSanityStories } from "./sanity-import";
import { revalidatePath } from "next/cache";
import type { Post } from "@/features/website/pages/blog/posts";

export type { Post };

// Without a database (local development with no DATABASE_URL), posts live
// in this process's memory so the Studio can still be tried out. On the
// live site that would silently lose posts, so writes refuse instead
// (requireWritableStore).
// Kept on globalThis so every part of the dev server (the Studio's API
// routes and the pages) shares one list.
const mem = ((globalThis as { __mikaelsonBlogMemory?: { posts: Post[] } }).__mikaelsonBlogMemory ??= { posts: [] });

let tableInitialized = false;

/** In production, never pretend to save: a missing database is an error. */
function requireWritableStore() {
  if (!getDb() && process.env.NODE_ENV === "production") {
    throw new Error(
      "The blog database isn't connected (DATABASE_URL is missing on the server), so the story wasn't saved.",
    );
  }
}

export async function ensureTable() {
  if (tableInitialized) return;
  const sql = getDb();
  if (!sql) {
    tableInitialized = true;
    return;
  }

  try {
    // One statement per call: Neon's HTTP driver runs a single command per query.
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        cover_image TEXT,
        cover_image_fit TEXT DEFAULT 'contain',
        author_name TEXT NOT NULL DEFAULT 'Mikaelson Initiative',
        author_role TEXT DEFAULT 'Contributor',
        author_avatar TEXT,
        body TEXT NOT NULL,
        published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        show_as_popup BOOLEAN NOT NULL DEFAULT FALSE,
        status TEXT NOT NULL DEFAULT 'published',
        seo_title TEXT,
        seo_description TEXT
      )`;
    await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image_fit TEXT DEFAULT 'contain'`;
    // Permanently remove the old sample posts, if an earlier version saved them.
    await sql`DELETE FROM blog_posts WHERE id IN ('seed-post-1', 'seed-post-2', 'seed-post-3')`;
    await sql`CREATE TABLE IF NOT EXISTS blog_meta (key TEXT PRIMARY KEY, value TEXT, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    tableInitialized = true;
  } catch (err) {
    console.error("Failed to initialize blog_posts table in Neon:", err);
    return;
  }

  await importSanityStoriesOnce();
}

/**
 * Copies the original Sanity stories into the database, exactly once ever.
 * Claiming the "sanity_import" row first means only one server instance
 * imports, and a story deleted later in the Studio never comes back.
 * Stories whose slug is already taken are skipped, not overwritten.
 */
async function importSanityStoriesOnce() {
  const sql = getDb();
  if (!sql) return;
  try {
    const claimed = (await sql`
      INSERT INTO blog_meta (key, value) VALUES ('sanity_import', 'running')
      ON CONFLICT (key) DO NOTHING RETURNING key`) as unknown[];
    if (!claimed.length) return;

    try {
      const stories = await fetchSanityStories();
      for (const s of stories) {
        await sql`
          INSERT INTO blog_posts (
            id, title, slug, category, excerpt, cover_image, cover_image_fit,
            author_name, author_role, body, published_at, updated_at, show_as_popup, status
          ) VALUES (
            ${`sanity_${s.sanityId}`}, ${s.title}, ${s.slug}, ${s.category}, ${s.excerpt},
            ${s.coverImage ?? null}, 'cover', 'Mikaelson Initiative', 'Contributor', ${s.body},
            ${s.publishedAt}, NOW(), FALSE, 'published'
          )
          ON CONFLICT DO NOTHING`;
      }
      await sql`UPDATE blog_meta SET value = ${`done: ${stories.length} stories`}, updated_at = NOW() WHERE key = 'sanity_import'`;
    } catch (err) {
      // Release the claim so a later request can try again.
      await sql`DELETE FROM blog_meta WHERE key = 'sanity_import'`;
      throw err;
    }
  } catch (err) {
    console.error("Importing the original Sanity stories failed:", err);
  }
}

function rowToPost(row: any): Post {
  return {
    _id: row.id,
    title: row.title,
    slug: { current: row.slug },
    category: row.category,
    excerpt: row.excerpt,
    coverImage: row.cover_image,
    coverImageFit: (row.cover_image_fit as "contain" | "cover" | "top") || "contain",
    author: {
      name: row.author_name || "Mikaelson Initiative",
      role: row.author_role || undefined,
      avatar: row.author_avatar || undefined,
    },
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : undefined,
    _updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    showAsPopup: Boolean(row.show_as_popup),
    status: row.status as "published" | "draft",
    body: row.body,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

export async function getAllPosts(includeDrafts = false): Promise<Post[]> {
  const sql = getDb();
  if (!sql) {
    return mem.posts.filter((p) => includeDrafts || p.status === "published");
  }

  await ensureTable();

  try {
    const rows = includeDrafts
      ? await sql`SELECT * FROM blog_posts ORDER BY published_at DESC;`
      : await sql`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC;`;

    return (rows as any[]).map(rowToPost);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    return mem.posts.filter((p) => includeDrafts || p.status === "published");
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const cleanSlug = decodeURIComponent(slug || "").trim();
  const lowerSlug = cleanSlug.toLowerCase();

  const sql = getDb();
  if (!sql) {
    return (
      mem.posts.find(
        (p) =>
          p.slug.current.toLowerCase() === lowerSlug ||
          p.slug.current === cleanSlug ||
          p.slug.current === slug ||
          p._id === cleanSlug ||
          p._id === slug
      ) || null
    );
  }

  await ensureTable();

  try {
    const rows = (await sql`
      SELECT * FROM blog_posts 
      WHERE LOWER(slug) = ${lowerSlug} 
         OR slug = ${cleanSlug} 
         OR slug = ${slug}
         OR id = ${cleanSlug}
         OR id = ${slug}
      LIMIT 1;
    `) as any[];

    if (!rows || rows.length === 0) return null;
    return rowToPost(rows[0]);
  } catch (err) {
    console.error("Error fetching post by slug:", err);
    return (
      mem.posts.find(
        (p) =>
          p.slug.current.toLowerCase() === lowerSlug ||
          p.slug.current === cleanSlug ||
          p.slug.current === slug ||
          p._id === cleanSlug ||
          p._id === slug
      ) || null
    );
  }
}

export async function getPopupPost(): Promise<Post | null> {
  const sql = getDb();
  if (!sql) {
    const published = mem.posts.filter((p) => p.status === "published");
    return published.find((p) => p.showAsPopup) || published[0] || null;
  }

  await ensureTable();

  try {
    const rows = (await sql`
      SELECT * FROM blog_posts
      WHERE status = 'published'
      ORDER BY show_as_popup DESC, published_at DESC
      LIMIT 1;
    `) as any[];

    if (!rows || rows.length === 0) return null;
    return rowToPost(rows[0]);
  } catch (err) {
    console.error("Error fetching popup post:", err);
    return mem.posts.find((p) => p.status === "published") || null;
  }
}

export async function getAllPostSlugs(): Promise<{ slug: string; publishedAt?: string; _updatedAt?: string }[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({
    slug: p.slug.current,
    publishedAt: p.publishedAt,
    _updatedAt: p._updatedAt,
  }));
}

export async function createPost(postData: Omit<Post, "_id">): Promise<Post> {
  requireWritableStore();
  const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const slug = postData.slug.current.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const newPost: Post = {
    ...postData,
    _id: id,
    slug: { current: slug },
    publishedAt: postData.publishedAt || new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    status: postData.status || "published",
  };

  const sql = getDb();
  if (sql) {
    await ensureTable();

    // If this post is set as popup, unmark previous ones
    if (newPost.showAsPopup) {
      await sql`UPDATE blog_posts SET show_as_popup = FALSE WHERE id != ${id};`;
    }

    await sql`
      INSERT INTO blog_posts (
        id, title, slug, category, excerpt, cover_image, cover_image_fit,
        author_name, author_role, author_avatar, body,
        published_at, updated_at, show_as_popup, status,
        seo_title, seo_description
      ) VALUES (
        ${newPost._id}, ${newPost.title}, ${newPost.slug.current}, ${newPost.category || "General"},
        ${newPost.excerpt || ""}, ${newPost.coverImage || null}, ${newPost.coverImageFit || "contain"},
        ${newPost.author?.name || "Mikaelson Initiative"},
        ${newPost.author?.role || "Contributor"},
        ${newPost.author?.avatar || null},
        ${newPost.body || ""},
        ${newPost.publishedAt},
        ${newPost._updatedAt},
        ${Boolean(newPost.showAsPopup)},
        ${newPost.status || "published"},
        ${newPost.seoTitle || null},
        ${newPost.seoDescription || null}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        excerpt = EXCLUDED.excerpt,
        cover_image = EXCLUDED.cover_image,
        cover_image_fit = EXCLUDED.cover_image_fit,
        author_name = EXCLUDED.author_name,
        author_role = EXCLUDED.author_role,
        author_avatar = EXCLUDED.author_avatar,
        body = EXCLUDED.body,
        updated_at = EXCLUDED.updated_at,
        show_as_popup = EXCLUDED.show_as_popup,
        status = EXCLUDED.status,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description;
    `;
  } else {
    if (newPost.showAsPopup) {
      mem.posts.forEach((p) => (p.showAsPopup = false));
    }
    mem.posts.unshift(newPost);
  }

  // Invalidate paths for instant updates across the website
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");

  return newPost;
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
  requireWritableStore();
  const sql = getDb();
  const now = new Date().toISOString();

  if (sql) {
    await ensureTable();

    if (postData.showAsPopup) {
      await sql`UPDATE blog_posts SET show_as_popup = FALSE WHERE id != ${id};`;
    }

    const rows = (await sql`
      UPDATE blog_posts
      SET
        title = COALESCE(${postData.title ?? null}, title),
        slug = COALESCE(${postData.slug?.current ?? null}, slug),
        category = COALESCE(${postData.category ?? null}, category),
        excerpt = COALESCE(${postData.excerpt ?? null}, excerpt),
        cover_image = COALESCE(${postData.coverImage ?? null}, cover_image),
        cover_image_fit = COALESCE(${postData.coverImageFit ?? null}, cover_image_fit),
        author_name = COALESCE(${postData.author?.name ?? null}, author_name),
        author_role = COALESCE(${postData.author?.role ?? null}, author_role),
        author_avatar = COALESCE(${postData.author?.avatar ?? null}, author_avatar),
        body = COALESCE(${postData.body ?? null}, body),
        show_as_popup = COALESCE(${postData.showAsPopup ?? null}, show_as_popup),
        status = COALESCE(${postData.status ?? null}, status),
        seo_title = COALESCE(${postData.seoTitle ?? null}, seo_title),
        seo_description = COALESCE(${postData.seoDescription ?? null}, seo_description),
        updated_at = ${now}
      WHERE id = ${id} OR slug = ${id}
      RETURNING *;
    `) as any[];

    if (!rows || rows.length === 0) return null;
    const updated = rowToPost(rows[0]);

    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug.current}`);
    revalidatePath("/");
    revalidatePath("/feed.xml");
    revalidatePath("/sitemap.xml");

    return updated;
  } else {
    const idx = mem.posts.findIndex((p) => p._id === id || p.slug.current === id);
    if (idx === -1) return null;

    if (postData.showAsPopup) {
      mem.posts.forEach((p) => (p.showAsPopup = false));
    }

    mem.posts[idx] = {
      ...mem.posts[idx],
      ...postData,
      _updatedAt: now,
    };

    revalidatePath("/blog");
    revalidatePath(`/blog/${mem.posts[idx].slug.current}`);
    revalidatePath("/");
    revalidatePath("/feed.xml");
    revalidatePath("/sitemap.xml");

    return mem.posts[idx];
  }
}

export async function deletePost(id: string): Promise<boolean> {
  requireWritableStore();
  const sql = getDb();
  if (sql) {
    await ensureTable();
    await sql`DELETE FROM blog_posts WHERE id = ${id} OR slug = ${id};`;
  }
  mem.posts = mem.posts.filter((p) => p._id !== id && p.slug?.current !== id);

  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  revalidatePath("/");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");

  return true;
}

export async function deleteAllPosts(): Promise<boolean> {
  requireWritableStore();
  const sql = getDb();
  if (sql) {
    await ensureTable();
    await sql`DELETE FROM blog_posts;`;
  }
  mem.posts = [];

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");

  return true;
}
