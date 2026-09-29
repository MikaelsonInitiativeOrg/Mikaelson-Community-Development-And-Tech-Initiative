import Image from "next/image";
import Link from "next/link";

/**
 * Redesigned footer, built on the Mikaelson Institute's (site-footer.tsx
 * in that repo): the same deep teal panel, two equal columns (mark, name
 * and a short description; a two-column link list), and a quiet bottom
 * bar with the copyright and a credit line. Here the credit names the
 * four parts of the ecosystem, since this is the parent organisation.
 *
 * Only real links: the old footer's "Focus Areas" and "Community" pages no
 * longer exist, and its newsletter form didn't send anything, so both are
 * left out.
 */

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Mikaelson Labs", href: "/labs" },
  { label: "Our team", href: "/team" },
  { label: "Stories", href: "/blog" },
  { label: "Sponsor", href: "/sponsor" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
  { label: "School Club", href: "https://club.mikaelsoninitiative.org", external: true },
  { label: "Mikaelson Institute", href: "https://institute.mikaelsoninitiative.org", external: true },
  { label: "Help centre", href: "/help" },
  { label: "FAQ", href: "/faq" },
  {
    label: "Annual reports",
    href: "https://drive.google.com/drive/folders/1qSFgMPFig9RvlKLAcjaCsPh58GUiotqU",
    external: true,
  },
  { label: "Legal", href: "/legal" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Code of conduct", href: "/code-of-conduct" },
];

const SOCIALS = [
  { label: "X", href: "https://x.com/mcdti_org" },
  { label: "Instagram", href: "https://www.instagram.com/mikaelson_initiative/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mikaelson-initiative/" },
  { label: "YouTube", href: "https://www.youtube.com/@TheMikaelsonCommunity" },
];

const link =
  "inline-flex min-h-11 items-center text-white/80 transition-colors duration-200 hover:text-[#5ce1e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ce1e6]";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      // Colours set inline as well as by class, so the panel never falls back
      // to white-on-white if a cached stylesheet is missing the class.
      style={{ backgroundColor: "#062b30", color: "#fff" }}
      className="bg-[#062b30] text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-2.5 text-lg font-semibold">
              <Image src="/assets/images/mikaelsonlogo.png" alt="" width={48} height={48} className="h-6 w-6 shrink-0 rounded-full" />
              Mikaelson Initiative
            </p>
            <p className="mt-2 max-w-sm text-sm text-white/70">
              A youth development non-profit helping African students grow as leaders, build habits that last and keep
              each other going.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 text-sm" aria-label="Social media">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer" className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {LINKS.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className={link}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Mikaelson Initiative. All rights reserved.</p>
          <p>
            Home of the Mikaelson School Club, Mikaelson Labs, the Partnership &amp; Growth Network and the{" "}
            <a
              href="https://institute.mikaelsoninitiative.org"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/30 underline-offset-2 transition-colors duration-200 hover:text-[#5ce1e6]"
            >
              Mikaelson Institute
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
