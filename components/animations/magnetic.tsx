"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Share of the cursor's offset from center that the element follows. */
  strength?: number;
  /** Max travel in px on each axis. */
  max?: number;
};

const spring = { stiffness: 220, damping: 18, mass: 0.4 };
const clamp = (v: number, limit: number) => Math.max(-limit, Math.min(limit, v));

/**
 * Subtle magnetic pull toward the cursor (CLAUDE.md §10). The outer span is a stable hit area that
 * never moves, so the element can't jitter at its own edges; only the inner span springs.
 * Mouse only (touch/pen ignored), static under reduced motion, motion values only — no re-renders.
 */
export function Magnetic({ children, className, strength = 0.3, max = 8 }: MagneticProps) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const rotate = useSpring(0, spring);
  const scale = useSpring(1, spring);

  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (left + width / 2);
    const dy = e.clientY - (top + height / 2);
    x.set(clamp(dx * strength, max));
    y.set(clamp(dy * strength, max));
    rotate.set(clamp((dx / width) * 6, 3));
    scale.set(1.04);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
    rotate.set(0);
    scale.set(1);
  };

  return (
    <span
      className={cn("inline-flex", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.span className="inline-flex" style={{ x, y, rotate, scale }}>
        {children}
      </motion.span>
    </span>
  );
}
