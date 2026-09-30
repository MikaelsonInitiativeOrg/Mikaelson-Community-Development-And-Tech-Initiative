import { getDb } from "./db";
import { revalidatePath } from "next/cache";
import type { Post } from "@/features/website/pages/blog/posts";

export type { Post };

// Initial seed posts to ensure the site is never blank when setting up a fresh database
const SEED_POSTS: Post[] = [
  {
    _id: "seed-post-1",
    title: "How We Build Daily Discipline in African Classrooms",
    slug: { current: "how-we-build-daily-discipline" },
    category: "Communities",
    excerpt:
      "A deep dive into the morning accountability circles inside the Mikaelson School Club and how student routines spark generational leadership.",
    coverImage: "/assets/images/community-1.png",
    author: {
      name: "Michael Segun",
      role: "Initiative Lead",
      avatar: "/assets/images/team/michael.png",
    },
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    _updatedAt: new Date().toISOString(),
    showAsPopup: true,
    status: "published",
    body: `### The Power of 15 Minutes

Every morning before academic periods commence, students in our partner schools gather in circles of eight. There is no lecture, no grading, and no lecturing adult. Instead, there is a student peer facilitator and an accountability sheet.

Each student states three things:
1. What habit they stayed true to yesterday.
2. Where their discipline slipped and why.
3. The singular pledge they are making for today.

> "Discipline is not an innate gift given to a chosen few; it is a muscle exercised in small, transparent daily steps."

### Why Peer Circles Work

When an adult tells a teenager to study or cultivate focus, it is often received as discipline from above. But when a student sees their desk mate admit to staying up scrolling on their phone and making a commitment to turn it off at 9 PM tonight, the dynamic shifts completely.

In our first pilot across three secondary schools:
- Over 84% of participating students completed their weekly academic targets without parental reminders.
- Punctuality across participating classes improved by 62%.
- Teachers reported a noticeable drop in classroom disruptions.

### Looking Ahead

As we expand the Mikaelson School Club ecosystem, our mission remains grounded: creating environments where African students realize that greatness is not an accident—it is daily practice.`,
  },
  {
    _id: "seed-post-2",
    title: "Building Real-World Tech at Mikaelson Labs",
    slug: { current: "building-real-world-tech-mikaelson-labs" },
    category: "Innovation",
    excerpt:
      "Why we teach African students to build software that solves local community challenges rather than generic classroom homework.",
    coverImage: "/assets/images/community-2.png",
    author: {
      name: "Mikaelson Labs Team",
      role: "Innovation Fellows",
    },
    publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    _updatedAt: new Date().toISOString(),
    showAsPopup: false,
    status: "published",
    body: `### Moving Beyond "Hello World"

Traditional computer science education in many schools focuses heavily on memorizing syntax for exams. Students learn loop definitions on paper, yet struggle to build a usable tool for their local clinic or marketplace.

At Mikaelson Labs, we flipped the curriculum upside down.

### Project-Based Immersion

From day one, students are organized into engineering squads tasked with identifying problems right in their neighborhoods:
- Digital tracking for local community blood donation drives.
- SMS-based lesson revision bots for schools with limited internet access.
- Solar energy monitoring dashboards for community study centers.

> "When young minds build for people they personally know and care about, code transforms from abstract text into active problem-solving."

Students learn Git version control, collaborative code reviews, accessibility standards, and deployment pipelines. The result? Confident builders who see technology as their instrument for community change.`,
  },
  {
    _id: "seed-post-3",
    title: "The African Studies Initiative: Reclaiming Our Intellectual Heritage",
    slug: { current: "african-studies-reclaiming-intellectual-heritage" },
    category: "African Studies",
    excerpt:
      "Why understanding African historical systems of governance, philosophy, and collective ethics is essential for tomorrow's leaders.",
    coverImage: "/assets/images/hero-1.png",
    author: {
      name: "Mikaelson Research Group",
      role: "African Studies Research",
    },
    publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    _updatedAt: new Date().toISOString(),
    showAsPopup: false,
    status: "published",
    body: `### Grounded in Who We Are

True leadership cannot exist in a vacuum. For African youth to lead with conviction on the global stage, they must know where they come from.

Too often, history curricula begin and end with external colonial encounters, skipping centuries of sophisticated African governance, indigenous mathematics, architectural wonders, and communal ethical frameworks like Ubuntu and Omoluabi.

### What We Are Cultivating

Through the Mikaelson Institute for African Studies, we are curating open, accessible multimedia curricula that pair:
- Classical African philosophical systems of character (Omoluabi, Ma'at, Ubuntu).
- Critical historical case studies of pre-colonial innovation and trade routes.
- Practical leadership workshops exploring modern applications of collective responsibility.

We believe that when students understand the intellectual depth of their heritage, their sense of purpose multiplies exponentially.`,
  },
];

// In-memory fallback cache when running locally without DATABASE_URL
let inMemoryPosts: Post[] = [...SEED_POSTS];

let tableInitialized = false;

export async function ensureTable() {
  if (tableInitialized) return;
  const sql = getDb();
  if (!sql) {
    tableInitialized = true;
    return;
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        cover_image TEXT,
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
      );
    `;

    // Check if table is empty, seed if empty
    const countResult = (await sql`SELECT COUNT(*) as count FROM blog_posts;`) as any[];
    const count = parseInt(countResult[0]?.count || "0", 10);

    if (count === 0) {
      for (const p of SEED_POSTS) {
        await sql`
          INSERT INTO blog_posts (
            id, title, slug, category, excerpt, cover_image,
            author_name, author_role, author_avatar, body,
            published_at, updated_at, show_as_popup, status
          ) VALUES (
            ${p._id}, ${p.title}, ${p.slug.current}, ${p.category || "General"}, ${p.excerpt || ""},
            ${p.coverImage || null}, ${p.author?.name || "Mikaelson Initiative"},
            ${p.author?.role || "Contributor"}, ${p.author?.avatar || null}, ${p.body || ""},
            ${p.publishedAt || new Date().toISOString()}, ${p._updatedAt || new Date().toISOString()},
            ${p.showAsPopup || false}, ${p.status || "published"}
          ) ON CONFLICT (slug) DO NOTHING;
        `;
      }
    }

    tableInitialized = true;
  } catch (err) {
    console.error("Failed to initialize blog_posts table in Neon:", err);
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
    return inMemoryPosts.filter((p) => includeDrafts || p.status === "published");
  }

  await ensureTable();

  try {
    const rows = includeDrafts
      ? await sql`SELECT * FROM blog_posts ORDER BY published_at DESC;`
      : await sql`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC;`;

    return (rows as any[]).map(rowToPost);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    return inMemoryPosts.filter((p) => includeDrafts || p.status === "published");
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const sql = getDb();
  if (!sql) {
    return inMemoryPosts.find((p) => p.slug.current === slug) || null;
  }

  await ensureTable();

  try {
    const rows = (await sql`
      SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1;
    `) as any[];

    if (!rows || rows.length === 0) return null;
    return rowToPost(rows[0]);
  } catch (err) {
    console.error("Error fetching post by slug:", err);
    return inMemoryPosts.find((p) => p.slug.current === slug) || null;
  }
}

export async function getPopupPost(): Promise<Post | null> {
  const sql = getDb();
  if (!sql) {
    const featured = inMemoryPosts.find((p) => p.showAsPopup && p.status === "published");
    return featured || inMemoryPosts[0] || null;
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
    return inMemoryPosts[0] || null;
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
        id, title, slug, category, excerpt, cover_image,
        author_name, author_role, author_avatar, body,
        published_at, updated_at, show_as_popup, status,
        seo_title, seo_description
      ) VALUES (
        ${newPost._id}, ${newPost.title}, ${newPost.slug.current}, ${newPost.category || "General"},
        ${newPost.excerpt || ""}, ${newPost.coverImage || null},
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
      );
    `;
  } else {
    if (newPost.showAsPopup) {
      inMemoryPosts.forEach((p) => (p.showAsPopup = false));
    }
    inMemoryPosts.unshift(newPost);
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
        author_name = COALESCE(${postData.author?.name ?? null}, author_name),
        author_role = COALESCE(${postData.author?.role ?? null}, author_role),
        author_avatar = COALESCE(${postData.author?.avatar ?? null}, author_avatar),
        body = COALESCE(${postData.body ?? null}, body),
        show_as_popup = COALESCE(${postData.showAsPopup ?? null}, show_as_popup),
        status = COALESCE(${postData.status ?? null}, status),
        seo_title = COALESCE(${postData.seoTitle ?? null}, seo_title),
        seo_description = COALESCE(${postData.seoDescription ?? null}, seo_description),
        updated_at = ${now}
      WHERE id = ${id}
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
    const idx = inMemoryPosts.findIndex((p) => p._id === id);
    if (idx === -1) return null;

    if (postData.showAsPopup) {
      inMemoryPosts.forEach((p) => (p.showAsPopup = false));
    }

    inMemoryPosts[idx] = {
      ...inMemoryPosts[idx],
      ...postData,
      _updatedAt: now,
    };

    revalidatePath("/blog");
    revalidatePath(`/blog/${inMemoryPosts[idx].slug.current}`);
    revalidatePath("/");
    revalidatePath("/feed.xml");
    revalidatePath("/sitemap.xml");

    return inMemoryPosts[idx];
  }
}

export async function deletePost(id: string): Promise<boolean> {
  const sql = getDb();
  if (sql) {
    await ensureTable();
    await sql`DELETE FROM blog_posts WHERE id = ${id};`;
  } else {
    inMemoryPosts = inMemoryPosts.filter((p) => p._id !== id);
  }

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");

  return true;
}
