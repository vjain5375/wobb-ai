import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { getDailySpotlight } from "@/utils/similarCreators";
import { getInfluenceScore } from "@/utils/influenceScore";
import { formatFollowers } from "@/utils/formatters";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { InfluenceRing } from "@/components/profile/InfluenceRing";
import { TierBadge } from "@/components/profile/TierBadge";

export const SpotlightHero = memo(function SpotlightHero() {
  const creator = getDailySpotlight();
  const score = getInfluenceScore(creator);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-[var(--accent-border)] spotlight-hero p-5 sm:p-6"
    >
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
        <Sparkles className="w-3.5 h-3.5" />
        Creator of the Day
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 mt-4">
        <Avatar
          src={creator.picture}
          alt={creator.fullname}
          size="xl"
          className="ring-4 ring-[var(--accent)]/30 shadow-xl shadow-[var(--accent)]/10"
        />

        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-h)]">
              @{creator.username}
            </h2>
            <TierBadge followers={creator.followers} />
            <PlatformBadge platform={creator.platform} />
          </div>
          <p className="text-[var(--text)] mb-2">{creator.fullname}</p>
          <p className="text-sm text-[var(--text-muted)]">
            {formatFollowers(creator.followers)} followers · Spotlight rotates daily
          </p>
        </div>

        <div className="flex items-center gap-4">
          <InfluenceRing score={score} size={60} />
          <Link
            to={`/profile/${creator.username}?platform=${creator.platform}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-[var(--accent)]/25"
          >
            Explore
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});
