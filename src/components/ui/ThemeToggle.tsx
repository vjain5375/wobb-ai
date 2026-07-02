import { Moon, Sun, Monitor } from "lucide-react";
import { useUIStore, type Theme } from "@/stores/useUIStore";

const THEMES: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" },
  { value: "system", icon: Monitor, label: "System theme" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  const cycle = () => {
    const idx = THEMES.findIndex((t) => t.value === theme);
    setTheme(THEMES[(idx + 1) % THEMES.length].value);
  };

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[2];
  const Icon = current.icon;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${current.label}. Click to change.`}
      className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-h)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-border)]"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
