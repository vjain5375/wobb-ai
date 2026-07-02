import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Input } from "@/components/ui/Input";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const platformActiveStyles: Record<Platform, string> = {
  instagram: "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent shadow-md",
  youtube: "bg-red-600 text-white border-transparent shadow-md",
  tiktok: "bg-gray-900 text-white border-transparent shadow-md dark:bg-cyan-900",
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter by platform"
      >
        {PLATFORMS.map((platform) => {
          const isSelected = selected === platform;
          return (
            <button
              key={platform}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onChange(platform)}
              className={[
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)]",
                isSelected
                  ? platformActiveStyles[platform]
                  : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-hover)]",
              ].join(" ")}
            >
              {getPlatformLabel(platform)}
            </button>
          );
        })}
      </div>

      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by username or name..."
        withSearchIcon
        aria-label="Search influencers"
      />
    </div>
  );
}
