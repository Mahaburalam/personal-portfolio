"use client";

import { Bot } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { useSyncExternalStore } from "react";
import { Magnetic } from "@/components/animations/magnetic";
import { duration, easeOutExpo } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Scroll distance (px) after which the button appears — roughly past the hero. */
const THRESHOLD = 600;

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

/** Floating bottom-right button: appears after scrolling, ring tracks page progress. */
export function BackToTop() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Boolean snapshot: re-renders only when visibility flips, not on every scroll frame.
  const visible = useSyncExternalStore(
    subscribe,
    () => window.scrollY > THRESHOLD,
    () => false,
  );

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // The button is about to vanish; hand keyboard focus to the top of the page.
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  };

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          title="Back to top"
          initial={hidden}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={hidden}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: duration.base, ease: easeOutExpo }}
          // 44px hit area (touch target); the visible circle inside is smaller.
          className="group fixed right-4 bottom-4 z-30 mb-[env(safe-area-inset-bottom)] grid size-11 place-items-center text-muted-foreground transition-colors duration-200 hover:text-accent-foreground sm:right-7 sm:bottom-7"
        >
          <Magnetic strength={0.4} max={6}>
            <span className="relative grid size-9 place-items-center rounded-full border bg-background/80 shadow-sm backdrop-blur-md transition-colors duration-200 group-hover:border-accent group-hover:bg-accent">
              <svg
                aria-hidden
                viewBox="0 0 36 36"
                className="pointer-events-none absolute -inset-px size-[calc(100%+2px)] -rotate-90"
              >
                <motion.circle
                  cx="18"
                  cy="18"
                  r="17.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="opacity-50"
                  style={{ pathLength: scrollYProgress }}
                />
              </svg>
              <Bot aria-hidden className="size-4 group-hover:animate-bot-wiggle" />
            </span>
          </Magnetic>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
