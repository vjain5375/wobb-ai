import { memo } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useCompareStore } from "@/stores/useCompareStore";
import { useUIStore } from "@/stores/useUIStore";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { InfluenceRing } from "@/components/profile/InfluenceRing";
import { TierBadge } from "@/components/profile/TierBadge";
import { VerifiedBadge } from "@/components/profile/VerifiedBadge";
import { Button } from "@/components/ui/Button";
import {
  formatEngagementRate,
  formatFollowers,
} from "@/utils/formatters";
import {
  getInfluenceScore,
  getInfluencerTier,
  TIER_STYLES,
} from "@/utils/influenceScore";

export const CompareModal = memo(function CompareModal() {
  const { compareOpen, setCompareOpen } = useUIStore();
  const { profiles, clearCompare } = useCompareStore(
    useShallow((s) => ({
      profiles: s.profiles,
      clearCompare: s.clearCompare,
    }))
  );

  if (!compareOpen || profiles.length < 2) return null;

  const metricRows = [
    { key: "score", label: "Influence Score" },
    { key: "followers", label: "Followers" },
    { key: "engagement", label: "Engagement" },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Compare creators"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={() => setCompareOpen(false)}
          aria-label="Close compare view"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-h)]">
                Head-to-Head Compare
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Side-by-side creator intelligence
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                Clear pins
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCompareOpen(false)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div
            className="grid gap-4 p-6"
            style={{
              gridTemplateColumns: `repeat(${profiles.length}, minmax(0, 1fr))`,
            }}
          >
            {profiles.map((profile) => {
              const score = getInfluenceScore(profile);
              const tier = getInfluencerTier(profile.followers);
              return (
                <div
                  key={profile.username}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-4"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <Avatar
                      src={profile.picture}
                      alt={profile.fullname}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <p className="font-bold text-[var(--text-h)]">
                          @{profile.username}
                        </p>
                        <VerifiedBadge verified={profile.is_verified} />
                      </div>
                      <p className="text-sm text-[var(--text-muted)]">
                        {profile.fullname}
                      </p>
                      <div className="flex justify-center gap-2 mt-2">
                        <PlatformBadge platform={profile.platform} />
                        <TierBadge followers={profile.followers} />
                      </div>
                    </div>
                    <InfluenceRing
                      score={score}
                      size={64}
                      color={TIER_STYLES[tier].ring}
                    />
                  </div>

                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                      <dt className="text-[var(--text-muted)]">Followers</dt>
                      <dd className="font-semibold text-[var(--text-h)] tabular-nums">
                        {formatFollowers(profile.followers)}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                      <dt className="text-[var(--text-muted)]">Engagement</dt>
                      <dd className="font-semibold text-[var(--text-h)] tabular-nums">
                        {formatEngagementRate(profile.engagement_rate)}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <dt className="text-[var(--text-muted)]">Score</dt>
                      <dd className="font-semibold text-[var(--accent)] tabular-nums">
                        {score}/100
                      </dd>
                    </div>
                  </dl>

                  <Link
                    to={`/profile/${profile.username}?platform=${profile.platform}`}
                    onClick={() => setCompareOpen(false)}
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      View profile
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="px-6 pb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <th className="pb-2 font-medium">Metric</th>
                  {profiles.map((p) => (
                    <th key={p.username} className="pb-2 font-medium text-center">
                      @{p.username}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metricRows.map((metric) => {
                    const values = profiles.map((p) => {
                      if (metric.key === "score") return getInfluenceScore(p);
                      if (metric.key === "followers") return p.followers;
                      return p.engagement_rate ?? 0;
                    });
                    const best = Math.max(...values);

                    return (
                      <tr key={metric.key} className="border-t border-[var(--border)]">
                        <td className="py-2.5 text-[var(--text-muted)]">
                          {metric.label}
                        </td>
                        {profiles.map((p, i) => {
                          const display =
                            metric.key === "score"
                              ? getInfluenceScore(p)
                              : metric.key === "followers"
                                ? formatFollowers(p.followers)
                                : formatEngagementRate(p.engagement_rate);
                          const isBest = values[i] === best;
                          return (
                            <td
                              key={p.username}
                              className={[
                                "py-2.5 text-center font-medium tabular-nums",
                                isBest ? "text-[var(--accent)]" : "text-[var(--text-h)]",
                              ].join(" ")}
                            >
                              {display}
                              {isBest && " ★"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
