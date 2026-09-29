import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { postsWithBodyQuery, type Post } from "@/features/website/pages/blog/posts";
import { BlogLab } from "@/features/website/pages/blog/blog-lab";
import { ScrollLine } from "@/components/site/scroll-line";

export const revalidate = 60;

const description =
  "Explore articles on leadership, personal development, and student growth from the Mikaelson Initiative. Insights written to inspire African students to think bigger and act with purpose.";

// The real page's SEO basics, with the lab's title and noindex on top.
export const metadata: Metadata = {
  title: "Blog | Ideas, Leadership & Growth",
  description:
    "Explore articles on leadership, personal development, and student growth from the Mikaelson Initiative. Insights written to inspire African students to think bigger and act with purpose.",
  keywords: [
    "Mikaelson Initiative blog",
    "African student leadership",
    "youth leadership articles",
    "personal development for students",
    "student growth Africa",
    "leadership insights Nigeria",
  ],
  authors: [{ name: "Mikaelson Initiative", url: "https://mikaelsoninitiative.org" }],
  alternates: {
    canonical: "https://mikaelsoninitiative.org/blog",
  },
  openGraph: {
    title: "Blog | Ideas, Leadership & Growth — Mikaelson Initiative",
    description:
      "Articles on leadership, personal development, and student growth from the Mikaelson Initiative.",
    url: "https://mikaelsoninitiative.org/blog",
    siteName: "Mikaelson Initiative",
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "https://mikaelsoninitiative.org/assets/images/og-blog.png",
        width: 1200,
        height: 630,
        alt: "Mikaelson Initiative Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Ideas, Leadership & Growth — Mikaelson Initiative",
    description:
      "Articles on leadership, personal development, and student growth from the Mikaelson Initiative.",
    site: "@mcdti_org",
    images: ["https://mikaelsoninitiative.org/assets/images/og-blog.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await client.fetch(postsWithBodyQuery);
  } catch {
    posts = [];
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Mikaelson Initiative Blog",
            description: "Articles on leadership, personal development, and student growth across Africa.",
            url: "https://mikaelsoninitiative.org/blog",
            publisher: {
              "@type": "Organization",
              name: "Mikaelson Initiative",
              logo: {
                "@type": "ImageObject",
                url: "https://mikaelsoninitiative.org/assets/images/mikaelsonlogo.png",
              },
            },
            // Posts open in place, so there are no per-post URLs.
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.publishedAt,
              url: "https://mikaelsoninitiative.org/blog",
            })),
          }),
        }}
      />
      <ScrollLine>
        <BlogLab posts={posts} />
      </ScrollLine>
    </>
  );
}
