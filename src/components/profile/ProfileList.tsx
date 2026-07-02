import { memo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { useUIStore } from "@/stores/useUIStore";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileBentoCard } from "@/components/profile/ProfileBentoCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export const ProfileList = memo(function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  const viewMode = useUIStore((s) => s.viewMode);

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="text-5xl mb-4" aria-hidden>
          🔍
        </div>
        <h3 className="font-display text-lg font-bold text-[var(--text-h)] mb-1">
          No signal found
        </h3>
        <p className="text-sm text-[var(--text-muted)] max-w-sm">
          Try a different search term or platform. Press{" "}
          <kbd className="font-mono text-xs px-1.5 py-0.5 rounded border border-[var(--border)]">
            Ctrl+K
          </kbd>{" "}
          to search globally.
        </p>
      </div>
    );
  }

  if (viewMode === "bento") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profiles.map((profile, index) => (
          <ProfileBentoCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-3 list-none p-0 m-0" role="list">
      {profiles.map((profile, index) => (
        <li key={profile.user_id}>
          <ProfileCard profile={profile} platform={platform} index={index} />
        </li>
      ))}
    </ul>
  );
});
