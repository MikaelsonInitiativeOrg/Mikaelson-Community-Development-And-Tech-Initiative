import type { Metadata } from "next";
import { ScrollLine } from "@/components/site/scroll-line";
import {
  Attribution,
  ConductHero,
  Enforcement,
  Participation,
  Pledge,
  ReportConcern,
  Scope,
  Standards,
  Support,
  Updates,
  Values,
} from "@/features/website/pages/code-of-conduct/sections";

const title = "Code of Conduct | Mikaelson Initiative";
const description =
  "Our pledge to maintain a safe, inclusive, and respectful community: the values we share, how we treat each other, and how to report a concern.";

export const metadata: Metadata = {
  // The root layout's template adds " | Mikaelson Initiative".
  title: "Code of Conduct",
  description,
  alternates: { canonical: "https://www.mikaelsoninitiative.org/code-of-conduct" },
  openGraph: {
    title,
    description,
    url: "https://www.mikaelsoninitiative.org/code-of-conduct",
    images: [{ url: "/assets/images/mikaelsonlogo.png", width: 1200, height: 630, alt: "Mikaelson Initiative" }],
  },
};

export default function CodeOfConductPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>
        <ConductHero />
        <Pledge />
        <Values />
        <Standards />
        <Participation />
        <Enforcement />
        <ReportConcern />
        <Scope />
        <Support />
        <Updates />
        <Attribution />
      </ScrollLine>
    </div>
  );
}
