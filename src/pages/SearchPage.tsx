import { useMemo, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { ViewControls } from "@/components/search/ViewControls";
import { ProfileList } from "@/components/profile/ProfileList";
import { SpotlightHero } from "@/components/home/SpotlightHero";
import { LiveTicker } from "@/components/home/LiveTicker";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { sortProfiles } from "@/utils/sortProfiles";
import { useUIStore } from "@/stores/useUIStore";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const sortBy = useUIStore((s) => s.sortBy);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filteredProfiles = useMemo(() => {
    const filtered = filterProfiles(allProfiles, searchQuery);
    return sortProfiles(filtered, sortBy);
  }, [allProfiles, searchQuery, sortBy]);

  return (
    <Layout
      title="Discover Creators"
      subtitle="Intelligence-powered roster building across every major platform"
    >
      <div className="space-y-5 text-left">
        <LiveTicker />
        <SpotlightHero />

        <PlatformFilter
          selected={platform}
          onChange={(nextPlatform) => {
            setPlatform(nextPlatform);
            setSearchQuery("");
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ViewControls />

        <p className="text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--accent)]">
            {filteredProfiles.length}
          </span>{" "}
          creators · sorted by{" "}
          <span className="capitalize">{sortBy.replace("_", " ")}</span>
        </p>

        <ProfileList profiles={filteredProfiles} platform={platform} />
      </div>
    </Layout>
  );
}
