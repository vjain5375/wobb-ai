import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompareArrows } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import {
  getInfluenceScore,
  getInfluencerTier,
  TIER_STYLES,
} from "@/utils/influenceScore";
import { useCompareStore } from "@/stores/useCompareStore";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/profile/VerifiedBadge";
import { InfluenceRing } from "@/components/profile/InfluenceRing";
import { TierBadge } from "@/components/profile/TierBadge";
import { AddToListButton } from "@/components/profile/AddToListButton";
import { Button } from "@/components/ui/Button";

interface ProfileBentoCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index: number;
}

export const ProfileBentoCard = memo(function ProfileBentoCard({
  profile,
  platform,
  index,
}: ProfileBentoCardProps) {
  const navigate = useNavigate();
  const score = getInfluenceScore(profile);
  const tier = getInfluencerTier(profile.followers);
  const ringColor = TIER_STYLES[tier].ring;

  const { toggleCompare, isComparing } = useCompareStore();
  const comparing = isComparing(profile.username);

  const handleNavigate = useCallback(() => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, platform, profile.username]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden text-left",
        "glass-card platform-glow cursor-pointer",
        "hover:-translate-y-1 transition-transform duration-300",
        index % 5 === 0 ? "sm:col-span-2" : "",
      ].join(" ")}
      style={{ "--platform-glow": ringColor } as React.CSSProperties}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNavigate();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${profile.fullname}`}
    >
      <div className="p-4 flex flex-col h-full gap-3">
        <div className="flex items-start justify-between gap-2">
          <Avatar
            src={profile.picture}
            alt={profile.fullname}
            size="lg"
            className="ring-2 ring-white/10"
          />
          <InfluenceRing score={score} size={52} color={ringColor} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[var(--text-h)] truncate">
              @{profile.username}
            </span>
            <VerifiedBadge verified={profile.is_verified} />
            <TierBadge followers={profile.followers} />
          </div>
          <p className="text-sm text-[var(--text)] mt-0.5 truncate">
            {profile.fullname}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-[var(--surface-elevated)]/60 px-2.5 py-2">
            <p className="text-[var(--text-muted)]">Followers</p>
            <p className="font-semibold text-[var(--text-h)] tabular-nums">
              {formatFollowers(profile.followers)}
            </p>
          </div>
          <div className="rounded-lg bg-[var(--surface-elevated)]/60 px-2.5 py-2">
            <p className="text-[var(--text-muted)]">Engagement</p>
            <p className="font-semibold text-[var(--text-h)] tabular-nums">
              {formatEngagementRate(profile.engagement_rate)}
            </p>
          </div>
        </div>

        <div
          className="flex gap-2 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToListButton profile={profile} platform={platform} size="sm" />
          <Button
            variant={comparing ? "primary" : "secondary"}
            size="sm"
            onClick={() => toggleCompare(profile, platform)}
            aria-label={
              comparing
                ? `Remove ${profile.username} from compare`
                : `Add ${profile.username} to compare`
            }
            className="flex-1"
          >
            <GitCompareArrows className="w-3.5 h-3.5" aria-hidden />
            {comparing ? "Pinned" : "Compare"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
});
