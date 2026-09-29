import type { Metadata } from "next";
import { ScrollLine } from "@/components/site/scroll-line";
import { SdgGoals } from "@/features/website/pages/about/sdg-goals";
import {
  AboutHero,
  JoinBand,
  OurStory,
  WhatWeDo,
  WhoWeAre,
} from "@/features/website/pages/about/sections";
import { TeamPreview } from "@/features/website/pages/about/team-preview";


export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the Mikaelson Initiative, our mission, vision, values, and the passionate team driving positive change across Africa.",
  openGraph: {
    title: "About Us | Mikaelson Initiative",
    description:
      "Learn about the Mikaelson Initiative, our mission, vision, values, and the passionate team driving positive change across Africa.",
    url: "https://mikaelsoninitiative.org/about-us",
    images: [
      {
        url: "/assets/images/mikaelsonlogo.png",
        width: 1200,
        height: 630,
        alt: "Mikaelson Initiative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Mikaelson Initiative",
    description:
      "Learn about the Mikaelson Initiative, our mission, vision, values, and the passionate team driving positive change across Africa.",
    images: ["/assets/images/mikaelsonlogo.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>
        <AboutHero />
        <WhoWeAre />
        <OurStory />
        <WhatWeDo />
        <SdgGoals />
        <TeamPreview />
        <JoinBand />
      </ScrollLine>
    </div>
  );
}
