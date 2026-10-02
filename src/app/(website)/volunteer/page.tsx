import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Check, Globe, HandHeart, Sprout, Users } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { DrawnUnderline } from "@/features/website/pages/volunteer/drawn-underline";
import { VolunteerFaq } from "@/features/website/pages/volunteer/faq";
import { btn } from "@/features/website/pages/volunteer/styles";
import { ScrollLine } from "@/components/site/scroll-line";
import circle from "@/components/site/circle.module.css";

export const metadata: Metadata = {
  title: "Volunteer with Us",
  description:
    "Join the Mikaelson Initiative and contribute your skills to transform Africa. Learn about volunteering opportunities, benefits, and get started today.",
  alternates: { canonical: "https://www.mikaelsoninitiative.org/volunteer" },
  openGraph: {
    title: "Volunteer with Mikaelson Initiative",
    description:
      "Join the Mikaelson Initiative and contribute your skills to transform Africa. Learn about volunteering opportunities, benefits, and get started today.",
    url: "https://www.mikaelsoninitiative.org/volunteer",
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
    title: "Volunteer with Mikaelson Initiative",
    description:
      "Join the Mikaelson Initiative and contribute your skills to transform Africa. Learn about volunteering opportunities, benefits, and get started today.",
    images: ["/assets/images/mikaelsonlogo.png"],
  },
};

// The original's four benefits (Global Impact, Skill Development,
// Community, Innovation), retold in plain, personal words. Same claims.
// The Initiative's volunteer application (the live page's "Apply now").
const GOOGLE_FORM_URL = "https://forms.gle/UYgZGfb4sthtP19z6";

const REASONS = [
  {
    icon: Globe,
    title: "You'll see the change",
    text: "Your work reaches projects across Africa and leaves something lasting in real communities.",
  },
  {
    icon: Sprout,
    title: "You'll grow too",
    text: "You'll gain real experience, learn new tools and meet people who widen your world.",
  },
  {
    icon: Users,
    title: "You'll find your people",
    text: "You'll join a lively community of innovators, entrepreneurs and changemakers.",
  },
  {
    icon: HandHeart,
    title: "You'll try new things",
    text: "You'll help on fresh projects, using the newest tools and ways of working.",
  },
];

// From the FAQ answers.
const GOOD_TO_KNOW = [
  "Most roles take 3 to 10 hours a week, around your schedule.",
  "Most opportunities are remote-friendly.",
  "You'll receive a volunteer certificate and a recognition letter.",
];

export default function VolunteerPage() {
  return (
    <div className="bg-white text-[#111] dark:bg-[#050A0A] dark:text-white">
      <ScrollLine>

      {/* Hero: centred, no picture (the user's call). */}
      <section className="mx-auto max-w-[900px] px-4 pt-14 pb-20 text-center sm:px-6 md:pt-20 lg:pb-28">
        <Reveal immediate>
          <h1 className="text-[38px] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#003E45] sm:text-[50px] md:text-[60px] dark:text-white">
            Join our mission
          </h1>
        </Reveal>
        <Reveal immediate delay={0.08}>
          <p className="mx-auto mt-6 max-w-[54ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
            Be part of Africa&rsquo;s transformation. Connect with like-minded changemakers, contribute your skills,
            and help build a brighter future for our continent.
          </p>
          <p className="mx-auto mt-5 max-w-[54ch] text-[18px] leading-[1.7] font-medium text-[#111] dark:text-white">
            You&rsquo;d be joining 15+ active volunteers, across 5+ countries and 10+ projects.
          </p>
          <a href="#apply" className={`${btn.primary} mt-9`}>
            Volunteer with us
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </Reveal>
      </section>

      {/* Why people volunteer */}
      <section aria-labelledby="why-heading" className="bg-[#EEFCFC] dark:bg-[#071010]">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-5">
            <div className="relative aspect-[4/3] rotate-[1deg] overflow-hidden rounded-3xl bg-[#E8F7F8] motion-reduce:rotate-0 lg:aspect-[4/5] dark:bg-white/5">
              <Image
                src="/assets/images/community-4.png"
                alt="Students gathered for a community session"
                fill
                sizes="(min-width: 1024px) 440px, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <Reveal>
              <h2
                id="why-heading"
                className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-[#003E45] md:text-[40px] dark:text-white"
              >
                Why people <DrawnUnderline>volunteer with us</DrawnUnderline>
              </h2>
              <p className="mt-5 max-w-[56ch] text-[18px] leading-[1.7] text-[#555] dark:text-white/65">
                You give a few hours a week. Here&rsquo;s what you get back.
              </p>
            </Reveal>
            {/* The line loops around each reason in turn as you scroll, and
                the one it is on comes forward (ScrollLine's data-circle). */}
            <div className="mt-10 flex flex-col gap-8">
              {REASONS.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  data-circle
                  className={`${circle.item} flex gap-5 rounded-2xl p-3`}
                  style={{ "--lift": 1.025 } as CSSProperties}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#003E45] shadow-[0_2px_8px_-2px_rgb(0_62_69/0.2)] dark:bg-[#003E45] dark:text-[#5CE1E6] dark:shadow-none">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[19px] font-semibold text-[#111] md:text-[21px] dark:text-white">{title}</h3>
                    <p className="mt-1.5 max-w-[50ch] text-base leading-[1.7] text-[#555] dark:text-white/65">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apply: the one warm teal band. */}
      <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-20 bg-[#003E45] text-white dark:bg-[#003E45]/45">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <h2 id="apply-heading" className="text-[28px] leading-tight font-bold tracking-[-0.02em] md:text-[40px]">
              Apply to volunteer
            </h2>
            <p className="mt-4 max-w-[44ch] text-[18px] leading-[1.7] text-white/80">
              Tell us about yourself and how you&rsquo;d like to contribute. It takes a few minutes.
            </p>
            <h3 className="mt-10 text-[15px] font-semibold text-[#5CE1E6]">Good to know</h3>
            <ul className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-white/85">
              {GOOD_TO_KNOW.map((line) => (
                <li key={line} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-[#5CE1E6]" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-7">
            {/* Applications go through the Initiative's own Google Form (the
                site has no form backend), so this card sends people there. */}
            <div className="rounded-2xl bg-white p-6 text-[#111] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.5)] sm:p-9 dark:bg-[#0b1414] dark:text-white dark:ring-1 dark:ring-white/10">
              <p className="text-[13px] font-semibold text-[#0b6b75] dark:text-[#5CE1E6]">Volunteer application</p>
              <h3 className="mt-2 text-[24px] leading-tight font-bold tracking-[-0.015em] text-[#003E45] dark:text-white">
                Tell us who you are and where you&rsquo;d like to help
              </h3>
              <p className="mt-4 max-w-[52ch] text-base leading-[1.7] text-[#555] dark:text-white/65">
                The application asks for your name, where you are, your skills and the kind of work you&rsquo;d enjoy.
                It opens in a new tab, and we&rsquo;ll be in touch by email.
              </p>
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className={`${btn.primary} mt-8`}>
                Open the application form
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="mx-auto grid max-w-[1200px] gap-10 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2
            id="faq-heading"
            className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-[#003E45] md:text-[40px] dark:text-white"
          >
            Questions people ask
          </h2>
          <p className="mt-4 text-base leading-[1.7] text-[#555] dark:text-white/65">
            Anything else? Write to us on the{" "}
            <Link
              href="/contact"
              className="font-semibold text-[#003E45] underline underline-offset-2 dark:text-[#5CE1E6]"
            >
              contact page
            </Link>
            .
          </p>
        </Reveal>
        <div className="lg:col-span-8">
          <VolunteerFaq />
        </div>
      </section>
      </ScrollLine>
    </div>
  );
}
