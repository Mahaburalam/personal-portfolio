import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { heroStages, heroVisual } from "@/content/hero";
import { mulberry32 } from "@/lib/random";
import { cn } from "@/lib/utils";
import { HeroSignatureMotion } from "./hero-signature-motion";

/**
 * Hero visual signature (CLAUDE.md §8): IMAGE → PATCHES → VISUAL TOKENS → REASONING → OUTPUT as a
 * CSS-3D stack of panels. Server-rendered SVG; looping CSS keyframes (globals.css, `.hero-*`) are
 * paused offscreen by the client leaf. Decorative — the figcaption is the text equivalent.
 * Permanent DOM fallback for the future WebGL version (components/three/).
 */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const vars = (v: Record<string, number>) => v as CSSProperties;

type Cell = { x: number; y: number; o: number; live: boolean };

// Token "activations" follow the scene: bright sky down the middle, mid facades, dim road.
function tokenGrid(cols: number, rows: number, seed: number): Cell[] {
  const rand = mulberry32(seed);
  return Array.from({ length: cols * rows }, (_, i) => {
    const x = i % cols;
    const y = Math.floor(i / cols);
    const u = (x + 0.5) / cols;
    const v = (y + 0.5) / rows;
    const sky = Math.max(0, 1 - Math.abs(u - 0.5) * 2.6) * (1 - v);
    const facade = Math.abs(u - 0.5) * (1 - Math.abs(v - 0.45));
    return {
      x,
      y,
      o: clamp(0.12 + sky * 0.8 + facade * 0.6 + rand() * 0.25, 0.1, 0.95),
      live: rand() < 0.2,
    };
  });
}

const tokensFine = tokenGrid(6, 8, 7);
const tokensCoarse = tokenGrid(3, 4, 11);

// Reasoning: streams leave the tokens spread out and converge toward the output.
const streams = Array.from({ length: 9 }, (_, i) => {
  const y0 = 14 + i * 11.5;
  const y1 = 60 + (i - 4) * 3;
  return { d: `M0 ${y0} C 40 ${y0}, 55 ${y1}, 100 ${y1}`, y0, y1 };
});

const particles = (() => {
  const rand = mulberry32(23);
  return Array.from({ length: 30 }, (_, i) => {
    const s = streams[Math.floor(rand() * streams.length)];
    const t = rand();
    // Point on the cubic (0,y0) (40,y0) (55,y1) (100,y1).
    const m = 1 - t;
    const x = 3 * m * m * t * 40 + 3 * m * t * t * 55 + t * t * t * 100;
    const y = m * m * m * s.y0 + 3 * m * m * t * s.y0 + 3 * m * t * t * s.y1 + t * t * t * s.y1;
    return { x, y, r: 0.6 + rand() * 0.9, i };
  });
})();

// Output: a structured cloud — three clusters (answers) joined by thin links.
const clusters = [
  { x: 38, y: 40 },
  { x: 68, y: 60 },
  { x: 40, y: 86 },
];

const cloud = (() => {
  const rand = mulberry32(41);
  const gauss = () => (rand() + rand() + rand() - 1.5) * 1.6;
  return Array.from({ length: 120 }, (_, i) => {
    const c = clusters[i % clusters.length];
    return {
      x: clamp(c.x + gauss() * 9, 2, 98),
      y: clamp(c.y + gauss() * 9, 2, 118),
      r: 0.5 + rand() * 1.1,
      signal: rand() < 0.14,
      live: rand() < 0.18,
      i,
    };
  });
})();

function Spectrum({ id, x2 = 1, y2 = 1 }: { id: string; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" style={{ stopColor: "var(--spectrum-start)" }} />
      <stop offset="1" style={{ stopColor: "var(--spectrum-end)" }} />
    </linearGradient>
  );
}

function Panel({ i, className, children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <div
      style={vars({ "--i": i })}
      className={cn(
        "hero-panel relative aspect-[3/4] shrink-0 overflow-hidden rounded-md border bg-card shadow-2xl shadow-foreground/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Procedural street scene: facades converging on a vanishing point, a distant tower, a road. */
function Scene() {
  const floorsLeft = [14, 24, 34, 44, 54, 64, 72];
  const floorsRight = [10, 20, 30, 40, 50, 60, 70];
  const colsLeft = [5, 10, 15, 20];
  const colsRight = [40, 45, 50, 55];

  return (
    <svg
      viewBox="0 0 60 80"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--spectrum-start)", stopOpacity: 0.4 }} />
          <stop offset="0.65" style={{ stopColor: "var(--card)", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="60" height="80" fill="url(#hs-sky)" />
      <path d="M28 48V18h4v30zM29.3 18l.7-9 .7 9z" className="fill-foreground/25" />
      <path d="M0 6 24 40v10L0 80z" className="fill-foreground/20" />
      <path d="M60 0 36 38v12l24 30z" className="fill-foreground/15" />
      <path d="M24 50h12l24 30H0z" className="fill-foreground/10" />
      <g className="stroke-foreground/25" strokeWidth={0.4} fill="none">
        {floorsLeft.map((y) => (
          <path key={`fl${y}`} d={`M0 ${y} 24 ${40 + ((y - 6) / 74) * 10}`} />
        ))}
        {floorsRight.map((y) => (
          <path key={`fr${y}`} d={`M60 ${y} 36 ${38 + (y / 80) * 12}`} />
        ))}
        {colsLeft.map((x) => (
          <path key={`cl${x}`} d={`M${x} ${6 + x * (34 / 24)}V${80 - x * (30 / 24)}`} />
        ))}
        {colsRight.map((x) => (
          <path key={`cr${x}`} d={`M${x} ${(60 - x) * (38 / 24)}V${80 - (60 - x) * (30 / 24)}`} />
        ))}
        <path d="M30 52v4m0 4v6m0 5v8" className="stroke-background/70" strokeWidth={0.8} />
      </g>
    </svg>
  );
}

function SceneLayer() {
  return heroVisual.image ? (
    <Image
      src={heroVisual.image}
      alt=""
      fill
      sizes="(min-width: 1024px) 180px, 30vw"
      className="object-cover"
    />
  ) : (
    <Scene />
  );
}

function TokenPanel({
  cells,
  cols,
  rows,
  id,
}: {
  cells: Cell[];
  cols: number;
  rows: number;
  id: string;
}) {
  const gap = cols > 4 ? 1.2 : 1.6;
  return (
    <svg viewBox={`0 0 ${cols * 10} ${rows * 10}`} className="absolute inset-0 size-full p-[6%]">
      <defs>
        <Spectrum id={id} />
      </defs>
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x * 10 + gap}
          y={c.y * 10 + gap}
          width={10 - gap * 2}
          height={10 - gap * 2}
          rx={1.6}
          fill={`url(#${id})`}
          opacity={c.o}
          className={c.live ? "hero-token" : undefined}
          style={c.live ? vars({ "--i": i }) : undefined}
        />
      ))}
    </svg>
  );
}

export function HeroSignature() {
  return (
    <figure className="max-sm:rounded-lg max-sm:border max-sm:bg-card max-sm:p-4">
      <HeroSignatureMotion>
        <div aria-hidden className="flex w-full items-center">
          {/* 01 Image */}
          <Panel i={0} className="w-[30%] sm:w-[25%]">
            <SceneLayer />
            <div className="hero-scan absolute inset-x-0 top-0 h-[18%] bg-linear-to-b from-transparent via-signal/30 to-transparent" />
          </Panel>

          {/* 02 Patches: the same image, cut into a 6 × 8 grid, a few patches selected */}
          <Panel i={1} className="-ml-[8%] w-[26%] sm:-ml-[7%] sm:w-[21%]">
            <SceneLayer />
            <svg
              viewBox="0 0 60 80"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
            >
              <g className="stroke-card" strokeWidth={1.4}>
                {[10, 20, 30, 40, 50].map((x) => (
                  <path key={`x${x}`} d={`M${x} 0v80`} />
                ))}
                {[10, 20, 30, 40, 50, 60, 70].map((y) => (
                  <path key={`y${y}`} d={`M0 ${y}h60`} />
                ))}
              </g>
              <g className="fill-signal/15 stroke-signal" strokeWidth={0.8}>
                <rect x={20.7} y={20.7} width={8.6} height={8.6} />
                <rect x={30.7} y={20.7} width={8.6} height={8.6} />
                <rect x={30.7} y={30.7} width={8.6} height={8.6} />
              </g>
            </svg>
          </Panel>

          {/* 03 Visual tokens: fine, then pooled */}
          <Panel i={2} className="-ml-[6%] w-[22%] sm:w-[18%]">
            <TokenPanel cells={tokensFine} cols={6} rows={8} id="hs-tok-a" />
          </Panel>
          <Panel i={3} className="-ml-[5%] hidden w-[15%] sm:block">
            <TokenPanel cells={tokensCoarse} cols={3} rows={4} id="hs-tok-b" />
          </Panel>

          {/* 04 Reasoning: token streams converge */}
          <svg viewBox="0 0 100 120" className="hidden w-[20%] shrink-0 overflow-visible sm:block">
            <defs>
              <Spectrum id="hs-stream" y2={0} />
            </defs>
            <g fill="none" stroke="url(#hs-stream)" strokeWidth={0.5} opacity={0.55}>
              {streams.map((s) => (
                <path key={s.d} d={s.d} />
              ))}
            </g>
            {particles.map((p) => (
              <circle
                key={p.i}
                cx={p.x}
                cy={p.y}
                r={p.r}
                className="hero-drift fill-spectrum-end"
                style={vars({ "--i": p.i })}
              />
            ))}
          </svg>

          {/* 05 Output: structured answer cloud */}
          <svg
            viewBox="0 0 100 120"
            className="-ml-[2%] w-[38%] shrink-0 overflow-visible sm:-ml-[4%] sm:w-[23%]"
          >
            <defs>
              <Spectrum id="hs-cloud" />
            </defs>
            <g className="stroke-foreground/15" strokeWidth={0.4}>
              <path
                d={`M${clusters[0].x} ${clusters[0].y}L${clusters[1].x} ${clusters[1].y}L${clusters[2].x} ${clusters[2].y}`}
                fill="none"
              />
            </g>
            {cloud.map((p) => (
              <circle
                key={p.i}
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill={p.signal ? undefined : "url(#hs-cloud)"}
                className={cn(p.signal && "fill-signal", p.live && "hero-token")}
                style={p.live ? vars({ "--i": p.i }) : undefined}
              />
            ))}
            {clusters.map((c) => (
              <circle
                key={`${c.x}-${c.y}`}
                cx={c.x}
                cy={c.y}
                r={2.2}
                className="fill-background stroke-signal"
                strokeWidth={0.8}
              />
            ))}
          </svg>
        </div>
      </HeroSignatureMotion>

      <figcaption className="mt-6 sm:mt-8">
        <span className="sr-only">
          Diagram: an image is split into patches, encoded as visual tokens, reasoned over, and
          turned into an intelligent output.
        </span>
        <span
          aria-hidden
          className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground sm:text-xs"
        >
          {heroStages.map((stage, i) => (
            <span key={stage} className="contents">
              {i > 0 && <span className="text-foreground/30">→</span>}
              <span className="whitespace-nowrap">{stage}</span>
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
