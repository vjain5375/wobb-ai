import type { UserProfileSummary } from "@/types";
import { getInfluenceScore } from "@/utils/influenceScore";
import type { SortOption } from "@/stores/useUIStore";

export function sortProfiles(
  profiles: UserProfileSummary[],
  sortBy: SortOption
): UserProfileSummary[] {
  const sorted = [...profiles];

  switch (sortBy) {
    case "followers":
      return sorted.sort((a, b) => b.followers - a.followers);
    case "engagement":
      return sorted.sort(
        (a, b) => (b.engagement_rate ?? 0) - (a.engagement_rate ?? 0)
      );
    case "score":
      return sorted.sort(
        (a, b) => getInfluenceScore(b) - getInfluenceScore(a)
      );
    case "name":
      return sorted.sort((a, b) =>
        a.fullname.localeCompare(b.fullname, undefined, { sensitivity: "base" })
      );
    default:
      return sorted;
  }
}

export const SORT_LABELS: Record<SortOption, string> = {
  score: "Influence Score",
  followers: "Followers",
  engagement: "Engagement",
  name: "Name A–Z",
};
