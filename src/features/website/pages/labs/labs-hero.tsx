import Link from "next/link";
import { ArrowDown, Plus } from "lucide-react";
import { buttonOutline, buttonPrimary, container } from "./ui";

/**
 * Static, centred hero with no picture (page-load motion belongs to the
 * home page only). The projects section below plays out the idea → build
 * theme.
 */
export function LabsHero() {
  return (
    <section className="bg-white py-16 dark:bg-[#0B1213] sm:py-20 lg:py-28">
      <div className={`${container} text-center`}>
        <div className="mx-auto max-w-[900px]">
          <p className="text-[13px] font-semibold text-[#003E45] dark:text-[#5CE1E6]">Mikaelson Innovation Labs</p>
          <h1 className="mx-auto mt-4 max-w-[14ch] text-[40px] font-extrabold leading-[1.05] tracking-[-0.025em] text-[#111] dark:text-white sm:text-[52px] lg:text-[64px]">
            Building tomorrow&rsquo;s solutions today
          </h1>
          <p className="mx-auto mt-6 max-w-[58ch] text-base leading-[1.65] text-[#555] dark:text-white/60 sm:text-[17px]">
            Our Innovation Labs are where breakthrough ideas meet cutting-edge technology. We develop practical
            solutions for real-world challenges facing African communities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#projects" className={buttonPrimary}>
              Explore projects
              <ArrowDown aria-hidden className="size-4" />
            </Link>
            <Link href="/volunteer" className={buttonOutline}>
              Join our lab
              <Plus aria-hidden className="size-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
