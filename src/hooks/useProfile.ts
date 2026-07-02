import { useEffect, useState } from "react";
import type { ProfileDetailResponse } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";

interface UseProfileResult {
  profile: ProfileDetailResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useProfile(username: string | undefined): UseProfileResult {
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    loadProfileByUsername(username)
      .then((data) => {
        if (cancelled) return;

        if (!data) {
          setError(`Could not load profile details for @${username}`);
          setProfile(null);
        } else {
          setError(null);
          setProfile(data);
        }

        setLoadedUsername(username);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Something went wrong while loading this profile.");
        setProfile(null);
        setLoadedUsername(username);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (!username) {
    return { profile: null, isLoading: false, error: null };
  }

  const isLoading = loadedUsername !== username;

  return { profile: isLoading ? null : profile, isLoading, error: isLoading ? null : error };
}
