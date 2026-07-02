import { memo } from "react";
import type { Platform } from "@/types";
import { extractProfiles } from "@/utils/dataHelpers";
import { formatFollowers } from "@/utils/formatters";

const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

function getPlatformStats() {
  return PLATFORMS.map((platform) => {
    const profiles = extractProfiles(platform);
    const totalFollowers = profiles.reduce((s, p) => s + p.followers, 0);
    const topCreator = [...profiles].sort((a, b) => b.followers - a.followers)[0];
    return {
      platform,
      count: profiles.length,
      totalFollowers,
      top: topCreator?.username ?? "—",
    };
  });
}

export const LiveTicker = memo(function LiveTicker() {
  const stats = getPlatformStats();
  const items = stats.flatMap((s) => [
    `${s.platform.toUpperCase()}: ${s.count} creators tracked`,
    `${s.platform} reach: ${formatFollowers(s.totalFollowers)}`,
    `${s.platform} #1: @${s.top}`,
  ]);

  const doubled = [...items, ...items];

  return (
    <div className="ticker-wrap rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 overflow-hidden mb-5" aria-hidden>
      <div className="ticker-track">
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`} className="ticker-item">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block mr-2" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
});
