import { memo } from "react";
import { Link } from "react-router-dom";
import { Download, Trash2, X, Presentation, BarChart3 } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { useShallow } from "zustand/react/shallow";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { CampaignAnalytics } from "@/components/campaign/CampaignAnalytics";
import { CampaignInsights } from "@/components/campaign/CampaignInsights";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { VerifiedBadge } from "@/components/profile/VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";

interface CampaignDeckProps {
  onClose?: () => void;
  className?: string;
}

function exportRosterCsv(
  profiles: ReturnType<typeof useSelectedListStore.getState>["profiles"]
) {
  const header = "Username,Full Name,Platform,Followers,Engagement Rate,Verified\n";
  const rows = profiles
    .map(
      (p) =>
        `@${p.username},${p.fullname},${p.platform},${p.followers},${((p.engagement_rate ?? 0) * 100).toFixed(2)}%,${p.is_verified}`
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `roster-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export const CampaignDeck = memo(function CampaignDeck({
  onClose,
  className = "",
}: CampaignDeckProps) {
  const { profiles, removeProfile, clearList } = useSelectedListStore(
    useShallow((s) => ({
      profiles: s.profiles,
      removeProfile: s.removeProfile,
      clearList: s.clearList,
    }))
  );
  const setPitchOpen = useUIStore((s) => s.setPitchOpen);

  return (
    <aside
      className={[
        "flex flex-col h-full glass-card rounded-2xl overflow-hidden",
        className,
      ].join(" ")}
      aria-label="Campaign roster deck"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--border)]">
        <div>
          <h2 className="text-sm font-bold text-[var(--text-h)] tracking-tight">
            Campaign Deck
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {profiles.length} creator{profiles.length !== 1 ? "s" : ""} shortlisted
          </p>
        </div>
        <div className="flex items-center gap-1">
          {profiles.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPitchOpen(true)}
                aria-label="Launch pitch mode"
                title="Pitch Mode"
              >
                <Presentation className="w-4 h-4" />
              </Button>
              <Link to="/campaign" title="Campaign Brief">
                <Button variant="ghost" size="sm" aria-label="View campaign brief">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportRosterCsv(profiles)}
                aria-label="Export roster as CSV"
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearList}
                aria-label="Clear campaign deck"
              >
                Clear
              </Button>
            </>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close campaign deck"
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <CampaignAnalytics />
      <CampaignInsights />

      <div className="flex-1 overflow-y-auto p-3">
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-48 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center mb-3 text-2xl">
              📋
            </div>
            <p className="text-sm font-semibold text-[var(--text-h)] mb-1">
              Build your campaign deck
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Shortlist creators to see combined reach, engagement analytics,
              and export your roster.
            </p>
          </div>
        ) : (
          <ul className="space-y-2 list-none p-0 m-0" role="list">
            {profiles.map((profile, i) => (
              <li
                key={profile.username}
                className="deck-item flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 hover:border-[var(--accent-border)] transition-all"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link
                  to={`/profile/${profile.username}?platform=${profile.platform}`}
                  className="flex items-center gap-3 flex-1 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)]"
                >
                  <Avatar src={profile.picture} alt={profile.fullname} size="sm" />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-[var(--text-h)] truncate">
                        @{profile.username}
                      </span>
                      <VerifiedBadge verified={profile.is_verified} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PlatformBadge platform={profile.platform} />
                      <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
                        {formatFollowers(profile.followers)}
                      </span>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProfile(profile.username)}
                  aria-label={`Remove @${profile.username}`}
                  className="text-[var(--text-muted)] hover:text-red-400 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
});
