import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PASSKEY = "mikaelson2026";

function getExpectedPasskey(): string {
  return process.env.STUDIO_ADMIN_PASSKEY || DEFAULT_PASSKEY;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("studio_auth_token")?.value;
  const expected = getExpectedPasskey();

  if (token && token === expected) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const { passkey } = await request.json();
    const expected = getExpectedPasskey();

    if (!passkey || passkey.trim() !== expected) {
      return NextResponse.json(
        { error: "Invalid team passkey. Please check and try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    // Set 30-day session cookie
    response.cookies.set("studio_auth_token", expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("studio_auth_token");
  return response;
}
