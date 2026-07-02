import type { Platform, UserProfileSummary } from "@/types";
import { getAllSearchableProfiles } from "@/utils/globalSearch";
import { getInfluenceScore, getInfluencerTier } from "@/utils/influenceScore";

export function findSimilarCreators(
  profile: UserProfileSummary,
  platform: Platform,
  limit = 4
): (UserProfileSummary & { platform: Platform; similarity: number })[] {
  const tier = getInfluencerTier(profile.followers);
  const score = getInfluenceScore(profile);

  return getAllSearchableProfiles()
    .filter(
      (p) =>
        p.username !== profile.username &&
        (p.platform === platform || getInfluencerTier(p.followers) === tier)
    )
    .map((p) => {
      const scoreDiff = Math.abs(getInfluenceScore(p) - score);
      const followerRatio =
        Math.min(p.followers, profile.followers) /
        Math.max(p.followers, profile.followers);
      const platformBonus = p.platform === platform ? 15 : 0;
      const verifiedBonus =
        p.is_verified === profile.is_verified ? 5 : 0;
      const similarity = Math.round(
        followerRatio * 50 + (100 - scoreDiff) * 0.35 + platformBonus + verifiedBonus
      );
      return { ...p, similarity: Math.min(99, Math.max(1, similarity)) };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/** Deterministic daily spotlight — same creator all day, rotates daily */
export function getDailySpotlight(): UserProfileSummary & { platform: Platform } {
  const all = getAllSearchableProfiles();
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return all[dayIndex % all.length];
}
