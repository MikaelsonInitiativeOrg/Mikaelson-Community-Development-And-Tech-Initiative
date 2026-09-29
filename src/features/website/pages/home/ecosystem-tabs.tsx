"use client";

// The original "Our Ecosystem" section (src/components/client-page/our-ecosystem.tsx),
// kept as it is, with the Mikaelson Institute added as a fourth pillar and
// links pointing at the redesign test pages.

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import EcosystemSection from "./ecosystem-points";

const tabs = [
  {
    id: "school-club",
    label: "Mikaelson School Club",
    color: "#003E45",
    textColor: "text-white",
    iconBg: "bg-white",
    iconColor: "text-[#003E45]",
    title: "Mikaelson School Club",
    content:
      "The Mikaelson School Club brings the initiative's values directly into schools, empowering students to build structured growth systems, lead peer communities, and champion discipline within their academic environments.",
    glowColor: "rgba(0,62,69,0.15)",
    shadowColor: "rgba(0,62,69,0.45)",
    cta: {
      text: "Start a Club",
      href: "https://club.mikaelsoninitiative.org",
    },
  },
  {
    id: "labs",
    label: "Mikaelson Labs",
    color: "#3b82f6",
    textColor: "text-black",
    iconBg: "bg-white",
    iconColor: "text-black",
    title: "Mikaelson Labs",
    content:
      "Mikaelson Labs serves as our innovation hub where bold ideas are nurtured and transformed into real-world solutions that drive sustainable progress.",
    glowColor: "rgba(59,130,246,0.15)",
    shadowColor: "rgba(59,130,246,0.4)",
    cta: {
      text: "Explore Labs",
      href: "/labs",
    },
  },
  {
    id: "partnerships",
    label: "Partnership & Growth Network",
    color: "#050a0a",
    textColor: "text-white",
    iconBg: "bg-white",
    iconColor: "text-black",
    title: "Partnership & Growth Network",
    content:
      "The Partnership & Growth Network connects emerging leaders with mentors, organizations, and strategic opportunities to scale their impact.",
    glowColor: "rgba(11, 11, 11, 0.1)",
    shadowColor: "rgba(0, 0, 0, 0.4)",
    cta: {
      text: "Partner with Us",
      href: "/contact",
    },
  },
  {
    id: "institute",
    label: "Mikaelson Institute",
    color: "#5CE1E6",
    textColor: "text-black",
    iconBg: "bg-black",
    iconColor: "text-[#5CE1E6]",
    title: "Mikaelson Institute",
    content:
      "The Mikaelson Institute for African Studies is our pan-African research institute, publishing scholarship across history and decolonization, society and politics, arts and culture, and religion and philosophy.",
    glowColor: "rgba(92,225,230,0.18)",
    shadowColor: "rgba(92,225,230,0.5)",
    cta: {
      text: "Visit the Institute",
      href: "https://institute.mikaelsoninitiative.org",
    },
  },
];

export default function OurEcosystemTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeData = tabs.find((t) => t.id === activeTab) || tabs[0];
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <section id="our-ecosystem" className="py-24  bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-5  lg:px-10 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16  ">
          <p className="text-[#5CE1E6] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            What we&apos;ve built
          </p>
          <h2 data-stop className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#111] dark:text-white">
            Our Ecosystem
          </h2>
        </div>

        {/* Tabs Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20  flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ backgroundColor: tab.color }}
              className={`
                relative flex items-center justify-between gap-4 px-6 py-4 rounded-xl font-bold
                transition-transform hover:scale-105 active:scale-95
                ${tab.textColor}
                ${activeTab !== tab.id ? "opacity-60 hover:opacity-90" : "opacity-100"}
              `}
            >
              <span className="text-[15px]">{tab.label}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tab.iconBg} ${tab.iconColor}`}>
                <ArrowUpRight strokeWidth={2.5} size={18} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Animated tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title + Card */}
          <div className="relative w-full max-w-4xl mx-auto mt-6 mb-16 px-5">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none"
              style={{ backgroundColor: activeData.glowColor }}
            />
            <div className="relative z-10 flex flex-col items-center text-center">
              <h3
                className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold tracking-[-0.03em] text-[#111] dark:text-white/20 mb-6 "
                style={{ textShadow: `0px 4px 40px ${activeData.shadowColor}` }}
              >
                {activeData.title}
              </h3>

              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-[#5CE1E6] rounded-full" />
              </div>

              <p className="text-base text-[#555] dark:text-white/60  leading-relaxed max-w-2xl mb-10">
                {activeData.content}
              </p>

              {activeData.cta && (
                <motion.a
                  href={activeData.cta.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    backgroundColor: activeData.color,
                  }}
                  className={`
                    inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm
                    ${activeData.textColor} shadow-lg hover:shadow-xl transition-shadow
                  `}
                >
                  {activeData.cta.text}
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </motion.a>
              )}
            </div>
          </div>

          <EcosystemSection activeIndex={activeIndex} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}