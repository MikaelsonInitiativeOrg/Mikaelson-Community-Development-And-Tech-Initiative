import type { Metadata } from "next";
import { LegalDocument } from "@/features/website/pages/legal/legal-document";
import { LegalLinks } from "@/features/website/pages/legal/legal-links";
import { LEGAL_DOCS } from "@/features/website/pages/legal/documents";
import {
  PRIVACY_LINKS,
  PRIVACY_PLAIN_WORDS,
  PRIVACY_SECTIONS,
} from "@/features/website/pages/privacy/privacy-sections";

const DESCRIPTION =
  "How the Mikaelson Initiative collects, uses, discloses and safeguards your personal information, and the rights you have over it.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: "https://www.mikaelsoninitiative.org/privacy" },
  openGraph: {
    title: "Privacy Policy | Mikaelson Initiative",
    description: DESCRIPTION,
    url: "https://www.mikaelsoninitiative.org/privacy",
  },
};

const doc = LEGAL_DOCS.find((d) => d.href === "/privacy")!;

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      summary="Learn how we collect, use, and protect your personal information."
      updated={doc.updated}
      updatedIso={doc.updatedIso}
      plainWords={PRIVACY_PLAIN_WORDS}
      sections={PRIVACY_SECTIONS}
      closing={
        <LegalLinks
          heading="Privacy questions?"
          intro="Need clarification about our privacy practices?"
          links={PRIVACY_LINKS}
        />
      }
    />
  );
}
