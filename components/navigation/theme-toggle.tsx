"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const subscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();
  const reduce = useReducedMotion();
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
  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const value = next === systemTheme ? "system" : next;
    if (reduce || !document.startViewTransition) return setTheme(value);

    // Circular reveal of the new theme, growing out of the toggle.
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const root = document.documentElement;
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(() => flushSync(() => setTheme(value)));
    transition.ready.then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 500,
          easing: `cubic-bezier(${easeOutExpo.join(",")})`,
          pseudoElement: "::view-transition-new(root)",
        },
      ),
    );
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  };

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
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.25, ease: easeOutExpo }}
          className="inline-flex"
        >
          <Icon aria-hidden className="size-[18px]" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
