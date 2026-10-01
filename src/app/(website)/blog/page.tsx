import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import type { Post } from "@/features/website/pages/blog/posts";
import { BlogLab } from "@/features/website/pages/blog/blog-lab";
import { ScrollLine } from "@/components/site/scroll-line";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const description =
  "Explore articles on leadership, personal development, and student growth from the Mikaelson Initiative. Insights written to inspire African students to think bigger and act with purpose.";

export const metadata: Metadata = {
  title: "Blog | Ideas, Leadership & Growth",
  description,
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
        url: "https://mikaelsoninitiative.org/assets/images/mikaelsonlogo.png",
        width: 800,
        height: 800,
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
    images: ["https://mikaelsoninitiative.org/assets/images/mikaelsonlogo.png"],
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
    posts = await getAllPosts();
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
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.publishedAt,
              url: `https://mikaelsoninitiative.org/blog/${post.slug.current}`,
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
