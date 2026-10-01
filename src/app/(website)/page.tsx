import type { Metadata } from "next";
import { Suspense } from "react";
import { ScrollLine } from "@/components/site/scroll-line";
import OurEcosystemTabs from "@/features/website/pages/home/ecosystem-tabs";
import { Closing, Hero, WalkWithUs, WhoWeServe } from "@/features/website/pages/home/sections";
import { BlogPreview } from "@/features/website/pages/home/blog-preview";
import { getPopupPost } from "@/lib/blog";
import type { Post } from "@/features/website/pages/blog/posts";
import { BlogAnnouncementPopup } from "@/features/website/pages/home/blog-popup";

export const metadata: Metadata = {
  // absolute: skip the "%s | Mikaelson Initiative" template (the name is already in it)
  title: { absolute: "Mikaelson Initiative | Community & Technology Infrastructure for Discipline, Habit Leadership & Sustainable Growth in Education" },
  description:
    "Structured youth leadership and personal development programs equipping African students with discipline, innovation skills, and accountability systems.",
  keywords: [
    "youth leadership Nigeria",
    "student leadership programs Africa",
    "personal development for students",
    "African youth initiative",
    "leadership training Nigeria",
    "student growth programs",
    "Mikaelson Initiative",
    "youth development Africa",
    "accountability systems students",
    "leadership skills students Nigeria",
  ],
  authors: [{ name: "Mikaelson Initiative", url: "https://mikaelsoninitiative.org" }],
  alternates: {
    canonical: "https://mikaelsoninitiative.org",
  },
  openGraph: {
    title: "Youth Leadership Programs in Nigeria | Mikaelson Initiative",
    description:
      "Structured youth leadership and personal development programs equipping African students with discipline, innovation skills, and accountability systems.",
    url: "https://mikaelsoninitiative.org",
    siteName: "Mikaelson Initiative",
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "https://mikaelsoninitiative.org/assets/images/mikaelsonlogo.png",
        width: 800,
        height: 800,
        alt: "Mikaelson Initiative — Youth Leadership Programs in Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Leadership Programs in Nigeria | Mikaelson Initiative",
    description:
      "Structured youth leadership and personal development programs equipping African students with discipline, innovation skills, and accountability systems.",
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

// No images on this page. The turquoise line drops down the page as you
// scroll (ScrollLine), looping beside each heading marked data-stop.
export default async function HomePage() {
  let popupPost: Post | null = null;
  try {
    popupPost = await getPopupPost();
  } catch {
    popupPost = null;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mikaelson Initiative",
            url: "https://mikaelsoninitiative.org",
            logo: "https://mikaelsoninitiative.org/assets/images/mikaelsonlogo.png",
            description:
              "Structured youth leadership and personal development programs equipping African students with discipline, innovation skills, and accountability systems.",
            foundingLocation: {
              "@type": "Place",
              name: "Nigeria",
            },
            areaServed: "Africa",
            sameAs: [
              "https://x.com/mcdti_org",
              "https://www.instagram.com/mikaelson_initiative/",
              "https://www.linkedin.com/company/mikaelson-initiative/",
              "https://www.youtube.com/@TheMikaelsonCommunity",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              email: "mikaelsoninitiative@gmail.com",
              contactType: "customer support",
            },
          }),
        }}
      />
      <ScrollLine>
        <Hero />
        <OurEcosystemTabs />
        <WhoWeServe />
        <WalkWithUs />
        {/* The stories fetch streams in after the rest of the page. */}
        <Suspense fallback={<div className="min-h-[480px] bg-white dark:bg-[#0a0f0f]" />}>
          <BlogPreview />
        </Suspense>
        <Closing />
      </ScrollLine>
      <BlogAnnouncementPopup post={popupPost} />
    </>
  );
}
