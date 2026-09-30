import { NextRequest, NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/blog";

function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get("studio_auth_token")?.value;
  const expected = process.env.STUDIO_ADMIN_PASSKEY || "mikaelson2026";
  return token === expected;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getAllPosts(true); // include drafts
    return NextResponse.json({ posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slugStr = data.slug?.current || data.slug || data.title;
    const slug = slugStr
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost = await createPost({
      title: data.title.trim(),
      slug: { current: slug },
      category: data.category?.trim() || "General",
      excerpt: data.excerpt?.trim() || "",
      coverImage: data.coverImage?.trim() || "/assets/images/community-1.png",
      author: {
        name: data.author?.name?.trim() || "Mikaelson Initiative",
        role: data.author?.role?.trim() || "Contributor",
        avatar: data.author?.avatar?.trim() || undefined,
      },
      publishedAt: data.publishedAt || new Date().toISOString(),
      showAsPopup: Boolean(data.showAsPopup),
      status: data.status || "published",
      body: data.body || "",
      seoTitle: data.seoTitle?.trim() || undefined,
      seoDescription: data.seoDescription?.trim() || undefined,
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err: any) {
    console.error("Studio create post error:", err);
    return NextResponse.json({ error: err.message || "Failed to create post" }, { status: 500 });
  }
}
