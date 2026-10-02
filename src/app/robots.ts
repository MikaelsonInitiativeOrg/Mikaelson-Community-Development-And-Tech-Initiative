import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.mikaelsoninitiative.org";

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