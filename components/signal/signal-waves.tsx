"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { mulberry32 } from "@/lib/random";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Homepage signal band — the hero signature told as a signal (CLAUDE.md §8, §10):
 * a patch-grid image is scanned into visual tokens, the tokens converge, fan out into
 * interweaving strands (reasoning) and land on the words of the statement.
 * Decorative — the caller provides the text equivalent.
 */

type Wave = { amp: number; freq: number; phase: number; speed: number };
type Strand = { word: number; waves: Wave[]; opacity: number };
type Size = { w: number; h: number };
type Point = { x: number; y: number };

const SAMPLES = 64;
const TAU = Math.PI * 2;
const FLIGHT = 1.6; // seconds a token takes from its patch to the convergence point
const WORD_BEAT = 1.1; // seconds each output word stays highlighted

const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// The "image": two soft objects drawn as patch intensities (same idea as the research schematic).
function patchImage(n: number) {
  const blob = (u: number, v: number, cx: number, cy: number, r: number) =>
    Math.max(0, 1 - Math.hypot(u - cx, v - cy) / r);
  return Array.from({ length: n * n }, (_, i) => {
    const u = ((i % n) + 0.5) / n;
    const v = (Math.floor(i / n) + 0.5) / n;
    return Math.max(0.08, blob(u, v, 0.3, 0.32, 0.38), blob(u, v, 0.72, 0.7, 0.34));
  });
}

function makeStrands(count: number, words: number): Strand[] {
  const rand = mulberry32(17);
  const wave = (amp: [number, number], freq: [number, number]): Wave => ({
    amp: amp[0] + rand() * (amp[1] - amp[0]),
    freq: freq[0] + rand() * (freq[1] - freq[0]),
    phase: rand() * TAU,
    speed: (0.18 + rand() * 0.22) * (rand() < 0.5 ? -1 : 1),
  });

  // Neighbouring strands go to different words, so they cross on the way.
  return Array.from({ length: count }, (_, i) => ({
    word: i % words,
    waves: [wave([0.12, 0.22], [0.7, 1.6]), wave([0.03, 0.06], [2, 3.2])],
    opacity: 0.35 + rand() * 0.45,
  }));
}

function geometry({ w, h }: Size, wordCount: number) {
  const narrow = w < 480;
  const n = narrow ? 6 : 8;
  const art = h - (narrow ? 0 : 28); // room for the stage labels
  const cy = art / 2;
  const size = Math.min(art * 0.62, w * 0.2);
  const cell = size / n;
  const gap = Math.max(2, cell * 0.12);
  const grid = { x: 1, y: cy - size / 2, size, cell, gap, n };
  const laneStart = size + 16;
  const x0 = w * (narrow ? 0.4 : 0.36);
  const slots = clamp(Math.round((x0 - laneStart) / 22), 4, 12);
  const labelW = narrow ? 84 : 104;
  const words: Point[] = Array.from({ length: wordCount }, (_, k) => ({
    x: w - labelW - (k % 2) * 10,
    y: cy + ((k + 0.5) / wordCount - 0.5) * 0.72 * art,
  }));
  return { narrow, art, cy, grid, laneStart, x0, slots, words };
}

type Geometry = ReturnType<typeof geometry>;

function strandPath(s: Strand, g: Geometry, time: number) {
  const end = g.words[s.word];
  let d = "";
  for (let k = 0; k <= SAMPLES; k++) {
    const t = k / SAMPLES;
    // 0 at the convergence point, swells mid-way, settles so the strand lands on its word.
    const env = Math.pow(Math.sin(Math.PI * t), 1.4);
    let wave = 0;
    for (const v of s.waves) wave += v.amp * Math.sin(TAU * v.freq * t + v.phase + time * v.speed);
    const y = g.cy + g.art * env * wave + t * t * (end.y - g.cy);
    d += `${k ? "L" : "M"}${(g.x0 + t * (end.x - g.x0)).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function patchOrigin(g: Geometry, index: number): Point {
  const { x, y, cell, n } = g.grid;
  return { x: x + (index % n) * cell, y: y + Math.floor(index / n) * cell };
}

/**
 * Token `m` leaves patch `m mod N²` at `m · dt` and occupies slot `m mod slots`, so `slots`
 * tokens are always in flight. Returns where the token in `slot` is at `time`.
 */
function tokenAt(g: Geometry, image: number[], slot: number, time: number) {
  const dt = FLIGHT / g.slots;
  const now = Math.floor(time / dt);
  const m = now - mod(now - slot, g.slots);
  const p = (time - m * dt) / FLIGHT; // 0 → 1 along the flight
  const patch = mod(m, image.length);
  const from = patchOrigin(g, patch);
  const half = g.grid.cell / 2;
  const start = { x: from.x + half, y: from.y + half };
  const rise = 1 - Math.pow(1 - Math.min(1, p * 2.2), 3); // joins the centre line early
  const fade = Math.min(1, p / 0.08, (1 - p) / 0.15);
  return {
    x: start.x + p * (g.x0 - start.x),
    y: start.y + rise * (g.cy - start.y),
    intensity: image[patch],
    opacity: clamp(fade, 0, 1),
  };
}

export function SignalWaves({
  words,
  stages,
  className,
}: {
  words: string[];
  stages: string[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<Size>({ w: 1200, h: 320 });

  const g = useMemo(() => geometry(size, words.length), [size, words.length]);
  const image = useMemo(() => patchImage(g.grid.n), [g.grid.n]);
  const strands = useMemo(
    () => makeStrands(g.narrow ? 10 : 16, words.length),
    [g.narrow, words.length],
  );

  // Match the viewBox to the rendered box so squares and dots stay true at every breakpoint.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w && h) setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  // Draw in once on first view, then scan / flow / drift while visible. rAF also stops in hidden tabs.
  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;
    // The first (hydration) pass reports motion as allowed; undo any arming once the real value lands.
    if (reduce) {
      delete root.dataset.signal;
      return;
    }

    if (root.dataset.signal !== "play") root.dataset.signal = "armed";
    const paths = svg.querySelectorAll<SVGPathElement>("[data-strand]");
    const tokens = svg.querySelectorAll<SVGRectElement>("[data-token]");
    const wordEls = svg.querySelectorAll<SVGTextElement>("[data-word]");
    const cursor = svg.querySelector<SVGRectElement>("[data-cursor]");
    const dt = FLIGHT / g.slots;
    const frameMs = g.narrow ? 1000 / 30 : 0;
    let raf = 0;
    let last = 0;
    let time = 0;
    let activeWord = -1;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!last) last = now;
      const step = now - last;
      if (frameMs && step < frameMs) return;
      last = now;
      time += Math.min(step, 50) / 1000;

      paths.forEach((p) => {
        p.setAttribute("d", strandPath(strands[Number(p.dataset.strand)], g, time));
      });

      tokens.forEach((el) => {
        const t = tokenAt(g, image, Number(el.dataset.token), time);
        const s = Number(el.getAttribute("width"));
        el.setAttribute("x", (t.x - s / 2).toFixed(1));
        el.setAttribute("y", (t.y - s / 2).toFixed(1));
        el.setAttribute("fill-opacity", (0.3 + 0.7 * t.intensity).toFixed(2));
        el.setAttribute("opacity", t.opacity.toFixed(2));
      });

      if (cursor) {
        const at = patchOrigin(g, mod(Math.floor(time / dt), image.length));
        cursor.setAttribute("x", at.x.toFixed(1));
        cursor.setAttribute("y", at.y.toFixed(1));
      }

      const word = Math.floor(time / WORD_BEAT) % wordEls.length;
      if (word !== activeWord) {
        wordEls[activeWord]?.removeAttribute("data-active");
        wordEls[word]?.setAttribute("data-active", "");
        activeWord = word;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (!entry.isIntersecting) return;
      root.dataset.signal = "play";
      raf = requestAnimationFrame(tick);
    });
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      wordEls[activeWord]?.removeAttribute("data-active");
    };
  }, [reduce, g, image, strands]);

  const { w, h } = size;
  const { grid } = g;
  const gradient = `${id}-stroke`;
  const tokenSize = Math.min(10, grid.cell * 0.7);
  const outputX = Math.min(...g.words.map((p) => p.x));
  const stageX = [
    { x: grid.x, anchor: "start" },
    { x: g.laneStart, anchor: "start" },
    { x: (g.x0 + outputX) / 2, anchor: "middle" },
    { x: outputX - 3, anchor: "start" },
  ] as const;

  return (
    <div ref={rootRef} className={cn("relative", className)} aria-hidden>
      {/* Soft warm wash behind the output words */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--spectrum-end)_12%,transparent),transparent)]" />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="relative block h-52 w-full sm:h-72 lg:h-80"
        fill="none"
      >
        <defs>
          <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={w} y2={0}>
            <stop offset="0.3" style={{ stopColor: "var(--signal)" }} />
            <stop
              offset="0.62"
              style={{ stopColor: "color-mix(in oklab, var(--signal), var(--spectrum-end))" }}
            />
            <stop offset="0.92" style={{ stopColor: "var(--spectrum-end)" }} />
          </linearGradient>
        </defs>

        {/* 01 Image → patches */}
        {image.map((v, i) => {
          const at = patchOrigin(g, i);
          return (
            <rect
              key={i}
              x={at.x + grid.gap / 2}
              y={at.y + grid.gap / 2}
              width={grid.cell - grid.gap}
              height={grid.cell - grid.gap}
              rx={1}
              className="signal-patch fill-foreground"
              fillOpacity={v * 0.6}
              style={{ "--i": i } as CSSProperties}
            />
          );
        })}
        <rect
          data-cursor
          x={grid.x}
          y={grid.y}
          width={grid.cell}
          height={grid.cell}
          rx={2}
          className="signal-cursor stroke-signal"
          strokeWidth={1.5}
        />

        {/* 02 Visual tokens → convergence point */}
        <line
          x1={g.laneStart}
          y1={g.cy}
          x2={g.x0}
          y2={g.cy}
          className="stroke-signal"
          strokeOpacity={0.35}
          strokeDasharray="2 4"
        />
        {Array.from({ length: g.slots }, (_, s) => {
          const t = tokenAt(g, image, s, 0);
          return (
            <rect
              key={s}
              data-token={s}
              x={t.x - tokenSize / 2}
              y={t.y - tokenSize / 2}
              width={tokenSize}
              height={tokenSize}
              rx={1.5}
              className="fill-signal"
              fillOpacity={0.3 + 0.7 * t.intensity}
              opacity={t.opacity}
            />
          );
        })}

        {/* 03 Reasoning */}
        {strands.map((s, i) => (
          <path
            key={i}
            data-strand={i}
            d={strandPath(s, g, 0)}
            pathLength={1}
            className="signal-strand"
            stroke={`url(#${gradient})`}
            strokeWidth={1.1}
            strokeOpacity={s.opacity}
            strokeLinecap="round"
            style={{ "--i": i } as CSSProperties}
          />
        ))}

        {/* Travelling highlights on a few strands (only animated once data-signal="play") */}
        {strands.map((s, i) =>
          i % 3 === 1 ? (
            <path
              key={`pulse-${i}`}
              data-strand={i}
              d={strandPath(s, g, 0)}
              pathLength={1}
              className="signal-pulse stroke-foreground"
              strokeWidth={1.4}
              strokeOpacity={0.55}
              strokeLinecap="round"
              style={
                {
                  "--dur": `${3.2 + (i % 4) * 0.9}s`,
                  "--delay": `${(i * 0.37) % 2.4}s`,
                } as CSSProperties
              }
            />
          ) : null,
        )}

        {/* 04 Output */}
        {g.words.map((p, k) => (
          <g key={k} style={{ "--i": k } as CSSProperties}>
            <circle cx={p.x} cy={p.y} r={3} className="signal-dot fill-spectrum-end" />
            <text
              data-word={k}
              x={p.x + 10}
              y={p.y}
              dominantBaseline="middle"
              className="signal-word fill-muted-foreground font-mono text-[11px] sm:text-[13px]"
            >
              {words[k]}
            </text>
          </g>
        ))}

        {!g.narrow &&
          stages.map((label, i) => (
            <text
              key={label}
              x={stageX[i].x}
              y={h - 6}
              textAnchor={stageX[i].anchor}
              className="label-mono fill-muted-foreground"
            >
              <tspan className="fill-foreground/40">{String(i + 1).padStart(2, "0")} </tspan>
              {label.toUpperCase()}
            </text>
          ))}
      </svg>
    </div>
  );
}
