import type { UserProfileSummary } from "@/types";

export type InfluencerTier = "icon" | "mega" | "macro" | "micro" | "nano";

const TIER_THRESHOLDS: { tier: InfluencerTier; min: number; label: string }[] = [
  { tier: "icon", min: 100_000_000, label: "Icon" },
  { tier: "mega", min: 10_000_000, label: "Mega" },
  { tier: "macro", min: 1_000_000, label: "Macro" },
  { tier: "micro", min: 100_000, label: "Micro" },
  { tier: "nano", min: 0, label: "Nano" },
];

export function getInfluencerTier(followers: number): InfluencerTier {
  return (
    TIER_THRESHOLDS.find((t) => followers >= t.min)?.tier ?? "nano"
  );
}

export function getTierLabel(tier: InfluencerTier): string {
  return TIER_THRESHOLDS.find((t) => t.tier === tier)?.label ?? "Nano";
}

export const TIER_STYLES: Record<
  InfluencerTier,
  { bg: string; text: string; ring: string }
> = {
  icon: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    ring: "#f59e0b",
  },
  mega: {
    bg: "bg-violet-500/15",
    text: "text-violet-400",
    ring: "#8b5cf6",
  },
  macro: {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    ring: "#0ea5e9",
  },
  micro: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    ring: "#10b981",
  },
  nano: {
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    ring: "#64748b",
  },
};

/** 0–100 composite score from reach + engagement */
export function getInfluenceScore(profile: UserProfileSummary): number {
  const followerScore = Math.min(
    100,
    (Math.log10(Math.max(profile.followers, 1)) / 9) * 100
  );
  const engagementScore = Math.min(
    100,
    (profile.engagement_rate ?? 0) * 100 * 25
  );
  return Math.round(followerScore * 0.55 + engagementScore * 0.45);
}
