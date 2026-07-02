import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { getPlatformLabel } from "@/utils/dataHelpers";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e1306c",
  youtube: "#ff0000",
  tiktok: "#00f2ea",
};

export function CampaignAnalytics() {
  const profiles = useSelectedListStore((s) => s.profiles);

  const stats = useMemo(() => {
    if (profiles.length === 0) return null;

    const totalReach = profiles.reduce((sum, p) => sum + p.followers, 0);
    const avgEngagement =
      profiles.reduce((sum, p) => sum + (p.engagement_rate ?? 0), 0) /
      profiles.length;

    const platformCounts = profiles.reduce<Record<string, number>>(
      (acc, p) => {
        acc[p.platform] = (acc[p.platform] ?? 0) + 1;
        return acc;
      },
      {}
    );

    const chartData = Object.entries(platformCounts).map(([platform, count]) => ({
      name: getPlatformLabel(platform as "instagram" | "youtube" | "tiktok"),
      value: count,
      platform,
    }));

    return { totalReach, avgEngagement, chartData };
  }, [profiles]);

  if (!stats) return null;

  return (
    <div className="px-4 py-3 border-b border-[var(--border)] space-y-3 bg-gradient-to-br from-[var(--accent-bg)] to-transparent">
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">
        Campaign Intel
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[var(--bg)]/60 px-3 py-2 border border-[var(--border)]">
          <p className="text-[10px] text-[var(--text-muted)]">Combined Reach</p>
          <p className="text-lg font-bold text-[var(--text-h)] tabular-nums leading-tight">
            {formatFollowers(stats.totalReach)}
          </p>
        </div>
        <div className="rounded-xl bg-[var(--bg)]/60 px-3 py-2 border border-[var(--border)]">
          <p className="text-[10px] text-[var(--text-muted)]">Avg Engagement</p>
          <p className="text-lg font-bold text-[var(--text-h)] tabular-nums leading-tight">
            {formatEngagementRate(stats.avgEngagement)}
          </p>
        </div>
      </div>

      {stats.chartData.length > 1 && (
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.chartData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={42}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.chartData.map((entry) => (
                  <Cell
                    key={entry.platform}
                    fill={PLATFORM_COLORS[entry.platform] ?? "#888"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
