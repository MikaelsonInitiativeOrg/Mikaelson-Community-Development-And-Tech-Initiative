import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mikaelsoninitiative.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mikaelson Initiative | Community & Technology Infrastructure for Discipline, Habit Leadership & Sustainable Growth in Education",
    template: "%s | Mikaelson Initiative",
  },
  description:
    "The Mikaelson Initiative empowers communities and innovators across Africa through technology, education, and collaboration.",
  keywords: [
    "Mikaelson Initiative",
    "Technology",
    "Innovation",
    "Africa",
    "Community",
    "Volunteering",
    "Education",
  ],
  authors: [
    {
      name: "Mikaelson Initiative Team",
      url: siteUrl,
    },
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mikaelson Initiative",
    title: "Mikaelson Initiative | Community & Technology Infrastructure for Discipline, Habit Leadership & Sustainable Growth in Education",
    description:
      "Join the Mikaelson Initiative to build a better Africa through innovation, community, and impact-driven technology.",
    images: [
      {
        url: `${siteUrl}/assets/images/mikaelsonlogo.png`,
        width: 1200,
        height: 630,
        alt: "Mikaelson Initiative Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mikaelsoninitiative",
    creator: "@mikaelsoninitiative",
    title: "Mikaelson Initiative | Empowering Africa Through Technology",
    description:
      "Discover how the Mikaelson Initiative is transforming Africa through innovation, education, and collaboration.",
    images: [`${siteUrl}/assets/images/mikaelsonlogo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Technology & Community Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script
          src="https://t.contentsquare.net/uxa/637962adff02e.js"
          strategy="lazyOnload"
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?('&l='+l):'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-M2GCJCC8');
            `,
          }}
        />
        {/* Google Analytics 4 (gtag.js) for property G-2XRR90XDZ8. The GTM
            container above separately sends to G-0DG0V45VPZ; if it is ever set to
            send to G-2XRR90XDZ8 too, remove one of them or visits count twice. */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-2XRR90XDZ8" strategy="afterInteractive" />
        <Script
          id="ga4-gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2XRR90XDZ8');
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <QueryProvider>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-M2GCJCC8"
              height={0}
              width={0}
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div id="main-content">
              {children}
              <Toaster position="top-center" richColors />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
