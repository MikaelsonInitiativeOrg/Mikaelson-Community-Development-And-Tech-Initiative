import { TEAM_MEMBERS, countryName } from "./team-data";
import { DrawnUnderline } from "./warm";

// Centred, and no pictures (the user's call): the heading, what the team
// does, and who is in it, in words. Names and countries come from
// TEAM_MEMBERS.
const FEATURED = TEAM_MEMBERS.slice(0, 5);

export function TeamHero() {
  const others = TEAM_MEMBERS.length - FEATURED.length;
  const countries = Array.from(new Set(TEAM_MEMBERS.map((m) => countryName(m.country))));
  const countryList =
    countries.length > 1 ? `${countries.slice(0, -1).join(", ")} and ${countries[countries.length - 1]}` : countries[0];
  const firstNames = FEATURED.map((m) => m.name.split(" ")[0]);

  return (
    <section className="bg-white py-16 text-center dark:bg-[#0B1213] sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6 lg:px-8">
        <p className="text-[13px] font-semibold text-[#003E45] dark:text-[#5CE1E6]">The people behind the Initiative</p>
        <h1
          className="mt-4 text-[38px] font-extrabold leading-[1.05] tracking-[-0.025em] text-[#003E45] dark:text-white sm:text-[48px] lg:text-[64px]"
        >
          Meet the{" "}
          <span className="relative inline-block whitespace-nowrap">
            change makers
            <DrawnUnderline immediate className="absolute -bottom-3 left-0 h-4 w-full sm:-bottom-4 sm:h-5" />
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-[60ch] text-base leading-[1.7] text-[#555] dark:text-white/65 sm:text-[18px]">
          Discover the passionate individuals driving the Mikaelson Initiative forward. Our dedicated team works
          tirelessly to create meaningful impact and transform ideas into reality, one project at a time.
        </p>
        <p className="mx-auto mt-6 max-w-[48ch] text-[15px] leading-snug text-[#555] dark:text-white/65">
          {firstNames.slice(0, -1).join(", ")} and {firstNames[firstNames.length - 1]}, with {others} more people across{" "}
          {countryList}.
        </p>
      </div>
    </section>
  );
}
