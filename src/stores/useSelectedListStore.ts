import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface SelectedProfile extends UserProfileSummary {
  platform: Platform;
  addedAt: number;
}

interface SelectedListState {
  profiles: SelectedProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => boolean;
  removeProfile: (username: string) => void;
  isInList: (username: string) => boolean;
  clearList: () => void;
}

export const useSelectedListStore = create<SelectedListState>()(
  persist(
    (set, get) => ({
      profiles: [],
      addProfile: (profile, platform) => {
        if (get().profiles.some((p) => p.username === profile.username)) {
          return false;
        }
        set({
          profiles: [
            ...get().profiles,
            { ...profile, platform, addedAt: Date.now() },
          ],
        });
        return true;
      },
      removeProfile: (username) => {
        set({
          profiles: get().profiles.filter((p) => p.username !== username),
        });
      },
      isInList: (username) =>
        get().profiles.some((p) => p.username === username),
      clearList: () => set({ profiles: [] }),
    }),
    { name: "wobb-selected-profiles" }
  )
);
