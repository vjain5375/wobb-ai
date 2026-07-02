import type { Platform } from "@/types";
import { getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

const platformStyles: Record<Platform, string> = {
  instagram: "bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-pink-600 dark:text-pink-300",
  youtube: "bg-red-500/10 text-red-600 dark:text-red-300",
  tiktok: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
};

export function PlatformBadge({ platform, className = "" }: PlatformBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        platformStyles[platform],
        className,
      ].join(" ")}
    >
      {getPlatformLabel(platform)}
    </span>
  );
}
