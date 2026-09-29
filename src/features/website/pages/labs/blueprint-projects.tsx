"use client";

import Image from "next/image";
import { ArrowUpRight, Hammer, PencilRuler } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./blueprint.module.css";
import { container } from "./ui";

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageBg: string;
  status: string;
  tags: string[];
  link?: string;
};

// Data from the original labs-featured-section.tsx (logos, backgrounds,
// status, tags, link). Image sizes are the real files' pixel sizes, used as
// blueprint annotations.
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "RIO AI",
    description:
      "AI-powered habit tracking and accountability platform helping African students build discipline, measure progress, and achieve sustainable growth.",
    image: "/assets/images/RIO.webp",
    imageWidth: 512,
    imageHeight: 226,
    imageBg: "#f8fafc",
    status: "development",
    tags: ["AI", "Education", "Analytics"],
  },
  {
    id: 2,
    title: "Rental Hub",
    description:
      "Platform simplifying rental property discovery, verification and tenant-landlord management across Nigerian cities.",
    image: "/assets/images/logo-horizontal-reversed.png",
    imageWidth: 2080,
    imageHeight: 512,
    imageBg: "#0f1a2e",
    status: "development",
    tags: ["Real Estate", "Nigeria", "Tech"],
    link: "http://rentalhub.mikaelsoninitiative.org/",
  },
];

type Phase = "idle" | "plan" | "build";

// Sequence timing (ms). Advanced by timers, never by transition events:
// hidden tabs don't fire them.
const PLAN_HOLD = 850; // grid drawn + ghosts in, before building starts
const CARD_OFFSET = 250; // second card starts a beat later

function Part({
  children,
  note,
  d,
  ghost = "box",
  className = "",
  inactive = false,
}: {
  children: ReactNode;
  note?: string;
  d: number;
  ghost?: "box" | "lines" | "cross" | "pill";
  className?: string;
  /** Not focusable or clickable while it's only a drawing. */
  inactive?: boolean;
}) {
  const ghostClass =
    ghost === "lines" ? styles.lines : ghost === "cross" ? styles.cross : ghost === "pill" ? styles.pill : "";
  return (
    <div className={`${styles.part} ${className}`} style={{ "--d": `${d}ms` } as CSSProperties}>
      <span aria-hidden className={`${styles.ghost} ${ghostClass}`} />
      {note ? (
        <span aria-hidden className={styles.note}>
          {note}
        </span>
      ) : null}
      <div className={styles.real} inert={inactive || undefined}>
        {children}
      </div>
    </div>
  );
}

function BlueprintCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const assemble = useCallback(
    (startDelay: number) => {
      clear();
      if (reduce) {
        setPhase("build");
        return;
      }
      setPhase("plan");
      timers.current.push(window.setTimeout(() => setPhase("build"), startDelay));
    },
    [reduce],
  );

  // First sight: draw the plan, then build it. Once.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = window.setTimeout(() => assemble(PLAN_HOLD), index * CARD_OFFSET);
        timers.current.push(start);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, [assemble, index]);

  const showingPlan = phase !== "build";

  const toggle = () => {
    clear();
    if (showingPlan) {
      // The plan is already on screen: build straight away.
      setPhase("build");
    } else {
      setPhase("plan");
    }
  };

  const statusLabel = project.status === "development" ? "In development" : project.status;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <article ref={ref} data-phase={phase} className={`${styles.card} grow`} aria-labelledby={`project-${project.id}`}>
        <span aria-hidden className={styles.paper} />
        <span aria-hidden className={styles.surface} />

        <Part d={0} ghost="cross" note={`Logo, ${project.imageWidth} × ${project.imageHeight}`}>
          <div className="relative h-40 overflow-hidden rounded-xl sm:h-44" style={{ background: project.imageBg }}>
            <Image
              src={project.image}
              alt={`${project.title} logo`}
              fill
              sizes="(min-width: 1024px) 520px, (min-width: 640px) 45vw, 90vw"
              className="object-contain p-8"
            />
          </div>
        </Part>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Part d={60} ghost="pill" note="Status" className="rounded-full">
            <span className="inline-flex rounded-full bg-[#5CE1E6] px-3 py-1 text-[13px] font-semibold text-black">
              {statusLabel}
            </span>
          </Part>
        </div>

        <Part d={110} ghost="lines" note="Name" className="mt-5">
          <h3 id={`project-${project.id}`} className="text-[22px] font-semibold leading-[1.3] text-white">
            {project.title}
          </h3>
        </Part>

        <Part d={170} ghost="lines" note="What it does" className="mt-3">
          <p className="text-base leading-[1.65] text-white/75">{project.description}</p>
        </Part>

        <div className="mt-auto pt-6">
          <Part d={230} note={`${project.tags.length} tags`} className="rounded-lg">
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[#5CE1E6]/30 px-3 py-1 text-[13px] font-medium text-[#5CE1E6]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Part>

          {project.link ? (
            <Part d={290} ghost="pill" note="Live link" className="mt-5 w-fit rounded-full" inactive={phase === "plan"}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-[#003E45] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#EEFCFC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6] active:scale-[0.97] motion-reduce:active:scale-100"
              >
                Visit {project.title}
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Part>
          ) : null}
        </div>
      </article>

      <button
        type="button"
        onClick={toggle}
        className={`${styles.toggle} inline-flex min-h-11 w-fit items-center gap-2 self-end rounded-full border border-white/15 px-4 text-sm font-medium text-white/75 hover:border-[#5CE1E6]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6]`}
      >
        {showingPlan ? (
          <>
            <Hammer aria-hidden className="size-4" /> Build {project.title}
          </>
        ) : (
          <>
            <PencilRuler aria-hidden className="size-4" /> Show the blueprint
          </>
        )}
      </button>
    </div>
  );
}

/**
 * Featured projects on the page's one dark section. Each project arrives
 * as a drawing and assembles into its product card; the toggle takes it
 * back to the drawing and builds it again.
 */
export function BlueprintProjects() {
  return (
    <section id="projects" className="scroll-mt-20 bg-[#050A0A] py-20 dark:border-y dark:border-white/10 sm:py-24 lg:py-32">
      <div className={container}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[40px] lg:col-span-6">
            Featured projects
          </h2>
          <div className="lg:col-span-6">
            <p className="max-w-[52ch] text-base leading-[1.65] text-white/60 sm:text-[17px]">
              Discover our current initiatives and their impact on communities across Africa.
            </p>
            <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#5CE1E6]">
              <span aria-hidden className="size-3 rounded-[3px] border border-dashed border-[#5CE1E6]" />
              idea
              <span aria-hidden className="h-px w-6 bg-[#5CE1E6]/50" />
              <span aria-hidden className="size-3 rounded-[3px] bg-[#5CE1E6]" />
              build
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8 lg:mt-16">
          {PROJECTS.map((project, index) => (
            <BlueprintCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
