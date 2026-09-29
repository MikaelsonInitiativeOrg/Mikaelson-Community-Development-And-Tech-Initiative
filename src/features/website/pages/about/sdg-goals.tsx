import Image from "next/image";
import type { CSSProperties } from "react";
import circle from "@/components/site/circle.module.css";
import { Reveal } from "@/components/site/motion/reveal";
import { SDGS } from "./content";
import { body, h2, wrap } from "./styles";

/**
 * The five UN Sustainable Development Goals we work towards. The official
 * goal icons stay small, like logos. The scroll line draws a loop around
 * each goal in turn (ScrollLine's data-circle), and the one it is on comes
 * forward (circle.module.css). No Reveal on the circled cards themselves.
 */
export function SdgGoals() {
  return (
    <section aria-labelledby="sdg-heading" className="bg-[#EEFCFC] dark:bg-[#071010]">
      <div className={`${wrap} py-24 md:py-32`}>
        <Reveal>
          <h2 id="sdg-heading" className={h2}>
            The global goals we work towards
          </h2>
          <p className={`mt-5 max-w-[60ch] ${body}`}>
            Our work aligns with, and contributes to, five of the UN Sustainable Development Goals.
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-5">
          {SDGS.map((sdg) => (
            <li
              key={sdg.goal}
              data-circle
              className={`${circle.item} flex flex-col rounded-2xl bg-white p-5 ring-1 ring-[#003E45]/10 dark:bg-[#0E1819] dark:ring-white/10`}
              style={{ "--lift": 1.03 } as CSSProperties}
            >
              <Image
                src={`/sdg/sdg-${sdg.goal}.png`}
                alt=""
                width={64}
                height={64}
                className="size-16 rounded-md"
              />
              <p className="mt-4 text-[13px] font-semibold text-[#0b6b75] dark:text-[#5CE1E6]">Goal {sdg.goal}</p>
              <h3 className="mt-1 text-[17px] leading-snug font-semibold text-[#111] dark:text-white">{sdg.name}</h3>
              <p className="mt-2 text-[15px] leading-[1.65] text-[#555] dark:text-white/65">{sdg.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
