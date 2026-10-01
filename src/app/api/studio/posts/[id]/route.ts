import { NextRequest, NextResponse } from "next/server";
import { isStudioRequest } from "@/lib/studio-auth";
import { deletePost, updatePost } from "@/lib/blog";


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isStudioRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const data = await request.json();

    const updated = await updatePost(decodedId, data);
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
  if (!isStudioRequest(request)) {
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
