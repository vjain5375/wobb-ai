import { memo, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Presentation } from "lucide-react";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { useUIStore } from "@/stores/useUIStore";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { InfluenceRing } from "@/components/profile/InfluenceRing";
import { TierBadge } from "@/components/profile/TierBadge";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { getInfluenceScore } from "@/utils/influenceScore";
import { estimatePostValue } from "@/utils/campaignInsights";

export const PitchMode = memo(function PitchMode() {
  const { pitchOpen, setPitchOpen } = useUIStore();
  const profiles = useSelectedListStore((s) => s.profiles);
  const [slide, setSlide] = useState(0);

  const totalSlides = profiles.length + 1; // intro + each creator
  const isIntro = slide === 0;
  const current = profiles[slide - 1];

  const next = useCallback(() => {
    setSlide((s) => Math.min(s + 1, totalSlides - 1));
  }, [totalSlides]);

  const prev = useCallback(() => {
    setSlide((s) => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    if (!pitchOpen) {
      setSlide(0);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setPitchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pitchOpen, next, prev, setPitchOpen]);

  if (!pitchOpen || profiles.length === 0) return null;

  const totalReach = profiles.reduce((s, p) => s + p.followers, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-[var(--bg)] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Pitch mode presentation"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Presentation className="w-4 h-4 text-[var(--accent)]" />
            Pitch Mode · {slide + 1}/{totalSlides}
          </div>
          <button
            type="button"
            onClick={() => setPitchOpen(false)}
            className="p-2 rounded-xl hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
            aria-label="Exit pitch mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {isIntro ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-center max-w-2xl"
              >
                <p className="text-[var(--accent)] text-sm font-bold uppercase tracking-[0.3em] mb-4">
                  Campaign Roster
                </p>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-[var(--text-h)] mb-6 leading-tight">
                  {profiles.length} Creator{profiles.length > 1 ? "s" : ""}
                  <br />
                  <span className="text-[var(--accent)]">
                    {formatFollowers(totalReach)}
                  </span>{" "}
                  reach
                </h1>
                <p className="text-[var(--text-muted)] text-lg">
                  Press → or Space to walk through your deck
                </p>
                <div className="flex justify-center gap-3 mt-8 flex-wrap">
                  {profiles.map((p) => (
                    <Avatar key={p.username} src={p.picture} alt={p.fullname} size="md" />
                  ))}
                </div>
              </motion.div>
            ) : current ? (
              <motion.div
                key={current.username}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="flex flex-col sm:flex-row items-center gap-10 max-w-3xl"
              >
                <Avatar
                  src={current.picture}
                  alt={current.fullname}
                  size="xl"
                  className="w-36 h-36 ring-4 ring-[var(--accent)]/40"
                />
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                    <h2 className="text-3xl font-extrabold text-[var(--text-h)]">
                      @{current.username}
                    </h2>
                    <TierBadge followers={current.followers} />
                    <PlatformBadge platform={current.platform} />
                  </div>
                  <p className="text-xl text-[var(--text)] mb-6">{current.fullname}</p>
                  <div className="grid grid-cols-2 gap-4 text-left mb-6">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Followers</p>
                      <p className="text-2xl font-bold text-[var(--text-h)] tabular-nums">
                        {formatFollowers(current.followers)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Engagement</p>
                      <p className="text-2xl font-bold text-[var(--text-h)] tabular-nums">
                        {formatEngagementRate(current.engagement_rate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Est. Post Value</p>
                      <p className="text-2xl font-bold text-[var(--accent)] tabular-nums">
                        ${estimatePostValue(current).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <InfluenceRing score={getInfluenceScore(current)} size={56} />
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Influence</p>
                        <p className="text-lg font-bold text-[var(--text-h)]">
                          {getInfluenceScore(current)}/100
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 px-6 py-5 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={prev}
            disabled={slide === 0}
            className="p-3 rounded-xl border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--surface-hover)] transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                className={[
                  "w-2 h-2 rounded-full transition-all",
                  i === slide ? "bg-[var(--accent)] w-6" : "bg-[var(--border)]",
                ].join(" ")}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            disabled={slide === totalSlides - 1}
            className="p-3 rounded-xl border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--surface-hover)] transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
