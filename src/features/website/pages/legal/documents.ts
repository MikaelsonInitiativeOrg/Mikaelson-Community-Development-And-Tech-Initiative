// The site's three legal documents. Dates and summaries come from the
// documents themselves (the old heroes' "Last updated" and opening lines).
export type LegalDoc = {
  title: string;
  href: string;
  summary: string;
  updated: string;
  updatedIso: string;
  cta: string;
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    title: "Terms of Service",
    href: "/terms",
    summary:
      "The agreement that covers your access to and use of our website, mobile applications and related services.",
    updated: "August 10, 2025",
    updatedIso: "2025-08-10",
    cta: "Read the terms",
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    summary: "How we collect, use, disclose and safeguard your information when you use our Services.",
    updated: "August 10, 2025",
    updatedIso: "2025-08-10",
    cta: "Read the policy",
  },
  {
    title: "Code of Conduct",
    href: "/code-of-conduct",
    summary: "Our pledge to maintain a safe, inclusive and respectful community.",
    updated: "August 10, 2025",
    updatedIso: "2025-08-10",
    cta: "Read the code",
  },
];

/** From the Terms of Service, "Contact Information: Legal Matters". */
export const LEGAL_EMAIL = "legal@mikaelsoninitiative.org";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7]";
