"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const order = ["light", "dark", "system"] as const;
const icons = { light: Sun, dark: Moon, system: Monitor };

const subscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // Theme is unknown during SSR; render a neutral icon until hydrated.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const current = (mounted && order.find((t) => t === theme)) || "system";
  const next = order[(order.indexOf(current) + 1) % order.length];
  const Icon = icons[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${current}. Switch to ${next}.`}
      title={`Theme: ${current}`}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
