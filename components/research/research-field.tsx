import { cn } from "@/lib/utils";

/**
 * Research Lab visual (CLAUDE.md §8, §19): a flat dot-matrix "image" whose patches change with the
 * active research line — never a sphere/orb. Pure SVG; opacity transitions only. Decorative: the
 * caller renders the active line's caption as the text equivalent.
 *
 * mode 0 ResRoute   — resolution is routed per patch (fine where the subject is, coarse elsewhere)
 * mode 1 MultiCrop  — a coarse global view plus high-resolution crops of the needed regions
 * mode 2 Amortized  — encoded patches persist and are reused by several questions
 */

const F = 240; // field size (viewBox units)
const STEP = 8;
const N = F / STEP; // dots per side
const PATCH = 40; // 6 × 6 patches
const P = F / PATCH;

const subjects = [
  { x: 84, y: 92, r: 62 },
  { x: 166, y: 166, r: 50 },
];

const intensity = (x: number, y: number) =>
  Math.max(0.05, ...subjects.map((s) => 1 - Math.hypot(x - s.x, y - s.y) / s.r));

const dots = Array.from({ length: N * N }, (_, i) => {
  const ix = i % N;
  const iy = Math.floor(i / N);
  const x = ix * STEP + STEP / 2;
  const y = iy * STEP + STEP / 2;
  return {
    x,
    y,
    v: intensity(x, y),
    coarse: ix % 2 === 0 && iy % 2 === 0,
    patch: Math.floor(x / PATCH) + Math.floor(y / PATCH) * P,
  };
});

// A patch is "important" when the subject covers it.
const important = new Set(
  Array.from({ length: P * P }, (_, p) => p).filter((p) => {
    const cx = (p % P) * PATCH + PATCH / 2;
    const cy = Math.floor(p / P) * PATCH + PATCH / 2;
    return intensity(cx, cy) > 0.3;
  }),
);

const crops = subjects.map((s) => {
  const half = s.r * 0.72;
  return { x: s.x - half, y: s.y - half, size: half * 2 };
});

// Thumbnails sit at the right edge, overlapping the field.
const thumbs = [
  { x: 236, y: 22, size: 60 },
  { x: 236, y: 118, size: 60 },
];

function dotOpacity(mode: number, d: (typeof dots)[number]) {
  const inCrop = crops.some(
    (c) => d.x >= c.x && d.x <= c.x + c.size && d.y >= c.y && d.y <= c.y + c.size,
  );
  switch (mode) {
    case 0:
      return important.has(d.patch) ? 0.3 + d.v * 0.7 : d.coarse ? 0.35 : 0.05;
    case 1:
      return inCrop ? 0.35 + d.v * 0.65 : d.coarse ? 0.25 : 0.04;
    default:
      return important.has(d.patch) ? 0.45 + d.v * 0.55 : 0.12 + d.v * 0.2;
  }
}

function Crop({
  crop,
  thumb,
  i,
  active,
}: {
  crop: (typeof crops)[number];
  thumb: (typeof thumbs)[number];
  i: number;
  active: boolean;
}) {
  const step = crop.size / 14;
  const fine = Array.from({ length: 14 * 14 }, (_, k) => {
    const x = crop.x + (k % 14) * step + step / 2;
    const y = crop.y + Math.floor(k / 14) * step + step / 2;
    return { x, y, v: intensity(x, y) };
  });

  return (
    <g className={cn("transition-opacity duration-500", active ? "opacity-100" : "opacity-45")}>
      <path
        d={`M${crop.x + crop.size} ${crop.y + (i === 0 ? 0 : crop.size / 2)}L${thumb.x} ${thumb.y + thumb.size / 2}`}
        className="stroke-signal/60"
        strokeWidth={0.6}
        strokeDasharray="2 2"
      />
      <rect
        x={thumb.x}
        y={thumb.y}
        width={thumb.size}
        height={thumb.size}
        rx={3}
        className="fill-card stroke-border"
        strokeWidth={0.8}
      />
      <svg
        x={thumb.x + 3}
        y={thumb.y + 3}
        width={thumb.size - 6}
        height={thumb.size - 6}
        viewBox={`${crop.x} ${crop.y} ${crop.size} ${crop.size}`}
      >
        {fine.map((d, k) => (
          <circle
            key={k}
            cx={d.x}
            cy={d.y}
            r={0.5 + d.v * step * 0.42}
            fill="url(#rf-spectrum)"
            opacity={0.25 + d.v * 0.75}
          />
        ))}
      </svg>
      <rect
        x={thumb.x}
        y={thumb.y}
        width={thumb.size}
        height={thumb.size}
        rx={3}
        fill="none"
        className={active ? "stroke-signal" : "stroke-border"}
        strokeWidth={0.8}
      />
    </g>
  );
}

export function ResearchField({ mode, className }: { mode: number; className?: string }) {
  return (
    <svg viewBox="0 0 300 240" aria-hidden className={cn("w-full overflow-visible", className)}>
      <defs>
        <linearGradient id="rf-spectrum" x1="0" y1="0" x2={F} y2={F} gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--spectrum-start)" }} />
          <stop offset="1" style={{ stopColor: "var(--spectrum-end)" }} />
        </linearGradient>
      </defs>

      {/* patch grid */}
      <g className="stroke-border" strokeWidth={0.5}>
        {Array.from({ length: P + 1 }, (_, k) => (
          <g key={k}>
            <line x1={k * PATCH} y1={0} x2={k * PATCH} y2={F} />
            <line x1={0} y1={k * PATCH} x2={F} y2={k * PATCH} />
          </g>
        ))}
      </g>

      {/* mode 2: cached patches stay tinted */}
      <g
        className={cn("transition-opacity duration-500", mode === 2 ? "opacity-100" : "opacity-0")}
      >
        {[...important].map((p) => (
          <rect
            key={p}
            x={(p % P) * PATCH + 1}
            y={Math.floor(p / P) * PATCH + 1}
            width={PATCH - 2}
            height={PATCH - 2}
            rx={2}
            className="fill-spectrum-end/10"
          />
        ))}
      </g>

      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={0.6 + d.v * 2.4}
          fill="url(#rf-spectrum)"
          opacity={dotOpacity(mode, d)}
          className="transition-opacity duration-500 ease-out-expo"
        />
      ))}

      {/* mode 0: routed (high-resolution) patches */}
      <g
        fill="none"
        className={cn(
          "stroke-signal transition-opacity duration-500",
          mode === 0 ? "opacity-100" : "opacity-0",
        )}
        strokeWidth={0.8}
        strokeDasharray="3 2"
      >
        {[...important].map((p) => (
          <rect
            key={p}
            x={(p % P) * PATCH + 1}
            y={Math.floor(p / P) * PATCH + 1}
            width={PATCH - 2}
            height={PATCH - 2}
            rx={2}
          />
        ))}
      </g>

      {/* mode 1: acquired crops */}
      <g
        fill="none"
        className={cn(
          "stroke-signal transition-opacity duration-500",
          mode === 1 ? "opacity-100" : "opacity-0",
        )}
        strokeWidth={1}
      >
        {crops.map((c) => (
          <rect key={c.x} x={c.x} y={c.y} width={c.size} height={c.size} rx={2} />
        ))}
      </g>

      {crops.map((c, i) => (
        <Crop key={i} crop={c} thumb={thumbs[i]} i={i} active={mode === 1} />
      ))}

      {/* mode 2: several questions reuse the same cache */}
      <g
        className={cn("transition-opacity duration-500", mode === 2 ? "opacity-100" : "opacity-0")}
      >
        {["Q1", "Q2", "Q3"].map((q, k) => (
          <g key={q} transform={`translate(250 ${186 + k * 18})`}>
            <path
              d="M0 6.5H-14"
              className="stroke-signal/60"
              strokeWidth={0.6}
              strokeDasharray="2 2"
            />
            <rect
              width={30}
              height={13}
              rx={3}
              className="fill-card stroke-border"
              strokeWidth={0.8}
            />
            <text
              x={15}
              y={9.2}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[7px]"
            >
              {q}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
