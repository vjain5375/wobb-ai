import { memo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], action: "Open command palette" },
  { keys: ["?"], action: "Show keyboard shortcuts" },
  { keys: ["Esc"], action: "Close any overlay" },
  { keys: ["G", "then", "D"], action: "Go to discovery (via palette)" },
  { keys: ["G", "then", "C"], action: "Go to campaign brief (via palette)" },
];

export const ShortcutsModal = memo(function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useUIStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "?" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setShortcutsOpen(!shortcutsOpen);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcutsOpen, setShortcutsOpen]);

  return (
    <AnimatePresence>
      {shortcutsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShortcutsOpen(false)}
            aria-label="Close shortcuts"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text-h)]">
                Keyboard Shortcuts
              </h2>
              <button
                type="button"
                onClick={() => setShortcutsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-3 list-none p-0 m-0">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.action}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-[var(--text)]">{s.action}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {s.keys.map((key, i) => (
                      <span key={`${s.action}-${key}-${i}`} className="flex items-center gap-1">
                        {i > 0 && key !== "then" && (
                          <span className="text-[var(--text-muted)] text-xs">+</span>
                        )}
                        {key === "then" ? (
                          <span className="text-[10px] text-[var(--text-muted)] mx-0.5">
                            then
                          </span>
                        ) : (
                          <kbd className="text-[10px] font-mono px-2 py-1 rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)]">
                            {key}
                          </kbd>
                        )}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
