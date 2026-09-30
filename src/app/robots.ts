import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikaelsoninitiative.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sponsor/thank-you"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}