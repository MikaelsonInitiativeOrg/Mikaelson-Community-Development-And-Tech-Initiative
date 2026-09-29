import { Bot, Globe, Lightbulb, Microscope, Smartphone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { container } from "./ui";

type Service = { icon: LucideIcon; title: string; description: string };

// Copy from the original labs-what-we-do.tsx. The "Learn more" overlays led
// nowhere, so they're gone; emoji icons become lucide icons.
const SERVICES: Service[] = [
  {
    icon: Microscope,
    title: "Research & Development",
    description:
      "Conducting deep research into local challenges and developing innovative technological solutions tailored to community needs.",
  },
  {
    icon: Lightbulb,
    title: "Prototype Development",
    description:
      "Building and testing proof-of-concept solutions before scaling them for broader community implementation.",
  },
  {
    icon: Bot,
    title: "AI & Machine Learning",
    description:
      "Leveraging artificial intelligence to solve complex problems in education, healthcare, and economic development.",
  },
  {
    icon: Smartphone,
    title: "Digital Products",
    description:
      "Creating mobile and web applications that improve access to essential services and opportunities.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description:
      "Contributing to and creating open-source projects that empower developers and benefit the global community.",
  },
];

/** A workbench list, not a card grid: five kinds of work, one per row. */
export function WhatWeDo() {
  return (
    <section className="bg-[#EEFCFC] py-20 dark:bg-[#0E1819] sm:py-24 lg:py-32">
      <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#111] dark:text-white sm:text-[40px]">
              What we do
            </h2>
            <p className="mt-4 max-w-[46ch] text-base leading-[1.65] text-[#555] dark:text-white/60 sm:text-[17px]">
              Our labs focus on creating technology solutions that directly address the unique challenges and
              opportunities within African communities.
            </p>
          </div>
        </div>

        <ul className="border-t border-[#003E45]/15 dark:border-white/10 lg:col-span-7">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="border-b border-[#003E45]/15 dark:border-white/10">
              <Reveal className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 py-7 sm:gap-6">
                <span
                  aria-hidden
                  className="flex size-11 items-center justify-center rounded-[4px] bg-[#5CE1E6] text-black"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-[19px] font-semibold leading-snug text-[#111] dark:text-white sm:text-[22px]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-[60ch] text-base leading-[1.65] text-[#555] dark:text-white/60">
                    {description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
