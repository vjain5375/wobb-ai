import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, Search, Shuffle, Users, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/useUIStore";
import { searchAllProfiles, getAllSearchableProfiles } from "@/utils/globalSearch";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { Avatar } from "@/components/ui/Avatar";

export const CommandPalette = memo(function CommandPalette() {
  const navigate = useNavigate();
  const { commandOpen, setCommandOpen } = useUIStore();
  const deckCount = useSelectedListStore((s) => s.profiles.length);
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchAllProfiles(query).slice(0, 8), [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandOpen, setCommandOpen]);

  useEffect(() => {
    if (!commandOpen) setQuery("");
  }, [commandOpen]);

  const handleSelect = (username: string, platform: string) => {
    setCommandOpen(false);
    navigate(`/profile/${username}?platform=${platform}`);
  };

  const handleShuffle = () => {
    const all = getAllSearchableProfiles();
    const pick = all[Math.floor(Math.random() * all.length)];
    if (pick) handleSelect(pick.username, pick.platform);
  };

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
            aria-label="Close command palette"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search creators across all platforms..."
                className="flex-1 bg-transparent text-[var(--text-h)] placeholder:text-[var(--text-muted)] outline-none text-sm"
                aria-label="Search command palette"
              />
              <kbd className="hidden sm:inline text-[10px] text-[var(--text-muted)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono">
                ESC
              </kbd>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {query.trim() === "" ? (
                <div className="p-2 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-2 py-1">
                    Quick actions
                  </p>
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-hover)] text-left transition-colors"
                  >
                    <Shuffle className="w-4 h-4 text-[var(--accent)]" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-h)]">
                        Discover random creator
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Roll the dice — find someone unexpected
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCommandOpen(false);
                      navigate("/campaign");
                    }}
                    disabled={deckCount === 0}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-hover)] text-left transition-colors disabled:opacity-40"
                  >
                    <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-h)]">
                        Open campaign brief
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Full analytics report for your deck
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCommandOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-hover)] text-left transition-colors"
                  >
                    <Users className="w-4 h-4 text-[var(--accent)]" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-h)]">
                        Go to discovery
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Browse creators by platform
                      </p>
                    </div>
                  </button>
                </div>
              ) : results.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">
                  No creators match &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul className="space-y-0.5 list-none p-0 m-0" role="listbox">
                  {results.map((profile) => (
                    <li key={`${profile.platform}-${profile.username}`}>
                      <button
                        type="button"
                        role="option"
                        onClick={() =>
                          handleSelect(profile.username, profile.platform)
                        }
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-hover)] text-left transition-colors"
                      >
                        <Avatar
                          src={profile.picture}
                          alt=""
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-h)] truncate">
                            @{profile.username}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {profile.fullname} · {getPlatformLabel(profile.platform)}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--surface-elevated)]/50 flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
              <Command className="w-3 h-3" />
              <span>
                <kbd className="font-mono">Ctrl</kbd>+<kbd className="font-mono">K</kbd> anywhere
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
