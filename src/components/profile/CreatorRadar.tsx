import { memo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { UserProfileSummary } from "@/types";
import { getInfluenceScore } from "@/utils/influenceScore";

interface CreatorRadarProps {
  profile: UserProfileSummary;
}

export const CreatorRadar = memo(function CreatorRadar({ profile }: CreatorRadarProps) {
  const score = getInfluenceScore(profile);
  const followerNorm = Math.min(100, (Math.log10(Math.max(profile.followers, 1)) / 9) * 100);
  const engagementNorm = Math.min(100, (profile.engagement_rate ?? 0) * 100 * 25);
  const trustNorm = profile.is_verified ? 95 : 40;
  const activityNorm = Math.min(100, ((profile.engagements ?? 0) / Math.max(profile.followers, 1)) * 10000);

  const data = [
    { axis: "Reach", value: Math.round(followerNorm) },
    { axis: "Engagement", value: Math.round(engagementNorm) },
    { axis: "Trust", value: trustNorm },
    { axis: "Activity", value: Math.round(activityNorm) },
    { axis: "Score", value: score },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
      <h3 className="text-sm font-bold text-[var(--text-h)] mb-1">Creator DNA</h3>
      <p className="text-[10px] text-[var(--text-muted)] mb-3 uppercase tracking-widest">
        Multi-axis profile analysis
      </p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            />
            <Radar
              dataKey="value"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
