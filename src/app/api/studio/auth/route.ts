import { NextRequest, NextResponse } from "next/server";
import {
  STUDIO_COOKIE,
  STUDIO_SESSION_SECONDS,
  checkPasskey,
  isStudioConfigured,
  isStudioRequest,
  sessionToken,
} from "@/lib/studio-auth";

export async function GET(request: NextRequest) {
  if (isStudioRequest(request)) return NextResponse.json({ authenticated: true });
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  if (!isStudioConfigured()) {
    return NextResponse.json(
      { error: "The Studio isn't set up yet: STUDIO_ADMIN_PASSKEY is missing on the server." },
      { status: 503 },
    );
  }
  try {
    const { passkey } = await request.json();
    if (!checkPasskey(passkey)) {
      return NextResponse.json({ error: "Invalid team passkey. Please check and try again." }, { status: 401 });
    }
    const response = NextResponse.json({ success: true });
    // A 30-day session: the cookie holds a token derived from the passkey, not the passkey.
    response.cookies.set(STUDIO_COOKIE, sessionToken() as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: STUDIO_SESSION_SECONDS,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(STUDIO_COOKIE);
  return response;
}
