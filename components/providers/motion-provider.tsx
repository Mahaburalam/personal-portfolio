"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Honors `prefers-reduced-motion` for every Motion animation, including elements that were
 * server-rendered in their initial state: transforms are skipped, only opacity fades.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
