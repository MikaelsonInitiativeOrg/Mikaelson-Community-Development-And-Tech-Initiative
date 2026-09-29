import { FILTERS, TEAM_MEMBERS, type FilterType, type TeamMember } from "@/constants";

// Everything comes from TEAM_MEMBERS / FILTERS in @/constants. Counts are
// computed, never typed in.

export { TEAM_MEMBERS };

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
