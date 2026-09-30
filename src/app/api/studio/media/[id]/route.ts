import { NextRequest, NextResponse } from "next/server";
import { getMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const media = await getMedia(id);

    if (!media) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    // Convert Buffer to Uint8Array for NextResponse body
    const body = new Uint8Array(media.buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": media.mimeType || "image/png",
        "Content-Length": media.buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("Error serving media:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
