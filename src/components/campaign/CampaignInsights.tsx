import { memo, useMemo } from "react";
import { Lightbulb } from "lucide-react";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { generateCampaignInsights } from "@/utils/campaignInsights";

export const CampaignInsights = memo(function CampaignInsights() {
  const profiles = useSelectedListStore((s) => s.profiles);
  const insights = useMemo(
    () => generateCampaignInsights(profiles),
    [profiles]
  );

  if (insights.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-[var(--border)] space-y-2">
      <div className="flex items-center gap-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-[var(--accent)]" />
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)]">
          Smart Insights
        </p>
      </div>
      <ul className="space-y-1.5 list-none p-0 m-0">
        {insights.slice(0, 3).map((insight) => (
          <li
            key={insight}
            className="text-[11px] leading-relaxed text-[var(--text)] pl-3 border-l-2 border-[var(--accent)]/40"
          >
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
});
