import { mulberry32, seedFrom } from "@/lib/random";
import { cn } from "@/lib/utils";

/**
 * Generated cover for a project tile until a real screenshot exists (CLAUDE.md §8). Deterministic per
 * slug, drawn in theme tokens; abstract on purpose — it never shows invented UI text or results.
 */

export type CoverMotif = "vision" | "product" | "ai";

const W = 160;
const H = 100;

/** Pick a motif from the project's category. */
export function coverMotif(category: string): CoverMotif {
  if (/vision/i.test(category)) return "vision";
  if (/\bAI\b/.test(category)) return "ai";
  return "product";
}

// Patch grid over hand-drawn-ish shapes, with detection boxes on the shapes.
function Vision({ rand, id }: { rand: () => number; id: string }) {
  const n = 10;
  const cell = H / n;
  const cols = Math.ceil(W / cell);
  const shapes = [
    { x: 42, y: 50, r: 20 },
    { x: 104, y: 44, r: 16 },
  ];
  const near = (x: number, y: number) =>
    Math.max(...shapes.map((s) => Math.max(0, 1 - Math.hypot(x - s.x, y - s.y) / (s.r * 1.6))));

  return (
    <>
      {Array.from({ length: cols * n }, (_, i) => {
        const x = (i % cols) * cell;
        const y = Math.floor(i / cols) * cell;
        const v = near(x + cell / 2, y + cell / 2);
        return (
          <rect
            key={i}
            x={x + 0.6}
            y={y + 0.6}
            width={cell - 1.2}
            height={cell - 1.2}
            rx={1}
            fill={`url(#${id})`}
            opacity={0.06 + v * 0.55 + rand() * 0.05}
          />
        );
      })}
      <g fill="none" strokeWidth={1.4} strokeLinecap="round" className="stroke-foreground/70">
        <path d="M42 32c10 0 19 8 18 18s-9 19-19 18-18-9-17-19 8-17 18-17z" />
        <path d="M104 30l15 26H89z" />
        <path d="M130 66h16v16h-16z" />
      </g>
      <g fill="none" strokeWidth={0.8} className="stroke-signal">
        <rect x={19} y={27} width={46} height={46} rx={1} />
        <rect x={84} y={25} width={40} height={36} rx={1} />
        <rect x={126} y={62} width={24} height={24} rx={1} strokeDasharray="2 2" />
      </g>
    </>
  );
}

// Abstract product UI: sidebar, header, KPI tiles, a bar chart, rows.
function Product({ rand, id }: { rand: () => number; id: string }) {
  const bars = Array.from({ length: 9 }, () => 0.25 + rand() * 0.75);
  return (
    <g transform="translate(18 14)">
      <rect width={124} height={78} rx={3} className="fill-card stroke-border" strokeWidth={0.6} />
      <rect x={0.3} y={0.3} width={22} height={77.4} rx={3} className="fill-muted" />
      {[10, 18, 26, 34].map((y) => (
        <rect key={y} x={5} y={y} width={12} height={2.4} rx={1.2} className="fill-foreground/20" />
      ))}
      <rect x={28} y={6} width={40} height={3} rx={1.5} className="fill-foreground/40" />
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${28 + k * 31} 14)`}>
          <rect width={27} height={14} rx={2} className="fill-muted" />
          <rect x={4} y={4} width={10} height={2} rx={1} className="fill-foreground/25" />
          <rect x={4} y={8} width={16} height={3} rx={1.5} fill={`url(#${id})`} />
        </g>
      ))}
      <g transform="translate(28 34)">
        <rect width={58} height={38} rx={2} className="fill-muted" />
        {bars.map((b, k) => (
          <rect
            key={k}
            x={5 + k * 5.6}
            y={33 - b * 26}
            width={3.4}
            height={b * 26}
            rx={1}
            fill={`url(#${id})`}
          />
        ))}
      </g>
      <g transform="translate(90 34)">
        {[0, 1, 2, 3, 4].map((k) => (
          <g key={k} transform={`translate(0 ${k * 7.6})`}>
            <rect width={28} height={5} rx={1.5} className="fill-muted" />
            <rect
              x={2}
              y={1.6}
              width={6 + rand() * 12}
              height={1.8}
              rx={0.9}
              className="fill-foreground/25"
            />
          </g>
        ))}
      </g>
    </g>
  );
}

// Token constellation: nodes joined into a few chains, one marked as the active path.
function Ai({ rand, id }: { rand: () => number; id: string }) {
  const nodes = Array.from({ length: 26 }, () => ({
    x: 14 + rand() * (W - 28),
    y: 12 + rand() * (H - 24),
    r: 0.8 + rand() * 1.8,
  }));
  const path = [0, 3, 7, 11, 16, 21].map((i) => nodes[i]);
  return (
    <>
      <g className="stroke-foreground/12" strokeWidth={0.5}>
        {nodes.slice(1).map((n, i) => (
          <line key={i} x1={nodes[i].x} y1={nodes[i].y} x2={n.x} y2={n.y} />
        ))}
      </g>
      <polyline
        points={path.map((n) => `${n.x},${n.y}`).join(" ")}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={1.2}
      />
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={`url(#${id})`}
          opacity={0.55 + rand() * 0.45}
        />
      ))}
      {path.map((n, i) => (
        <circle
          key={`p${i}`}
          cx={n.x}
          cy={n.y}
          r={2.4}
          className="fill-background stroke-signal"
          strokeWidth={0.8}
        />
      ))}
    </>
  );
}

export function ProjectCover({
  slug,
  motif,
  className,
}: {
  slug: string;
  motif: CoverMotif;
  className?: string;
}) {
  const rand = mulberry32(seedFrom(slug));
  const id = `cover-${slug}`;
  const Motif = { vision: Vision, product: Product, ai: Ai }[motif];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn("size-full bg-muted", className)}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2={W} y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--spectrum-start)" }} />
          <stop offset="1" style={{ stopColor: "var(--spectrum-end)" }} />
        </linearGradient>
      </defs>
      <Motif rand={rand} id={id} />
    </svg>
  );
}
