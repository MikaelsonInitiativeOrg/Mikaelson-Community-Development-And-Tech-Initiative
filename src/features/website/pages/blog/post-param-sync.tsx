"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reports the `?post=<slug>` search param. Kept in its own tiny component
 * (inside a Suspense boundary) so reading search params doesn't push the
 * whole article list out of the prerendered HTML. `history.pushState` and
 * the back button both flow through here, because Next's router syncs
 * native history calls into useSearchParams.
 */
export function PostParamSync({ onChange }: { onChange: (slug: string | null) => void }) {
  const slug = useSearchParams().get("post");

  useEffect(() => {
    onChange(slug);
  }, [slug, onChange]);

  return null;
}
