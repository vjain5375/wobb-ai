import {
  getInfluencerTier,
  getTierLabel,
  TIER_STYLES,
} from "@/utils/influenceScore";

interface TierBadgeProps {
  followers: number;
  className?: string;
}

export function TierBadge({ followers, className = "" }: TierBadgeProps) {
  const tier = getInfluencerTier(followers);
  const styles = TIER_STYLES[tier];

  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
        styles.bg,
        styles.text,
        className,
      ].join(" ")}
    >
      {getTierLabel(tier)}
    </span>
  );
}
