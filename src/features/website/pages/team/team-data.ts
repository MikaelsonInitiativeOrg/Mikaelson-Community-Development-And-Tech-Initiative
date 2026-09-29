import { FILTERS, TEAM_MEMBERS as ALL_MEMBERS, type FilterType, type TeamMember } from "@/constants";

// Everything comes from TEAM_MEMBERS / FILTERS in @/constants, as the
// current /team page uses them, minus the people the user asked to take
// off this page (the real /team page is unchanged). Counts are computed,
// never typed in.

const REMOVED = new Set([
  "Ajigbayi Oluwafemi Tosin",
  "Fashoyin Olujimi Temitope",
  "Shukurat O. Abdulkadir",
  "Inioluwa Afolabi",
  "Okikiolu Eniola-Glory Fiyinfoluwa",
  "Hammed Abibat",
  "Precious Oparanozie",
  "Neh Glory Anye",
  "Sodeeq Badejoko",
]);

export const TEAM_MEMBERS = ALL_MEMBERS.filter((m) => !REMOVED.has(m.name));

export type GroupId = Exclude<FilterType, "ALL">;

export const GROUP_LABEL: Record<GroupId, string> = {
  BOARD: FILTERS.BOARD,
  LEADS: FILTERS.LEADS,
  OPERATIONS: FILTERS.OPERATIONS,
  TECH: FILTERS.TECH,
  DESIGN: FILTERS.DESIGN,
};

export const ALL_GROUPS: GroupId[] = ["BOARD", "LEADS", "OPERATIONS", "TECH", "DESIGN"];

export function membersOf(group: GroupId, list: TeamMember[] = TEAM_MEMBERS) {
  return list.filter((m) => m.department === group);
}

const COUNTRY: Record<string, string> = { NG: "Nigeria", KE: "Kenya", GH: "Ghana" };
export const countryName = (code: string) => COUNTRY[code] ?? code;

export type { TeamMember };
