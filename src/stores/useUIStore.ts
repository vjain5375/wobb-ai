import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "bento" | "list";
export type SortOption = "followers" | "engagement" | "score" | "name";
export type Theme = "light" | "dark" | "system";

interface UIState {
  viewMode: ViewMode;
  sortBy: SortOption;
  theme: Theme;
  commandOpen: boolean;
  compareOpen: boolean;
  shortcutsOpen: boolean;
  pitchOpen: boolean;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortOption) => void;
  setTheme: (theme: Theme) => void;
  setCommandOpen: (open: boolean) => void;
  setCompareOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  setPitchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      viewMode: "bento",
      sortBy: "score",
      theme: "system",
      commandOpen: false,
      compareOpen: false,
      shortcutsOpen: false,
      pitchOpen: false,
      setViewMode: (viewMode) => set({ viewMode }),
      setSortBy: (sortBy) => set({ sortBy }),
      setTheme: (theme) => set({ theme }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setCompareOpen: (compareOpen) => set({ compareOpen }),
      setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
      setPitchOpen: (pitchOpen) => set({ pitchOpen }),
    }),
    {
      name: "wobb-ui-prefs",
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        theme: state.theme,
      }),
    }
  )
);
