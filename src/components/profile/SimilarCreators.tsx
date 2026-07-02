import { memo } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { findSimilarCreators } from "@/utils/similarCreators";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { InfluenceRing } from "@/components/profile/InfluenceRing";
import { getInfluenceScore } from "@/utils/influenceScore";

interface SimilarCreatorsProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export const SimilarCreators = memo(function SimilarCreators({
  profile,
  platform,
}: SimilarCreatorsProps) {
  const similar = findSimilarCreators(profile, platform);

  if (similar.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby="similar-heading">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-[var(--accent)]" />
        <h3 id="similar-heading" className="text-sm font-bold text-[var(--text-h)]">
          Similar Creators
        </h3>
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
          AI-matched by tier &amp; score
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {similar.map((creator) => (
          <Link
            key={`${creator.platform}-${creator.username}`}
            to={`/profile/${creator.username}?platform=${creator.platform}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 hover:border-[var(--accent-border)] hover:-translate-y-0.5 transition-all"
          >
            <Avatar src={creator.picture} alt={creator.fullname} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-h)] truncate">
                @{creator.username}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <PlatformBadge platform={creator.platform} />
                <span className="text-[10px] font-semibold text-[var(--accent)]">
                  {creator.similarity}% match
                </span>
              </div>
            </div>
            <InfluenceRing
              score={getInfluenceScore(creator)}
              size={36}
            />
          </Link>
        ))}
      </div>
    </section>
  );
});
