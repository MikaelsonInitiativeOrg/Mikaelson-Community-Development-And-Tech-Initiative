import Link from "next/link";
import { DrawnUnderline } from "./warm";

/**
 * The page's one warm dark band: an invitation (no picture; centred like
 * the hero). Two ways in: volunteer, or just say hello.
 */
export function JoinTeam() {
  return (
    <section className="bg-[#003E45] py-20 text-center sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[40px]">
          There&rsquo;s a place for{" "}
          <span className="relative inline-block whitespace-nowrap">
            you here
            <DrawnUnderline className="absolute -bottom-2.5 left-0 h-3.5 w-full sm:h-4" />
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-[60ch] text-base leading-[1.7] text-white/80 sm:text-[18px]">
          Ready to make a difference? Join our mission to transform communities across Africa through sustainable
          technology and innovation. Together, we can create lasting impact and build a brighter future.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/volunteer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#5CE1E6] px-6 text-[15px] font-semibold text-black transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#7fe8ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6] active:scale-[0.97] motion-reduce:active:scale-100"
          >
            Join us today
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-6 text-[15px] font-semibold text-white transition-[transform,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6] active:scale-[0.97] motion-reduce:active:scale-100"
          >
            Talk to us first
          </Link>
        </div>
      </div>
    </section>
  );
}
