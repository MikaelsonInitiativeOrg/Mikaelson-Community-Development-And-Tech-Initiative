import type { Metadata } from "next";
import { JoinTeam } from "@/features/website/pages/team/join-team";
import { TeamBoard } from "@/features/website/pages/team/team-board";
import { TeamHero } from "@/features/website/pages/team/team-hero";
import { ScrollLine } from "@/components/site/scroll-line";

export const metadata: Metadata = {
  title: "Meet Our Team",
  description:
    "Discover the passionate individuals driving the Mikaelson Initiative forward. Our team works tirelessly to create impact and transform ideas into reality.",
  openGraph: {
    title: "Meet Our Team | Mikaelson Initiative",
    description:
      "Discover the passionate individuals driving the Mikaelson Initiative forward.",
    url: "https://mikaelsoninitiative.org/team",
    images: [
      {
        url: "/assets/images/mikaelsonlogo.png",
        width: 1200,
        height: 630,
        alt: "Mikaelson Initiative Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Our Team | Mikaelson Initiative",
    description:
      "Discover the passionate individuals driving the Mikaelson Initiative forward.",
    images: ["/assets/images/mikaelsonlogo.png"],
  },
};

export default function TeamPage() {
  return (
    <>
      <ScrollLine>
        <TeamHero />
        <TeamBoard />
        <JoinTeam />
      </ScrollLine>
    </>
  );
}
