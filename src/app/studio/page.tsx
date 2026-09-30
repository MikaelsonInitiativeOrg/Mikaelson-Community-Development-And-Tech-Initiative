import { cookies } from "next/headers";
import { StudioClient } from "./studio-client";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("studio_auth_token")?.value;
  const expected = process.env.STUDIO_ADMIN_PASSKEY || "mikaelson2026";
  const initialAuthenticated = Boolean(token && token === expected);

  return <StudioClient initialAuthenticated={initialAuthenticated} />;
}
