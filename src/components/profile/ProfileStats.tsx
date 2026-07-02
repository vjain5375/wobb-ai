import type { FullUserProfile } from "@/types";
import {
  formatEngagementRate,
  formatFollowers,
  formatNumber,
} from "@/utils/formatters";

interface ProfileStatsProps {
  profile: FullUserProfile;
}

interface StatItem {
  label: string;
  value: string;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const stats: StatItem[] = [
    { label: "Followers", value: formatFollowers(profile.followers) },
    {
      label: "Engagement Rate",
      value: formatEngagementRate(profile.engagement_rate),
    },
  ];

  if (profile.posts_count !== undefined) {
    stats.push({
      label: "Posts",
      value: formatNumber(profile.posts_count),
    });
  }

  if (profile.avg_likes !== undefined) {
    stats.push({
      label: "Avg Likes",
      value: formatFollowers(profile.avg_likes),
    });
  }

  if (profile.avg_comments !== undefined) {
    stats.push({
      label: "Avg Comments",
      value: formatNumber(profile.avg_comments),
    });
  }

  if (profile.avg_views !== undefined && profile.avg_views > 0) {
    stats.push({
      label: "Avg Views",
      value: formatFollowers(profile.avg_views),
    });
  }

  if (profile.engagements !== undefined) {
    stats.push({
      label: "Engagements",
      value: formatNumber(profile.engagements),
    });
  }

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
        >
          <dt className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</dt>
          <dd className="text-base font-semibold text-[var(--text-h)]">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
