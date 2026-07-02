import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ArrowLeft, Lightbulb, Presentation } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Layout } from "@/components/layout/Layout";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { useUIStore } from "@/stores/useUIStore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import {
  estimateCampaignValue,
  generateCampaignInsights,
  getReachChartData,
} from "@/utils/campaignInsights";
import { formatFollowers } from "@/utils/formatters";
import { getInfluenceScore } from "@/utils/influenceScore";

export function CampaignBriefPage() {
  const { profiles, clearList } = useSelectedListStore(
    useShallow((s) => ({ profiles: s.profiles, clearList: s.clearList }))
  );
  const setPitchOpen = useUIStore((s) => s.setPitchOpen);

  const stats = useMemo(() => {
    if (profiles.length === 0) return null;
    const totalReach = profiles.reduce((s, p) => s + p.followers, 0);
    const avgEng =
      profiles.reduce((s, p) => s + (p.engagement_rate ?? 0), 0) / profiles.length;
    const estimatedValue = estimateCampaignValue(profiles);
    const chartData = getReachChartData(profiles);
    const insights = generateCampaignInsights(profiles);
    return { totalReach, avgEng, estimatedValue, chartData, insights };
  }, [profiles]);

  if (profiles.length === 0) {
    return (
      <Layout hideSidebar title="Campaign Brief">
        <div className="text-center py-20">
          <p className="text-5xl mb-4" aria-hidden>📊</p>
          <h2 className="text-xl font-bold text-[var(--text-h)] mb-2">
            No campaign data yet
          </h2>
          <p className="text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
            Add creators to your deck first, then come back for the full campaign intelligence report.
          </p>
          <Link to="/">
            <Button>Discover Creators</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideSidebar title="Campaign Brief" subtitle="Your roster, analyzed">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-h)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to discovery
      </Link>

      <div className="space-y-6 text-left">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setPitchOpen(true)}>
            <Presentation className="w-4 h-4" />
            Launch Pitch Mode
          </Button>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Creators</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--text-h)]">
                  <AnimatedNumber value={profiles.length} />
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Combined Reach</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--text-h)]">
                  <AnimatedNumber value={stats.totalReach} format={formatFollowers} />
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Avg Engagement</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--text-h)]">
                  {(stats.avgEng * 100).toFixed(2)}%
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Est. Campaign Value</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--accent)]">
                  <AnimatedNumber value={stats.estimatedValue} format={(n) => `$${n.toLocaleString()}`} />
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[var(--text-h)] mb-4">
                  Reach Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData} layout="vertical" margin={{ left: 8 }}>
                      <XAxis type="number" tickFormatter={(v) => formatFollowers(v)} tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                      <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                      <Tooltip
                        formatter={(v) => formatFollowers(Number(v))}
                        contentStyle={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="reach" radius={[0, 6, 6, 0]}>
                        {stats.chartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-[var(--accent)]" />
                  <h3 className="text-sm font-bold text-[var(--text-h)]">
                    Campaign Intelligence
                  </h3>
                </div>
                <ul className="space-y-3 list-none p-0 m-0">
                  {stats.insights.map((insight) => (
                    <li
                      key={insight}
                      className="text-sm text-[var(--text)] pl-4 border-l-2 border-[var(--accent)] py-1"
                    >
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[var(--text-h)] mb-4">
                Roster Breakdown
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profiles.map((p) => (
                  <Link
                    key={p.username}
                    to={`/profile/${p.username}?platform=${p.platform}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent-border)] transition-colors"
                  >
                    <Avatar src={p.picture} alt={p.fullname} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-h)] truncate">
                        @{p.username}
                      </p>
                      <div className="flex items-center gap-2">
                        <PlatformBadge platform={p.platform} />
                        <span className="text-[10px] text-[var(--accent)] font-semibold">
                          {getInfluenceScore(p)}/100
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearList} className="text-red-400">
                Clear entire deck
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
