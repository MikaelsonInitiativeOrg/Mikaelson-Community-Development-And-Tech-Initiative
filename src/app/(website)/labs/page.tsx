import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { LabsHero } from "@/features/website/pages/labs/labs-hero";
import { WhatWeDo } from "@/features/website/pages/labs/what-we-do";
import { Collaboration } from "@/features/website/pages/labs/collaboration";

export const metadata: Metadata = {
  title: "Mikaelson Innovation Labs | Building Africa's Future",
  description:
    "Explore the Mikaelson Innovation Labs: collaborative spaces where breakthrough ideas meet cutting-edge technology to solve real-world challenges across Africa.",
  openGraph: {
    title: "Mikaelson Innovation Labs | Building Africa's Future",
    description:
      "Explore the Mikaelson Innovation Labs: collaborative spaces where breakthrough ideas meet cutting-edge technology to solve real-world challenges across Africa.",
    url: "https://mikaelsoninitiative.org/labs",
    images: [
      {
        url: "/assets/images/mikaelsonlogo.png",
        width: 1200,
        height: 630,
        alt: "Mikaelson Innovation Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mikaelson Innovation Labs | Building Africa's Future",
    description:
      "Explore the Mikaelson Innovation Labs: collaborative spaces where breakthrough ideas meet cutting-edge technology to solve real-world challenges across Africa.",
    images: ["/assets/images/mikaelsonlogo.png"],
  },
};

// Below the fold: split the interactive sections out of the first bundle.
const BlueprintProjects = dynamic(() =>
  import("@/features/website/pages/labs/blueprint-projects").then((m) => m.BlueprintProjects),
);
const ProcessTrack = dynamic(() => import("@/features/website/pages/labs/process-track").then((m) => m.ProcessTrack));

export default function LabsPage() {
  return (
    <>
      <LabsHero />
      <WhatWeDo />
      <BlueprintProjects />
      <ProcessTrack />
      <Collaboration />
    </>
  );
}
