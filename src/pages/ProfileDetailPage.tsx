import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, GitCompareArrows } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Button } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/profile/VerifiedBadge";
import { TierBadge } from "@/components/profile/TierBadge";
import { InfluenceRing } from "@/components/profile/InfluenceRing";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { CreatorRadar } from "@/components/profile/CreatorRadar";
import { SimilarCreators } from "@/components/profile/SimilarCreators";
import { AddToListButton } from "@/components/profile/AddToListButton";
import type { Platform } from "@/types";
import { useProfile } from "@/hooks/useProfile";
import { useCompareStore } from "@/stores/useCompareStore";
import {
  getInfluenceScore,
  getInfluencerTier,
  TIER_STYLES,
} from "@/utils/influenceScore";

function isPlatform(value: string | null): value is Platform {
  return value === "instagram" || value === "youtube" || value === "tiktok";
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platformParam = searchParams.get("platform");
  const platform: Platform = isPlatform(platformParam) ? platformParam : "instagram";

  const { profile: profileData, isLoading, error } = useProfile(username);
  const { toggleCompare, isComparing } = useCompareStore();
  const comparing = username ? isComparing(username) : false;

  if (!username) {
    return (
      <Layout title="Invalid profile">
        <p className="text-[var(--text-muted)] mb-4">This profile link is invalid.</p>
        <Link to="/">
          <Button variant="secondary">Back to discovery</Button>
        </Link>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center gap-6 animate-pulse text-left">
          <div className="w-28 h-28 rounded-full bg-[var(--surface-elevated)]" />
          <div className="space-y-3 flex-1">
            <div className="h-8 w-56 bg-[var(--surface-elevated)] rounded-xl" />
            <div className="h-4 w-36 bg-[var(--surface-elevated)] rounded-lg" />
            <div className="h-20 w-full max-w-lg bg-[var(--surface-elevated)] rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-red-400 mb-4" role="alert">
          {error ?? `Could not load profile details for @${username}`}
        </p>
        <Link to="/">
          <Button variant="secondary">Back to discovery</Button>
        </Link>
      </Layout>
    );
  }

  const user = profileData.data.user_profile;
  const score = getInfluenceScore(user);
  const tier = getInfluencerTier(user.followers);

  return (
    <Layout title={user.fullname} subtitle={`@${user.username}`}>
      <div className="text-left max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-h)] mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)] rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Back to discovery
        </Link>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[var(--accent)]/20 via-[var(--glow-2)] to-[var(--glow-3)]" />

          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar
                src={user.picture}
                alt={`${user.fullname}'s profile picture`}
                size="xl"
                className="ring-4 ring-[var(--bg)]"
              />

              <div className="flex-1 min-w-0 space-y-4 pt-14 sm:pt-16">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-2xl font-extrabold text-[var(--text-h)]">
                        @{user.username}
                      </h2>
                      <VerifiedBadge verified={user.is_verified} />
                      <TierBadge followers={user.followers} />
                      <PlatformBadge platform={platform} />
                    </div>
                    <p className="text-[var(--text)] text-lg">{user.fullname}</p>
                  </div>
                  <InfluenceRing
                    score={score}
                    size={72}
                    color={TIER_STYLES[tier].ring}
                  />
                </div>

                {user.description && (
                  <p className="text-sm text-[var(--text)] leading-relaxed max-w-prose">
                    {user.description}
                  </p>
                )}

                <ProfileStats profile={user} />

                <div className="flex flex-wrap gap-3 pt-2">
                  {user.url && (
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="w-4 h-4" aria-hidden />
                        View on platform
                      </Button>
                    </a>
                  )}
                  <AddToListButton profile={user} platform={platform} />
                  <Button
                    variant={comparing ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => toggleCompare(user, platform)}
                  >
                    <GitCompareArrows className="w-4 h-4" aria-hidden />
                    {comparing ? "Pinned for compare" : "Pin to compare"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6 max-w-3xl">
          <CreatorRadar profile={user} />
        </div>

        <SimilarCreators profile={user} platform={platform} />
      </div>
    </Layout>
  );
}
