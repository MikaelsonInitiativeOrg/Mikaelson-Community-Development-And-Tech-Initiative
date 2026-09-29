import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { buttonOutline, buttonPrimary, container } from "./ui";

// Copy from the original labs-collaboration.tsx.
const BENEFITS = [
  "Collaborate with like-minded innovators",
  "Turn your ideas into impactful solutions",
  "Contribute to Africa’s tech ecosystem",
];

export function Collaboration() {
  return (
    <section id="collaboration" className="bg-[#EEFCFC] py-20 dark:bg-[#0E1819] sm:py-24 lg:py-32">
      <div className={`${container} grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8`}>
        <div className="lg:col-span-7">
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#111] dark:text-white sm:text-[40px]">
            Join our innovation journey
          </h2>
          <p className="mt-4 max-w-[56ch] text-base leading-[1.65] text-[#555] dark:text-white/60 sm:text-[17px]">
            Whether you&rsquo;re a developer, researcher, or community leader, there&rsquo;s a place for you in our
            innovation ecosystem.
          </p>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-4 text-base font-medium text-[#111] dark:text-white">
                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-[4px] bg-[#5CE1E6] text-black"
                >
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
          <Link href="/volunteer" className={buttonPrimary}>
            Join our lab
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          <Link href="/contact" className={buttonOutline}>
            Submit a project idea
          </Link>
          <Link href="/sponsor" className={buttonOutline}>
            Partner with us
          </Link>
        </div>
      </div>
    </section>
  );
}
