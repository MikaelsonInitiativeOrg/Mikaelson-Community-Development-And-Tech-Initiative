import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Studio sign-in. The team passkey lives only in STUDIO_ADMIN_PASSKEY (set
 * it in the hosting environment); there is no built-in fallback, so if it
 * isn't set the Studio stays locked. After sign-in, the session cookie
 * holds an HMAC derived from the passkey, never the passkey itself, and
 * every comparison is constant-time.
 */

export const STUDIO_COOKIE = "studio_auth_token";
export const STUDIO_SESSION_SECONDS = 30 * 24 * 60 * 60;

function passkey(): string | null {
  const v = process.env.STUDIO_ADMIN_PASSKEY?.trim();
  return v ? v : null;
}

export function isStudioConfigured(): boolean {
  return passkey() !== null;
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** The session token for the current passkey (changes if the passkey does). */
export function sessionToken(): string | null {
  const key = passkey();
  return key ? createHmac("sha256", key).update("mikaelson-studio-session-v1").digest("hex") : null;
}

export function checkPasskey(attempt: unknown): boolean {
  const key = passkey();
  return Boolean(key) && typeof attempt === "string" && safeEqual(attempt.trim(), key as string);
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const token = sessionToken();
  return Boolean(token && cookieValue) && safeEqual(cookieValue as string, token as string);
}

export function isStudioRequest(request: NextRequest): boolean {
  return isValidSession(request.cookies.get(STUDIO_COOKIE)?.value);
}
