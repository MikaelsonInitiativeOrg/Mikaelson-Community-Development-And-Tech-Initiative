export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  excerpt?: string;
  coverImage?: string;
  coverImageFit?: "contain" | "cover" | "top";
  author?: {
    name: string;
    role?: string;
    avatar?: string;
  };
  publishedAt?: string;
  _updatedAt?: string;
  showAsPopup?: boolean;
  status?: "published" | "draft";
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export function formatDate(dateStr?: string, month: "short" | "long" = "short") {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month, year: "numeric" });
}

/** Minutes at 200 words a minute, calculated from text */
export function readingMinutes(body?: any) {
  if (!body) return 1;
  const text = typeof body === "string" ? body : JSON.stringify(body);
  const words = text
    .replace(/[#*`>_-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Returns a valid image URL for cover images.
 * Supports relative paths (/assets/...), external URLs (https://...), and fallback.
 */
export function imageUrl(source: any, width: number = 1200): string {
  if (!source) return "/assets/images/mikaelsonlogo.png";
  if (typeof source === "string") return source;
  if (source.asset?.url) return source.asset.url;
  if (source.url) return source.url;
  return "/assets/images/mikaelsonlogo.png";
}
