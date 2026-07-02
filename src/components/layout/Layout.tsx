import { type ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Command, Layers, BarChart3 } from "lucide-react";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { useUIStore } from "@/stores/useUIStore";
import { CampaignDeck } from "@/components/campaign/CampaignDeck";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ShortcutsModal } from "@/components/command/ShortcutsModal";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareModal } from "@/components/compare/CompareModal";
import { PitchMode } from "@/components/campaign/PitchMode";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  hideSidebar?: boolean;
}

export function Layout({ children, title, subtitle, hideSidebar }: LayoutProps) {
  const [mobileDeckOpen, setMobileDeckOpen] = useState(false);
  const listCount = useSelectedListStore((s) => s.profiles.length);
  const { setCommandOpen, setShortcutsOpen } = useUIStore();

  return (
    <div className="min-h-screen mesh-bg text-[var(--text)] relative font-sans">
      <CommandPalette />
      <ShortcutsModal />
      <CompareBar />
      <CompareModal />
      <PitchMode />

      <header className="sticky top-0 z-30 border-b border-[var(--border)]/60 bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)] rounded-xl"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 group-hover:scale-105 transition-transform">
              <Layers className="w-4.5 h-4.5 text-white" aria-hidden />
            </div>
            <div className="text-left">
              <span className="block font-display font-bold text-[var(--text-h)] text-base leading-tight tracking-tight">
                Roster
              </span>
              <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                Creator Intel
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {listCount > 0 && (
              <Link to="/campaign" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4" />
                  Brief
                </Button>
              </Link>
            )}

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShortcutsOpen(true)}
              className="hidden sm:inline-flex text-[var(--text-muted)]"
              aria-label="Keyboard shortcuts"
            >
              <kbd className="text-[10px] font-mono border border-[var(--border)] rounded px-1.5 py-0.5">
                ?
              </kbd>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="hidden sm:inline-flex text-[var(--text-muted)]"
              aria-label="Open command palette"
            >
              <Command className="w-4 h-4" />
              <kbd className="ml-1 text-[10px] font-mono border border-[var(--border)] rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            </Button>

            {!hideSidebar && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMobileDeckOpen(true)}
                className="lg:hidden relative"
                aria-label={`Open campaign deck, ${listCount} creators`}
              >
                <Layers className="w-4 h-4" />
                Deck
                {listCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center">
                    {listCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div
          className={
            hideSidebar
              ? ""
              : "lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 items-start"
          }
        >
          <main className="min-w-0">
            {(title || subtitle) && (
              <div className="mb-8 text-left">
                {title && (
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight leading-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] max-w-xl">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </main>

          {!hideSidebar && (
            <div className="hidden lg:block sticky top-24">
              <CampaignDeck className="min-h-[calc(100vh-8rem)]" />
            </div>
          )}
        </div>
      </div>

      {!hideSidebar && mobileDeckOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Campaign deck"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileDeckOpen(false)}
            aria-label="Close campaign deck overlay"
          />
          <div className="absolute inset-x-0 bottom-0 top-16 p-4 animate-slide-up">
            <CampaignDeck
              onClose={() => setMobileDeckOpen(false)}
              className="h-full shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

