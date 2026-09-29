"use client";

import Image from "next/image";
import { RotateCcw, Search } from "lucide-react";
import { useId, useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import ReactCountryFlag from "react-country-flag";
import styles from "./flip-card.module.css";
import circle from "@/components/site/circle.module.css";
import {
  ALL_GROUPS,
  GROUP_LABEL,
  TEAM_MEMBERS,
  countryName,
  membersOf,
  type GroupId,
  type TeamMember,
} from "./team-data";

function PersonCard({ member, group }: { member: TeamMember; group: GroupId }) {
  const [turned, setTurned] = useState(false);
  const [instant, setInstant] = useState(false);
  const backId = useId();
  const firstName = member.name.split(" ")[0];

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    // detail === 0: activated from the keyboard (Enter/Space). Keyboard
    // actions change state instantly.
    setInstant(e.detail === 0);
    setTurned((t) => !t);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape" && turned) {
      setInstant(true);
      setTurned(false);
    }
  };

  return (
    // data-circle: the scroll line draws a loop around each person in turn
    // (ScrollLine), and the one it is on comes forward (circle.module.css).
    <li
      data-circle
      className={`${styles.card} ${circle.item}`}
      data-turned={turned || undefined}
      data-instant={instant || undefined}
    >
      <div className={styles.inner}>
        {/* Front: photo and name plate. */}
        <div
          aria-hidden={turned}
          className={`${styles.face} ${styles.front} flex flex-col bg-white p-2 shadow-[0_14px_36px_-18px_rgb(0_62_69/0.35)] ring-1 ring-[#003E45]/8 dark:bg-[#132022] dark:shadow-none dark:ring-white/10`}
        >
          <div className="relative aspect-[3/4] grow overflow-hidden rounded-xl bg-[#EEFCFC] dark:bg-white/5 sm:aspect-[4/5]">
            <Image
              src={member.img}
              alt={member.name}
              fill
              sizes="(min-width: 1280px) 220px, (min-width: 1024px) 23vw, (min-width: 640px) 30vw, 46vw"
              className="object-cover object-center"
            />
          </div>
          <div className="px-2 pb-2 pt-3">
            <p className="flex items-start gap-1.5 text-[15px] font-semibold leading-snug text-[#003E45] dark:text-white">
              <span className="min-w-0">{member.name}</span>
              <ReactCountryFlag
                countryCode={member.country}
                svg
                aria-label={countryName(member.country)}
                style={{ width: "1.05em", height: "1.05em", flexShrink: 0, marginTop: "0.2em" }}
              />
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-[#555] dark:text-white/60">{member.role}</p>
          </div>
        </div>

        {/* Back: who they are. */}
        <div
          id={backId}
          aria-hidden={!turned}
          className={`${styles.face} ${styles.back} flex flex-col bg-[#003E45] p-3.5 text-white sm:p-5`}
        >
          <p className="text-[12px] font-semibold text-[#5CE1E6]">{GROUP_LABEL[group]}</p>
          <p className="mt-2 flex items-center gap-2 text-[13px] text-white/80">
            <ReactCountryFlag countryCode={member.country} svg aria-hidden style={{ width: "1.1em", height: "1.1em" }} />
            {countryName(member.country)}
          </p>
          <p className="mt-3 border-t border-white/15 pt-3 text-[12px] leading-[1.5] text-white/80 sm:text-[13px] sm:leading-[1.55]">
            <strong className="font-semibold text-white">{member.name}</strong> serves as{" "}
            <strong className="font-semibold text-white">{member.role}</strong> at the Mikaelson Initiative, helping
            advance our mission to empower communities through education, innovation, and intentional growth.
          </p>
          <p className="mt-auto flex items-center gap-1.5 pt-4 text-[12px] font-medium text-white/60">
            <RotateCcw aria-hidden className="size-3.5" /> Turn back
          </p>
        </div>
      </div>

      <button
        type="button"
        className={styles.hit}
        aria-expanded={turned}
        aria-controls={backId}
        aria-label={turned ? `Turn ${firstName}'s card back` : `About ${member.name}, ${member.role}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    </li>
  );
}

const TEAMS: GroupId[] = ["OPERATIONS", "TECH", "DESIGN"];

// Wide gaps: the scroll line draws a loop around each card.
const GRID = "grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4 xl:grid-cols-5";

function Group({
  id,
  members,
  title,
  intro,
  level = 2,
}: {
  id: GroupId;
  members: TeamMember[];
  title?: string;
  intro?: string;
  level?: 2 | 3;
}) {
  const headingId = `group-${id.toLowerCase()}`;
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div>
      <Heading
        id={headingId}
        className={
          level === 2
            ? "text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#003E45] dark:text-white sm:text-[40px]"
            : "text-[19px] font-semibold text-[#003E45] dark:text-white sm:text-[22px]"
        }
      >
        {title ?? GROUP_LABEL[id]}
      </Heading>
      {intro ? (
        <p className="mt-3 max-w-[60ch] text-base leading-[1.7] text-[#555] dark:text-white/65 sm:text-[18px]">{intro}</p>
      ) : null}
      <ul aria-labelledby={headingId} className={`${GRID} ${level === 2 ? "mt-10" : "mt-5"}`}>
        {members.map((m) => (
          <PersonCard key={m.name} member={m} group={id} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Everyone as portrait cards, grouped the way people talk about a
 * non-profit: who leads it, who guides it, and the team doing the work.
 * Each card turns over for role, country and bio.
 */
export function TeamBoard() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      q
        ? TEAM_MEMBERS.filter((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
        : TEAM_MEMBERS,
    [q],
  );

  const byGroup = useMemo(() => {
    const map = {} as Record<GroupId, TeamMember[]>;
    ALL_GROUPS.forEach((g) => (map[g] = membersOf(g, filtered)));
    return map;
  }, [filtered]);

  const teamCount = TEAMS.reduce((n, t) => n + byGroup[t].length, 0);

  return (
    <div id="people">
      {/* Calm search strip: 30 people is enough to want it. */}
      <div className="border-y border-[#003E45]/10 bg-[#EEFCFC] dark:border-white/10 dark:bg-[#0E1819]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <label htmlFor="team-search" className="text-[15px] font-medium text-[#003E45] dark:text-white">
            Looking for someone?
          </label>
          <div className="w-full sm:max-w-sm">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#555] dark:text-white/60"
              />
              <input
                id="team-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or role"
                autoComplete="off"
                className="h-12 w-full rounded-full border border-[#003E45]/15 bg-white pl-11 pr-4 text-base text-[#111] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#777] focus:border-[#0097A7] focus:ring-2 focus:ring-[#0097A7]/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/45"
              />
            </div>
            <p aria-live="polite" className="mt-1 min-h-5 px-4 text-[13px] text-[#555] dark:text-white/60">
              {q ? `${filtered.length} of ${TEAM_MEMBERS.length} people match` : ""}
            </p>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <section className="bg-white py-20 dark:bg-[#0B1213]">
          <div className="mx-auto max-w-xl px-4 text-center">
            <p className="text-[19px] font-semibold text-[#003E45] dark:text-white">
              No one matches &ldquo;{query.trim()}&rdquo;
            </p>
            <p className="mt-2 text-base text-[#555] dark:text-white/65">
              Try a first name, or a role such as engineer or designer.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#003E45]/30 px-5 text-[15px] font-semibold text-[#003E45] transition-[transform,border-color] duration-150 hover:border-[#003E45] active:scale-[0.97] motion-reduce:active:scale-100 dark:border-white/25 dark:text-white"
            >
              Show everyone
            </button>
          </div>
        </section>
      ) : (
        <>
          {byGroup.LEADS.length > 0 || byGroup.BOARD.length > 0 ? (
            <section className="bg-white py-20 dark:bg-[#0B1213] sm:py-24 lg:py-28">
              <div className="mx-auto w-full max-w-[1200px] space-y-20 px-4 sm:px-6 lg:px-8">
                {byGroup.BOARD.length > 0 ? (
                  <Group
                    id="BOARD"
                    members={byGroup.BOARD}
                    intro="The trustees and advisors who guide the Initiative."
                  />
                ) : null}
                {byGroup.LEADS.length > 0 ? (
                  <Group id="LEADS" members={byGroup.LEADS} title="Leading the team" />
                ) : null}
              </div>
            </section>
          ) : null}

          {teamCount > 0 ? (
            <section aria-labelledby="the-team" className="bg-[#EEFCFC] py-20 dark:bg-[#0E1819] sm:py-24 lg:py-28">
              <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <h2
                  id="the-team"
                  className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#003E45] dark:text-white sm:text-[40px]"
                >
                  Our team of impact
                </h2>
                <p className="mt-3 max-w-[60ch] text-base leading-[1.7] text-[#555] dark:text-white/65 sm:text-[18px]">
                  Shaping the future of Africa with community backed by sustainable technology. Turn a card over to
                  read about the person.
                </p>
                <div className="mt-12 space-y-16">
                  {TEAMS.filter((t) => byGroup[t].length > 0).map((t) => (
                    <Group key={t} id={t} members={byGroup[t]} level={3} />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
