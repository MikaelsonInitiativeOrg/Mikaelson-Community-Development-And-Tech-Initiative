import { Suspense } from "react";
import { cookies } from "next/headers";
import { StudioClient } from "./studio-client";
import { STUDIO_COOKIE, isValidSession } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const cookieStore = await cookies();
  const initialAuthenticated = isValidSession(cookieStore.get(STUDIO_COOKIE)?.value);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F9F9] dark:bg-[#050A0A]" />}>
      <StudioClient initialAuthenticated={initialAuthenticated} />
    </Suspense>
  );
}
