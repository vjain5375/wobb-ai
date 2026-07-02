import type { Platform, UserProfileSummary } from "@/types";
import type { SelectedProfile } from "@/stores/useSelectedListStore";
import { formatFollowers } from "@/utils/formatters";
import { getInfluenceScore, getInfluencerTier, getTierLabel } from "@/utils/influenceScore";
import { getPlatformLabel } from "@/utils/dataHelpers";

export function estimatePostValue(profile: UserProfileSummary): number {
  const reach = profile.followers;
  const rate = profile.engagement_rate ?? 0.001;
  const verifiedBoost = profile.is_verified ? 1.35 : 1;
  return Math.round(reach * rate * 0.018 * verifiedBoost);
}

export function estimateCampaignValue(profiles: SelectedProfile[]): number {
  return profiles.reduce((sum, p) => sum + estimatePostValue(p), 0);
}

export function generateCampaignInsights(profiles: SelectedProfile[]): string[] {
  if (profiles.length === 0) return [];

  const insights: string[] = [];
  const totalReach = profiles.reduce((s, p) => s + p.followers, 0);
  const avgEng =
    profiles.reduce((s, p) => s + (p.engagement_rate ?? 0), 0) / profiles.length;

  const platformCounts = profiles.reduce<Record<string, number>>((acc, p) => {
    acc[p.platform] = (acc[p.platform] ?? 0) + 1;
    return acc;
  }, {});

  const dominant = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];
  const verifiedCount = profiles.filter((p) => p.is_verified).length;
  const topCreator = [...profiles].sort((a, b) => b.followers - a.followers)[0];
  const estimatedValue = estimateCampaignValue(profiles);

  insights.push(
    `Combined reach of ${formatFollowers(totalReach)} across ${profiles.length} creator${profiles.length > 1 ? "s" : ""}.`
  );

  if (dominant) {
    insights.push(
      `Roster is ${getPlatformLabel(dominant[0] as Platform)}-leaning (${dominant[1]} of ${profiles.length} creators).`
    );
  }

  if (verifiedCount > 0) {
    insights.push(
      `${verifiedCount} verified account${verifiedCount > 1 ? "s" : ""} — boosts brand trust signals.`
    );
  }

  if (avgEng > 0.01) {
    insights.push("Above-average engagement rate — strong audience activation potential.");
  } else if (avgEng < 0.003) {
    insights.push("Reach-heavy roster — ideal for awareness campaigns over direct response.");
  }

  if (topCreator) {
    insights.push(
      `@${topCreator.username} anchors the deck as your highest-reach ${getTierLabel(getInfluencerTier(topCreator.followers))} creator.`
    );
  }

  insights.push(
    `Estimated single-post campaign value: ~$${estimatedValue.toLocaleString()} (modeled).`
  );

  return insights;
}

export function getReachChartData(profiles: SelectedProfile[]) {
  return [...profiles]
    .sort((a, b) => b.followers - a.followers)
    .map((p) => ({
      name: `@${p.username}`,
      reach: p.followers,
      score: getInfluenceScore(p),
      fill: p.platform === "instagram" ? "#e1306c" : p.platform === "youtube" ? "#ff0000" : "#00f2ea",
    }));
}
