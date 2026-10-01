import { NextRequest, NextResponse } from "next/server";
import { isStudioRequest } from "@/lib/studio-auth";
import { createPost, deleteAllPosts, getAllPosts } from "@/lib/blog";
import { getAllStats } from "@/lib/blog-stats";


export async function GET(request: NextRequest) {
  if (!isStudioRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getAllPosts(true); // include drafts
    // Each story's seen / read / like / dislike totals, for the team.
    const stats = await getAllStats().catch(() => ({}));
    return NextResponse.json({ posts, stats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isStudioRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const rawSlug = typeof data.slug === "string" ? data.slug : data.slug?.current;
    const slugBase = (rawSlug && rawSlug.trim()) || data.title || `story-${Date.now()}`;
    const slug = String(slugBase)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost = await createPost({
      title: data.title.trim(),
      slug: { current: slug },
      category: data.category?.trim() || "General",
      excerpt: data.excerpt?.trim() || "",
      coverImage: data.coverImage?.trim() || undefined,
      coverImageFit: data.coverImageFit || "contain",
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

export async function DELETE(request: NextRequest) {
  if (!isStudioRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteAllPosts();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Studio clear all posts error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete all posts" }, { status: 500 });
  }
}
