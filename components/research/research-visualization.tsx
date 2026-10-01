"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { research } from "@/content/research";
import { vizTabs, type Acquisition } from "@/content/research-visualization";
import { duration, easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Schematic: fixed vs adaptive visual acquisition on one 8×8 "image".
 * All counts are derived from this grid — illustrative, not experimental results.
 */

const GRID = 8;
const BLOCK = 2; // coarse token = 2×2 patches
const FULL = GRID * GRID;
const COARSE = FULL / (BLOCK * BLOCK);

// Two soft objects drawn as patch intensities.
const blob = (x: number, y: number, cx: number, cy: number, r: number) =>
  Math.max(0, 1 - Math.hypot(x - cx, y - cy) / r);
const image = Array.from({ length: FULL }, (_, i) => {
  const x = i % GRID;
  const y = Math.floor(i / GRID);
  return Math.max(0.08, blob(x, y, 1.6, 1.8, 2.6), blob(x, y, 5.4, 5, 2.4));
});

// Coarse view: every patch shows its 2×2 block's average.
const coarse = image.map((_, i) => {
  const bx = Math.floor((i % GRID) / BLOCK) * BLOCK;
  const by = Math.floor(Math.floor(i / GRID) / BLOCK) * BLOCK;
  let sum = 0;
  for (let dy = 0; dy < BLOCK; dy++)
    for (let dx = 0; dx < BLOCK; dx++) sum += image[(by + dy) * GRID + bx + dx];
  return sum / (BLOCK * BLOCK);
});

// Regions selected for full-resolution crops (one per object).
const cropRegions = [
  [9, 10, 17, 18],
  [37, 38, 45, 46],
].flat();

const newTokens: Record<Acquisition, number> = {
  coarse: COARSE,
  fine: FULL,
  regions: COARSE + cropRegions.length,
  encode: FULL,
  reuse: 0,
};

type PatchLook = { tone: "fine" | "coarse" | "cached"; opacity: number };

function adaptivePatch(i: number, acquisition: Acquisition): PatchLook {
  switch (acquisition) {
    case "coarse":
      return { tone: "coarse", opacity: 0.06 + coarse[i] * 0.5 };
    case "regions":
      return cropRegions.includes(i)
        ? { tone: "fine", opacity: 0.35 + image[i] * 0.6 }
        : { tone: "coarse", opacity: 0.06 + coarse[i] * 0.5 };
    case "reuse":
      return { tone: "cached", opacity: 0.25 + image[i] * 0.65 };
    default:
      return { tone: "fine", opacity: 0.25 + image[i] * 0.7 };
  }
}

const toneClass = {
  fine: "bg-signal",
  coarse: "bg-foreground",
  cached: "bg-accent",
} as const;

function PatchGrid({ look }: { look: (i: number) => PatchLook }) {
  return (
    <div className="grid aspect-square grid-cols-8 gap-[3px]" aria-hidden>
      {image.map((_, i) => {
        const { tone, opacity } = look(i);
        return (
          <div
            key={i}
            className={cn(
              "rounded-[2px] transition-[opacity,background-color] duration-500 ease-out-expo",
              toneClass[tone],
            )}
            style={{
              // Rounded so server and client serialize the same string (float noise breaks hydration).
              opacity: Math.round(opacity * 1000) / 1000,
              transitionDelay: `${((i % GRID) + Math.floor(i / GRID)) * 12}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

function TokenBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: string;
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3">
      <span className="label-mono text-muted-foreground">{label}</span>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full origin-left rounded-full transition-transform duration-500 ease-out-expo",
            tone,
          )}
          style={{ transform: `scaleX(${value / max})` }}
        />
      </div>
      <span className="label-mono text-right tabular-nums">{value}</span>
    </div>
  );
}

const cycleMs = 3200;

export function ResearchVisualization() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [tabIndex, setTabIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);

  const tab = vizTabs[tabIndex];
  const scenario = tab.scenarios[step];
  const item = research.find((r) => r.slug === tab.researchSlug);
  const itemIndex = research.findIndex((r) => r.slug === tab.researchSlug);

  // Auto-advance through a tab's scenarios while visible, until the visitor picks one.
  useEffect(() => {
    if (reduce || pinned || !inView || tab.scenarios.length < 2) return;
    const id = setInterval(() => setStep((s) => (s + 1) % tab.scenarios.length), cycleMs);
    return () => clearInterval(id);
  }, [reduce, pinned, inView, tab]);

  const selectTab = (i: number) => {
    setTabIndex(i);
    setStep(0);
    setPinned(false);
  };

  // Roving focus for the tablist (WAI-ARIA tabs pattern).
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = vizTabs.length - 1;
    const next =
      e.key === "ArrowRight"
        ? tabIndex === last
          ? 0
          : tabIndex + 1
        : e.key === "ArrowLeft"
          ? tabIndex === 0
            ? last
            : tabIndex - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  const fixed = tab.cumulative ? FULL * (step + 1) : FULL;
  const adaptive = tab.cumulative
    ? tab.scenarios.slice(0, step + 1).reduce((sum, s) => sum + newTokens[s.acquisition], 0)
    : newTokens[scenario.acquisition];
  const max = tab.cumulative ? FULL * tab.scenarios.length : FULL;

  return (
    <figure
      ref={ref}
      className="overflow-hidden rounded-lg border bg-card"
      aria-label="Schematic comparing fixed visual acquisition, which encodes every image patch, with adaptive acquisition, which spends visual tokens only where the question needs them."
    >
      <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Research ideas"
          className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0"
        >
          {vizTabs.map((t, i) => {
            const selected = i === tabIndex;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`viz-tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="viz-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(i)}
                onKeyDown={onTabKeyDown}
                className={cn(
                  "label-mono relative min-h-11 shrink-0 rounded-md px-3 transition-colors duration-200",
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="viz-tab-indicator"
                    className="absolute inset-0 rounded-md bg-muted"
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                    }
                  />
                )}
                <span className="relative">
                  <span className="text-foreground/40">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="label-mono text-muted-foreground/80">Schematic — not experimental results</p>
      </div>

      <div
        id="viz-panel"
        role="tabpanel"
        aria-labelledby={`viz-tab-${tab.id}`}
        className="grid gap-10 p-5 sm:p-8 lg:grid-cols-12 lg:gap-12"
      >
        {/* Explanation + scenario picker */}
        <div className="flex flex-col lg:col-span-5">
          <p className="font-display text-xl leading-snug font-medium tracking-tight sm:text-2xl">
            {tab.idea}
          </p>

          {item && (
            <Link
              href={`/research#${item.slug}`}
              className="label-mono group mt-5 inline-flex min-h-11 items-center gap-2 self-start text-muted-foreground transition-colors hover:text-accent"
            >
              R/{String(itemIndex + 1).padStart(2, "0")} · {item.title}
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
              />
            </Link>
          )}

          <div className="mt-6 border-t pt-6 lg:mt-auto">
            <p className="label-mono mb-3 text-muted-foreground">
              {tab.cumulative ? "Questions on one image" : "Question"}
            </p>
            {tab.scenarios.length > 1 ? (
              <ul className="space-y-1">
                {tab.scenarios.map((s, i) => (
                  <li key={s.query}>
                    <button
                      type="button"
                      aria-pressed={i === step}
                      onClick={() => {
                        setStep(i);
                        setPinned(true);
                      }}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors duration-200",
                        i === step
                          ? "border-foreground/30 text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          i === step ? "bg-signal" : "bg-border",
                        )}
                      />
                      {s.query}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">{scenario.query}</p>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${tab.id}-${step}`}
                className="mt-4 min-h-12 text-sm leading-relaxed text-muted-foreground"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: duration.fast, ease: easeOutExpo }}
              >
                {scenario.note}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Fixed vs adaptive */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            <div>
              <p className="label-mono mb-3 text-muted-foreground">
                Fixed · {tab.cumulative ? `re-encode ×${step + 1}` : "every patch"}
              </p>
              <PatchGrid look={(i) => ({ tone: "coarse", opacity: 0.08 + image[i] * 0.5 })} />
            </div>
            <div>
              <p className="label-mono mb-3 flex items-center gap-2 text-foreground">
                <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                Adaptive
              </p>
              <PatchGrid look={(i) => adaptivePatch(i, scenario.acquisition)} />
            </div>
          </div>

          <div className="mt-8 space-y-3 border-t pt-6">
            <p className="label-mono tracking-normal text-muted-foreground/80 normal-case">
              Visual tokens{tab.cumulative ? ", cumulative" : ""} · counted from this {GRID}×{GRID}{" "}
              diagram
            </p>
            <TokenBar label="Fixed" value={fixed} max={max} tone="bg-foreground/60" />
            <TokenBar label="Adaptive" value={adaptive} max={max} tone="bg-signal" />
          </div>
        </div>
      </div>

      <figcaption className="flex flex-wrap gap-x-6 gap-y-2 border-t px-5 py-4 text-muted-foreground sm:px-8">
        {[
          { tone: "bg-signal", label: "Full-resolution token" },
          { tone: "bg-foreground/50", label: "Low-resolution token" },
          { tone: "bg-accent", label: "Reused token" },
        ].map((l) => (
          <span key={l.label} className="label-mono flex items-center gap-2">
            <span aria-hidden className={cn("size-2.5 rounded-[2px]", l.tone)} />
            {l.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
