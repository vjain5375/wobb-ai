import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useCompareStore } from "@/stores/useCompareStore";
import { useUIStore } from "@/stores/useUIStore";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export const CompareBar = memo(function CompareBar() {
  const { profiles, removeFromCompare } = useCompareStore(
    useShallow((s) => ({
      profiles: s.profiles,
      removeFromCompare: s.removeFromCompare,
    }))
  );
  const { setCompareOpen } = useUIStore();

  if (profiles.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl"
      >
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl border border-[var(--accent-border)]">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider shrink-0 hidden sm:block">
            Compare
          </p>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {profiles.map((p) => (
              <div key={p.username} className="relative group shrink-0">
                <Avatar src={p.picture} alt={p.fullname} size="sm" />
                <button
                  type="button"
                  onClick={() => removeFromCompare(p.username)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${p.username}`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {profiles.length < 3 &&
              Array.from({ length: 3 - profiles.length }).map((_, i) => (
                <div
                  key={`slot-${i}`}
                  className="w-10 h-10 rounded-full border-2 border-dashed border-[var(--border)] shrink-0"
                  aria-hidden
                />
              ))}
          </div>

          <Button
            size="sm"
            onClick={() => setCompareOpen(true)}
            disabled={profiles.length < 2}
          >
            View
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
