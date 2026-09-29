import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/motion/stagger";
import { TEAM_MEMBERS, membersOf } from "@/features/website/pages/team/team-data";
import { body, btn, h2, wrap } from "./styles";

// The people who guide and lead the Initiative, from the same filtered list
// /team uses (so the people removed there stay removed). Counts are computed.
const FEATURED = [...membersOf("BOARD"), ...membersOf("LEADS")];

export function TeamPreview() {
  const others = TEAM_MEMBERS.length - FEATURED.length;
  return (
    <section aria-labelledby="team-heading">
      <div className={`${wrap} py-24 md:py-32`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <h2 id="team-heading" className={h2}>
              Meet our team
            </h2>
            <p className={`mt-5 max-w-[58ch] ${body}`}>
              Our diverse team of passionate individuals is dedicated to empowering African youth and building stronger
              communities.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:text-right">
            <Link href="/team" className={btn.dark}>
              Meet the whole team
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <StaggerGroup onViewport className="mt-12 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
          {FEATURED.map((m) => (
            <StaggerItem key={m.name} className="h-full">
              <figure className="h-full rounded-2xl bg-white p-2 shadow-[0_14px_36px_-18px_rgb(0_62_69/0.35)] ring-1 ring-[#003E45]/8 dark:bg-[#132022] dark:shadow-none dark:ring-white/10">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#EEFCFC] dark:bg-white/5">
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    sizes="(min-width: 1024px) 270px, 46vw"
                    className="object-cover object-center"
                  />
                </div>
                <figcaption className="px-2 pt-3 pb-2">
                  <p className="text-[15px] leading-snug font-semibold text-[#003E45] dark:text-white">{m.name}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-[#555] dark:text-white/60">{m.role}</p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <p className="mt-8 text-[15px] text-[#555] dark:text-white/65">
          With {others} more people in operations, tech and design.
        </p>
      </div>
    </section>
  );
}
