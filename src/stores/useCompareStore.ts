import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface CompareProfile extends UserProfileSummary {
  platform: Platform;
}

interface CompareState {
  profiles: CompareProfile[];
  toggleCompare: (profile: UserProfileSummary, platform: Platform) => void;
  isComparing: (username: string) => boolean;
  clearCompare: () => void;
  removeFromCompare: (username: string) => void;
}

const MAX_COMPARE = 3;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      profiles: [],
      toggleCompare: (profile, platform) => {
        const existing = get().profiles.find(
          (p) => p.username === profile.username
        );
        if (existing) {
          set({
            profiles: get().profiles.filter(
              (p) => p.username !== profile.username
            ),
          });
          return;
        }
        if (get().profiles.length >= MAX_COMPARE) return;
        set({
          profiles: [...get().profiles, { ...profile, platform }],
        });
      },
      isComparing: (username) =>
        get().profiles.some((p) => p.username === username),
      clearCompare: () => set({ profiles: [] }),
      removeFromCompare: (username) =>
        set({
          profiles: get().profiles.filter((p) => p.username !== username),
        }),
    }),
    { name: "wobb-compare-pins" }
  )
);
