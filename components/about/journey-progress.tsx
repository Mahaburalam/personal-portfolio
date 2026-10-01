"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const spring = { stiffness: 120, damping: 30, mass: 0.4 };

/**
 * Wraps the journey list and draws its spine as the reader scrolls through it (CLAUDE.md §9).
 * Motion values only — no re-renders. Static, fully drawn line under reduced motion.
 */
export function JourneyProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, spring);

  return (
    <div ref={ref} className="relative">
      <span aria-hidden className="absolute top-2 bottom-2 left-[0.3rem] w-px bg-border" />
      <motion.span
        aria-hidden
        className="absolute top-2 bottom-2 left-[0.3rem] w-px origin-top bg-accent"
        style={reduce ? undefined : { scaleY }}
      />
      {children}
    </div>
  );
}
