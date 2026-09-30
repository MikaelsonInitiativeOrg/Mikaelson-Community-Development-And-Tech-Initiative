import { Suspense } from "react";
import { cookies } from "next/headers";
import { StudioClient } from "./studio-client";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("studio_auth_token")?.value;
  const expected = process.env.STUDIO_ADMIN_PASSKEY || "mikaelson2026";
  const initialAuthenticated = Boolean(token && token === expected);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F9F9] dark:bg-[#050A0A]" />}>
      <StudioClient initialAuthenticated={initialAuthenticated} />
    </Suspense>
  );
}
