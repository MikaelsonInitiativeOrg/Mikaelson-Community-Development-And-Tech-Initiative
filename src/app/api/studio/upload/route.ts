import { NextRequest, NextResponse } from "next/server";
import { saveMedia } from "@/lib/media";

function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get("studio_auth_token")?.value;
  const expected = process.env.STUDIO_ADMIN_PASSKEY || "mikaelson2026";
  return token === expected;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Verify it's an image
    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images (PNG, JPEG, WebP, GIF, SVG) are allowed." },
        { status: 400 }
      );
    }

    // Max 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image file is too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await saveMedia({
      filename: file.name || "uploaded-image.png",
      mimeType: file.type || "image/png",
      buffer,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}
