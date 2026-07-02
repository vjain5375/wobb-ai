import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompareArrows } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { getInfluenceScore } from "@/utils/influenceScore";
import { useCompareStore } from "@/stores/useCompareStore";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/profile/VerifiedBadge";
import { TierBadge } from "@/components/profile/TierBadge";
import { InfluenceRing } from "@/components/profile/InfluenceRing";
import { AddToListButton } from "@/components/profile/AddToListButton";
import { Button } from "@/components/ui/Button";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index?: number;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  index = 0,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const score = getInfluenceScore(profile);
  const { toggleCompare, isComparing } = useCompareStore();
  const comparing = isComparing(profile.username);

  const handleNavigate = useCallback(() => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, platform, profile.username]);

  return (
    <motion.article
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNavigate();
        }
      }}
      className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl glass-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)]"
      aria-label={`View profile for ${profile.fullname}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={profile.picture}
          alt={`${profile.fullname}'s profile picture`}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[var(--text-h)] truncate">
              @{profile.username}
            </span>
            <VerifiedBadge verified={profile.is_verified} />
            <TierBadge followers={profile.followers} />
          </div>
          <p className="text-sm text-[var(--text)] truncate">{profile.fullname}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 tabular-nums">
            {formatFollowers(profile.followers)} ·{" "}
            {formatEngagementRate(profile.engagement_rate)} eng.
          </p>
        </div>
        <InfluenceRing score={score} size={44} className="hidden sm:flex" />
      </div>

      <div
        className="flex gap-2 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <AddToListButton profile={profile} platform={platform} size="sm" />
        <Button
          variant={comparing ? "primary" : "secondary"}
          size="sm"
          onClick={() => toggleCompare(profile, platform)}
          aria-label={comparing ? "Unpin from compare" : "Pin to compare"}
        >
          <GitCompareArrows className="w-4 h-4" />
        </Button>
      </div>
    </motion.article>
  );
});
