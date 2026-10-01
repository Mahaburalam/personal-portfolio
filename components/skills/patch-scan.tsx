import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const COLS = 16;
const ROWS = 6;

// A soft "object" in the frame: patch saliency falls off from its center.
const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const s = Math.exp(-(((col - 10.5) / 3.6) ** 2) - ((row - 2.6) / 1.8) ** 2);
  return { col, opacity: Math.round((0.08 + 0.42 * s) * 1000) / 1000, kept: s > 0.62 };
});

/**
 * Decorative CV motif for the Computer Vision card (lg only): an image split into patches,
 * a scan sweeping across, the salient patches kept as visual tokens — the site's
 * IMAGE → PATCHES → TOKENS signature. Animation is gated by the skills graph's
 * `data-skills` state (globals.css); static without it.
 */
export function PatchScan() {
  return (
    <div aria-hidden className="hidden lg:block">
      <div className="grid grid-cols-16 gap-[3px]">
        {cells.map((cell, i) => (
          <span
            key={i}
            style={{ opacity: cell.kept ? 1 : cell.opacity, "--c": cell.col } as CSSProperties}
            className={cn(
              "aspect-square rounded-[2px]",
              cell.kept ? "bg-signal/55" : "skills-patch bg-foreground",
            )}
          />
        ))}
      </div>
      <p className="label-mono mt-4 flex items-center gap-2 text-foreground/40">
        Image <span className="h-px w-4 bg-border" /> Patches{" "}
        <span className="h-px w-4 bg-border" /> <span className="text-signal">Tokens</span>
      </p>
    </div>
  );
}
