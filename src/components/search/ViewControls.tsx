import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { useUIStore, type SortOption, type ViewMode } from "@/stores/useUIStore";
import { SORT_LABELS } from "@/utils/sortProfiles";

const SORT_OPTIONS: SortOption[] = ["score", "followers", "engagement", "name"];

export function ViewControls() {
  const { viewMode, sortBy, setViewMode, setSortBy } = useUIStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] p-1 bg-[var(--surface)]">
        {(
          [
            { mode: "bento" as ViewMode, icon: LayoutGrid, label: "Grid view" },
            { mode: "list" as ViewMode, icon: List, label: "List view" },
          ] as const
        ).map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            aria-label={label}
            aria-pressed={viewMode === mode}
            className={[
              "p-2 rounded-lg transition-colors",
              viewMode === mode
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-h)] hover:bg-[var(--surface-hover)]",
            ].join(" ")}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden />
        <label htmlFor="sort-select" className="sr-only">
          Sort creators by
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-h)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)] cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {SORT_LABELS[opt]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
