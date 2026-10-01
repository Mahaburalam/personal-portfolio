"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { easeOutExpo as ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * DOM version of the hero signature: IMAGE → PATCHES → VISUAL TOKENS → REASONING → OUTPUT.
 * Permanent fallback for the future WebGL version (components/three/). CLAUDE.md §8.
 */

const GRID = 6;

// A soft blob drawn as patch intensities — the "image".
const patches = Array.from({ length: GRID * GRID }, (_, i) => {
  const x = i % GRID;
  const y = Math.floor(i / GRID);
  const d = Math.hypot(x - 2.2, y - 2.4);
  return Math.max(0.08, 1 - d / 3.4);
});

// Regions the "model" attends to, one per cycle.
const regions = [
  { patches: [7, 8, 13, 14], query: "Where is the object?", answer: "Upper-left, 4 patches." },
  { patches: [14, 15, 20, 21], query: "What is at the center?", answer: "The densest region." },
  { patches: [26, 27, 32, 33], query: "Is the lower area empty?", answer: "Mostly — low signal." },
];

const stageLabel = "label-mono text-muted-foreground mb-3 flex items-center gap-2";

export function HeroPipeline({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % regions.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  const region = regions[step];

  return (
    <figure
      className={cn("relative rounded-lg border bg-card p-5 sm:p-7", className)}
      aria-label="Diagram: an image is split into patches, encoded as visual tokens, reasoned over, and turned into an answer."
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-8" aria-hidden>
        {/* 01 IMAGE → PATCHES */}
        <div>
          <p className={stageLabel}>
            <span className="text-foreground/40">01</span> Image → Patches
          </p>
          <div className="grid aspect-square grid-cols-6 gap-[3px]">
            {patches.map((v, i) => {
              const focused = region.patches.includes(i);
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "rounded-[2px] transition-colors duration-500",
                    focused ? "bg-signal" : "bg-foreground",
                  )}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: focused ? 0.9 : v * 0.55, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    ease,
                    delay: reduce ? 0 : (i % GRID) * 0.03 + Math.floor(i / GRID) * 0.03,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* 02 VISUAL TOKENS */}
        <div className="flex flex-col">
          <p className={stageLabel}>
            <span className="text-foreground/40">02</span> Visual tokens
          </p>
          <div className="grid flex-1 grid-cols-4 content-start gap-1.5 sm:gap-2">
            {region.patches.map((p, i) => (
              <motion.span
                key={`${step}-${p}`}
                className="label-mono flex h-8 items-center justify-center rounded-sm border border-signal/60 text-foreground sm:h-9"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.15 + i * 0.06 }}
              >
                v{p}
              </motion.span>
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                className="h-8 rounded-sm border border-dashed border-border/80 sm:h-9"
              />
            ))}
          </div>
          <p className="label-mono mt-3 tracking-normal text-muted-foreground/70 normal-case">
            {region.patches.length} of {GRID * GRID} patches encoded
          </p>
        </div>

        {/* 03 REASONING — hidden on mobile for a simpler visual (CLAUDE.md §8) */}
        <div className="hidden sm:block">
          <p className={stageLabel}>
            <span className="text-foreground/40">03</span> Reasoning
          </p>
          <p className="mb-3 text-sm text-muted-foreground">{region.query}</p>
          <div className="space-y-1.5">
            {region.patches.map((p, i) => {
              const w = [0.92, 0.64, 0.41, 0.23][i];
              return (
                <div key={p} className="flex items-center gap-2">
                  <span className="label-mono w-8 text-muted-foreground">v{p}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full origin-left rounded-full bg-accent"
                      initial={false}
                      animate={{ scaleX: w }}
                      transition={{
                        duration: reduce ? 0 : 0.7,
                        ease,
                        delay: reduce ? 0 : 0.3 + i * 0.05,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 04 OUTPUT */}
        <div className="col-span-2 sm:col-span-1">
          <p className={stageLabel}>
            <span className="text-foreground/40">04</span> Output
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              className="font-display text-lg leading-snug font-semibold tracking-tight sm:text-xl"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease, delay: reduce ? 0 : 0.6 }}
            >
              {region.answer}
            </motion.p>
          </AnimatePresence>
          <p className="label-mono mt-4 flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-signal" />
            Adaptive acquisition
          </p>
        </div>
      </div>

      <figcaption className="label-mono mt-7 border-t pt-4 text-muted-foreground">
        Image → Visual tokens → Reasoning → Output
      </figcaption>
    </figure>
  );
}
