import { NextRequest, NextResponse } from "next/server";
import { deletePost, updatePost } from "@/lib/blog";

function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get("studio_auth_token")?.value;
  const expected = process.env.STUDIO_ADMIN_PASSKEY || "mikaelson2026";
  return token === expected;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();

    const updated = await updatePost(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (err: any) {
    console.error("Studio update post error:", err);
    return NextResponse.json({ error: err.message || "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    await deletePost(decodedId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Studio delete post error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete post" }, { status: 500 });
  }
}
