"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();
  // Theme is unknown during SSR; render a neutral icon until hydrated.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const current = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  const isSystem = mounted && theme === "system";
  const Icon = current === "dark" ? Moon : Sun;

  // Every click visibly flips the theme; if the result matches the OS, follow the OS again.
  const toggle = () => setTheme(next === systemTheme ? "system" : next);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Theme: ${current}${isSystem ? " (system)" : ""}. Switch to ${next}.`}
      title={`Theme: ${current}${isSystem ? " (system)" : ""}`}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
