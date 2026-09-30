import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const cacheForever = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

// Long caching for our own static folders, in production only: in dev, file
// names don't change between edits, so "cache forever" left browsers running
// stale code. /_next/static is left to Next.js, which already caches it
// forever in production.
const headerRules = async () => [
  { source: "/(.*)", headers: securityHeaders },
  ...(process.env.NODE_ENV === "production"
    ? [
        { source: "/assets/(.*)", headers: cacheForever },
        { source: "/sdg/(.*)", headers: cacheForever },
        { source: "/icons/(.*)", headers: cacheForever },
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  headers: headerRules,
};

export default nextConfig;
