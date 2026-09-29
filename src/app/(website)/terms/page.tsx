import type { Metadata } from "next";
import { LegalDocument } from "@/features/website/pages/legal/legal-document";
import { LegalLinks } from "@/features/website/pages/legal/legal-links";
import { LEGAL_DOCS } from "@/features/website/pages/legal/documents";
import { TERMS_LINKS, TERMS_PLAIN_WORDS, TERMS_SECTIONS } from "@/features/website/pages/terms/terms-sections";

const DESCRIPTION =
  "The Terms of Service for the Mikaelson Initiative: the agreement that covers your use of our website, programs and services.";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: DESCRIPTION,
  alternates: { canonical: "https://mikaelsoninitiative.org/terms" },
  openGraph: {
    title: "Terms of Service | Mikaelson Initiative",
    description: DESCRIPTION,
    url: "https://mikaelsoninitiative.org/terms",
  },
};

const doc = LEGAL_DOCS.find((d) => d.href === "/terms")!;

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      summary="Please read these terms carefully before using our services. They are the agreement between you and the Mikaelson Initiative."
      updated={doc.updated}
      updatedIso={doc.updatedIso}
      plainWords={TERMS_PLAIN_WORDS}
      sections={TERMS_SECTIONS}
      closing={
        <LegalLinks heading="Questions?" intro="Need clarification on any of these terms?" links={TERMS_LINKS} />
      }
    />
  );
}
