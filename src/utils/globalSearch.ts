import type { Platform } from "@/types";
import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { SearchData, UserProfileSummary } from "@/types";
import { extractProfiles } from "@/utils/dataHelpers";

const allPlatformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export interface SearchableProfile extends UserProfileSummary {
  platform: Platform;
}

export function getAllSearchableProfiles(): SearchableProfile[] {
  return (Object.keys(allPlatformData) as Platform[]).flatMap((platform) =>
    extractProfiles(platform).map((profile) => ({ ...profile, platform }))
  );
}

export function searchAllProfiles(query: string): SearchableProfile[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getAllSearchableProfiles().filter(
    (p) =>
      p.username.toLowerCase().includes(normalized) ||
      p.fullname.toLowerCase().includes(normalized)
  );
}
