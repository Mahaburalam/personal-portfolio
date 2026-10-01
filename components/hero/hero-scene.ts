/**
 * Hero visual scene (CLAUDE.md §8): IMAGE → VISUAL TOKENS → REASONING → INTELLIGENT OUTPUT, drawn on
 * a 2D canvas in a virtual VW × VH space with a small perspective projection. Glass panels turn away
 * from the viewer; the token panels are sampled from the photo itself, so the tokens really are the
 * image. Colours come from theme tokens (passed in as a Palette) — nothing is hardcoded here.
 */

export const VW = 1000;
export const VH = 440;

const CY = 216;
const FOCAL = 1400;
const THETA = (65 * Math.PI) / 180;
const COS = Math.cos(THETA);
const SIN = Math.sin(THETA);

export type RGB = [number, number, number];
export type Pt = [number, number];

export type Palette = {
  dark: boolean;
  bg: RGB;
  fg: RGB;
  blue: RGB;
  violet: RGB;
  cyan: RGB;
};

/** A vertical plane rotated about Y so its right edge recedes. `x` is its centre on screen. */
type Plane = { x: number; w: number; h: number };

const IMAGE: Plane = { x: 92, w: 300, h: 336 };
const IMAGE_FRAME: Plane = { x: 88, w: 334, h: 370 };
const TOKENS: Plane[] = [
  { x: 214, w: 240, h: 314 },
  { x: 306, w: 232, h: 326 },
  { x: 386, w: 204, h: 324 },
  { x: 496, w: 310, h: 360 },
];
const FRAMES: Plane[] = [
  { x: 300, w: 420, h: 400 },
  { x: 470, w: 340, h: 420 },
];
const REASON: Plane = { x: 632, w: 290, h: 302 };
const OUT: Pt = [832, 210];

/** Horizontal centre of each stage (0–1), for the captions under the canvas. */
export const stageCenters = [IMAGE.x, (TOKENS[0].x + TOKENS[3].x) / 2, REASON.x, OUT[0]].map(
  (x) => x / VW,
);

// ---------------------------------------------------------------------------------------------
// Geometry + colour helpers
// ---------------------------------------------------------------------------------------------

// Each plane gets its own perspective centre (like CSS `perspective()` per element), so panels keep
// the same look wherever they sit instead of stretching toward one vanishing point.
function project(p: Plane, a: number, b: number): Pt {
  const u = (a - 0.5) * p.w;
  const v = (b - 0.5) * p.h;
  const s = FOCAL / (FOCAL + u * SIN);
  return [p.x + u * COS * s, CY + v * s];
}

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
export const rgba = (c: RGB, a: number) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
const lum = (c: RGB) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;

/** `#rgb` / `#rrggbb` → RGB (theme tokens are hex). */
export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = [...h].map((x) => x + x).join("");
  const n = parseInt(h, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function quadPath(ctx: CanvasRenderingContext2D, q: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(q[0][0], q[0][1]);
  for (let k = 1; k < q.length; k++) ctx.lineTo(q[k][0], q[k][1]);
  ctx.closePath();
}

const planeQuad = (p: Plane): Pt[] => [
  project(p, 0, 0),
  project(p, 1, 0),
  project(p, 1, 1),
  project(p, 0, 1),
];

function cellQuad(p: Plane, cols: number, rows: number, i: number, j: number, size: number): Pt[] {
  const pad = 0.06;
  const cw = (1 - pad * 2) / cols;
  const ch = (1 - pad * 2) / rows;
  const a0 = pad + (i + (1 - size) / 2) * cw;
  const b0 = pad + (j + (1 - size) / 2) * ch;
  const a1 = a0 + size * cw;
  const b1 = b0 + size * ch;
  return [project(p, a0, b0), project(p, a1, b0), project(p, a1, b1), project(p, a0, b1)];
}

/** Average photo colour per cell (draw 4× larger, then box-average). */
function sampleCells(img: HTMLImageElement, cols: number, rows: number): RGB[] {
  const k = 4;
  const c = document.createElement("canvas");
  c.width = cols * k;
  c.height = rows * k;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return Array.from({ length: cols * rows }, () => [0, 0, 0]);
  x.drawImage(img, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  const out: RGB[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let y = 0; y < k; y++) {
        for (let xx = 0; xx < k; xx++) {
          const o = ((j * k + y) * c.width + i * k + xx) * 4;
          r += d[o];
          g += d[o + 1];
          b += d[o + 2];
        }
      }
      out.push([r / (k * k), g / (k * k), b / (k * k)]);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Static layer: panels, photo, token tiles (rendered once per size / theme)
// ---------------------------------------------------------------------------------------------

export type Tile = { quad: Pt[]; color: RGB; ph: number };

function drawPhoto(ctx: CanvasRenderingContext2D, p: Plane, img: HTMLImageElement) {
  // Rotation about Y keeps verticals vertical, so thin vertical strips give exact perspective.
  const n = 90;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  for (let k = 0; k < n; k++) {
    const a0 = k / n;
    const [x0, y0] = project(p, a0, 0);
    const [, y1] = project(p, a0, 1);
    const [x1] = project(p, (k + 1) / n, 0);
    const sx = Math.min(iw - 1, a0 * iw);
    ctx.drawImage(img, sx, 0, Math.max(1, iw / n), ih, x0, y0, x1 - x0 + 0.6, y1 - y0);
  }
}

export function drawStatic(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  pal: Palette,
  rand: () => number,
): Tile[] {
  const { dark, fg, blue, violet, cyan, bg } = pal;
  const tone = (c: RGB) => (dark ? c : mix(c, bg, 0.3));
  const alpha = (a: number) => (dark ? a : a * 0.85);
  const edge = mix(blue, fg, dark ? 0.55 : 0.2);
  const twinkles: Tile[] = [];

  const glass = (p: Plane, c: RGB, a: number) => {
    quadPath(ctx, planeQuad(p));
    ctx.fillStyle = rgba(c, a);
    ctx.fill();
  };
  const border = (p: Plane, c: RGB, a: number, width: number) => {
    quadPath(ctx, planeQuad(p));
    ctx.strokeStyle = rgba(c, a);
    ctx.lineWidth = width;
    ctx.stroke();
  };
  const tile = (q: Pt[], c: RGB, a: number, keep: boolean) => {
    quadPath(ctx, q);
    ctx.fillStyle = rgba(tone(c), alpha(a));
    ctx.fill();
    if (keep) twinkles.push({ quad: q, color: c, ph: rand() * Math.PI * 2 });
  };

  // Faint large frames behind the token stack — depth.
  for (const f of FRAMES) border(f, edge, dark ? 0.12 : 0.18, 1);

  // 01 Image: photo in a glowing double frame.
  border(IMAGE_FRAME, edge, dark ? 0.3 : 0.35, 1);
  glass(IMAGE_FRAME, dark ? blue : fg, dark ? 0.05 : 0.03);
  drawPhoto(ctx, IMAGE, img);
  glass(IMAGE, blue, dark ? 0.1 : 0.04);
  border(IMAGE, dark ? mix(fg, blue, 0.15) : mix(blue, bg, 0.3), dark ? 0.95 : 0.7, 2.2);

  // 02 Patches → visual tokens, sampled from the photo.
  const [t1, t2, t3, t4] = TOKENS;

  glass(t1, blue, dark ? 0.07 : 0.05);
  const c1 = sampleCells(img, 6, 8);
  c1.forEach((c, k) => {
    if (rand() < 0.16) return;
    const l = lum(c);
    tile(
      cellQuad(t1, 6, 8, k % 6, Math.floor(k / 6), 0.74),
      mix(mix(c, blue, dark ? 0.55 : 0.75), fg, l * 0.35),
      0.35 + l * 0.55,
      false,
    );
  });
  border(t1, edge, dark ? 0.55 : 0.4, 1.2);

  glass(t2, violet, dark ? 0.08 : 0.05);
  const c2 = sampleCells(img, 5, 8);
  c2.forEach((c, k) => {
    if (rand() < 0.24) return;
    const l = lum(c) + rand() * 0.3;
    const col =
      l > 0.95
        ? mix(cyan, fg, 0.45)
        : l > 0.75
          ? mix(blue, fg, 0.3)
          : l > 0.55
            ? violet
            : mix(violet, fg, 0.35);
    tile(cellQuad(t2, 5, 8, k % 5, Math.floor(k / 5), 0.7), col, 0.8, rand() < 0.25);
  });
  border(t2, edge, dark ? 0.5 : 0.38, 1.2);

  glass(t3, blue, dark ? 0.05 : 0.04);
  const c3 = sampleCells(img, 8, 12);
  c3.forEach((c, k) => {
    if (rand() < 0.2) return;
    const l = lum(c);
    tile(
      cellQuad(t3, 8, 12, k % 8, Math.floor(k / 8), 0.64),
      mix(mix(c, violet, dark ? 0.6 : 0.8), fg, l * 0.3),
      0.3 + l * 0.6,
      rand() < 0.12,
    );
  });
  border(t3, edge, dark ? 0.42 : 0.32, 1);

  // Dense token grid with grid lines.
  ctx.strokeStyle = rgba(blue, dark ? 0.14 : 0.12);
  ctx.lineWidth = 0.6;
  for (let i = 0; i <= 14; i++) {
    ctx.beginPath();
    const [x0, y0] = project(t4, 0.06 + (i / 14) * 0.88, 0.06);
    const [x1, y1] = project(t4, 0.06 + (i / 14) * 0.88, 0.94);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  for (let j = 0; j <= 20; j++) {
    ctx.beginPath();
    const [x0, y0] = project(t4, 0.06, 0.06 + (j / 20) * 0.88);
    const [x1, y1] = project(t4, 0.94, 0.06 + (j / 20) * 0.88);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  const c4 = sampleCells(img, 14, 20);
  c4.forEach((c, k) => {
    const l = Math.pow(lum(c), 1.4);
    if (l < 0.08 && rand() < 0.6) return;
    tile(
      cellQuad(t4, 14, 20, k % 14, Math.floor(k / 14), 0.48),
      dark ? mix(blue, fg, l * 0.75) : mix(blue, violet, l),
      0.1 + l * 0.9,
      rand() < 0.08,
    );
  });
  border(t4, edge, dark ? 0.35 : 0.3, 1);

  // 03 Reasoning panel: cyan-edged glass.
  glass(REASON, cyan, dark ? 0.035 : 0.04);
  border(REASON, cyan, dark ? 0.85 : 0.6, 1.6);

  return twinkles;
}

// ---------------------------------------------------------------------------------------------
// Animated layer: twinkling tokens, scan line, reasoning dots, beam, output cloud, ambient grid
// ---------------------------------------------------------------------------------------------

/** Sprite / colour slots used by the animated layer; Beam0 + k (k < BEAM_STEPS) runs cyan → blue. */
const Ink = { Cyan: 0, Blue: 1, Violet: 2, Lavender: 3, White: 4, Beam0: 5 } as const;
export const BEAM_STEPS = 6;

export function inkColors(pal: Palette): RGB[] {
  const { cyan, blue, violet, fg } = pal;
  return [
    cyan,
    blue,
    violet,
    mix(violet, fg, 0.4),
    fg,
    ...Array.from({ length: BEAM_STEPS }, (_, k) => mix(cyan, blue, k / (BEAM_STEPS - 1))),
  ];
}

type Dot = { a: number; b: number; ph: number; sp: number; r: number; ink: number };
type Beam = { q: number; sp: number; off: number; ph: number; r: number };
type CloudPt = { x: number; y: number; z: number; r: number; ink: number };
type Ambient = { x: number; y: number; ph: number; r: number; ink: number };

export type Particles = { dots: Dot[]; beam: Beam[]; cloud: CloudPt[]; ambient: Ambient[] };

export function createParticles(rand: () => number, density: number): Particles {
  const gauss = () => (rand() + rand() + rand() + rand() - 2) * 0.87;
  const n = (k: number) => Math.round(k * density);

  const dots: Dot[] = Array.from({ length: n(420) }, () => {
    const clustered = rand() < 0.6;
    return {
      a: clamp(clustered ? 0.72 + gauss() * 0.16 : rand(), 0.04, 0.96),
      b: clamp(clustered ? 0.5 + gauss() * 0.2 : rand(), 0.04, 0.96),
      ph: rand() * Math.PI * 2,
      sp: 0.4 + rand() * 0.8,
      r: 0.8 + rand() * 1.1,
      ink: rand() < 0.75 ? Ink.Cyan : Ink.White,
    };
  });

  const beam: Beam[] = Array.from({ length: n(560) }, () => ({
    q: rand(),
    sp: 0.12 + rand() * 0.22,
    off: gauss(),
    ph: rand() * Math.PI * 2,
    r: 0.7 + rand() * 1.2,
  }));

  const lobes: [number, number, number, number][] = [
    [0, 0, 0, 34],
    [-44, -40, 18, 26],
    [40, 44, -14, 24],
    [58, -24, 30, 20],
    [-30, 56, -26, 18],
  ];
  const cloud: CloudPt[] = Array.from({ length: n(1000) }, () => {
    const halo = rand() < 0.15;
    const [lx, ly, lz, s] = halo ? [0, 0, 0, 80] : lobes[Math.floor(rand() * lobes.length)];
    const pick = rand();
    return {
      x: lx + gauss() * s,
      y: ly + gauss() * s * 0.95,
      z: lz + gauss() * s,
      r: 0.7 + rand() * 1.2,
      ink:
        pick < 0.62 ? Ink.Violet : pick < 0.84 ? Ink.Blue : pick < 0.94 ? Ink.Lavender : Ink.White,
    };
  });

  const ambient: Ambient[] = [];
  for (let x = 540; x < 998; x += 12) {
    for (let y = 14; y < 428; y += 12) {
      const d = Math.hypot(x - OUT[0], (y - OUT[1]) * 1.2);
      const p = 0.7 * Math.exp(-d / 170) + 0.08;
      if (rand() < p * density) {
        ambient.push({
          x,
          y,
          ph: rand() * Math.PI * 2,
          r: 0.7 + rand() * 0.8,
          ink: d < 120 ? Ink.Violet : rand() < 0.55 ? Ink.Cyan : Ink.Blue,
        });
      }
    }
  }

  return { dots, beam, cloud, ambient };
}

export type DrawDot = (x: number, y: number, r: number, ink: number, alpha: number) => void;

/** One animation frame at time `t` (seconds). `fade` (0–1) fades particles in during the reveal. */
export function drawDynamic(
  ctx: CanvasRenderingContext2D,
  t: number,
  fade: number,
  pal: Palette,
  twinkles: Tile[],
  parts: Particles,
  dot: DrawDot,
) {
  const { dark, cyan, fg } = pal;
  if (dark) ctx.globalCompositeOperation = "lighter";

  // Token twinkles.
  for (const tw of twinkles) {
    const a = Math.pow(Math.max(0, Math.sin(t * 1.4 + tw.ph)), 3) * (dark ? 0.55 : 0.35) * fade;
    if (a < 0.01) continue;
    quadPath(ctx, tw.quad);
    ctx.fillStyle = rgba(mix(tw.color, fg, dark ? 0.45 : 0), a);
    ctx.fill();
  }

  // Scan line sweeping the photo.
  const sv = ((t * 0.22) % 1.5) - 0.1;
  if (sv > 0 && sv < 1) {
    const [x0, y0] = project(IMAGE, 0, sv);
    const [x1, y1] = project(IMAGE, 1, sv);
    ctx.strokeStyle = rgba(cyan, 0.75 * fade);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    quadPath(ctx, [
      project(IMAGE, 0, Math.max(0, sv - 0.08)),
      project(IMAGE, 1, Math.max(0, sv - 0.08)),
      [x1, y1],
      [x0, y0],
    ]);
    ctx.fillStyle = rgba(cyan, 0.1 * fade);
    ctx.fill();
  }

  // Ambient dot lattice around reasoning and output.
  for (const p of parts.ambient) {
    const a = (0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.3 + p.ph))) * fade;
    dot(p.x, p.y, p.r, p.ink, a);
  }

  // Reasoning: dots drifting inside the panel.
  for (const d of parts.dots) {
    const [x, y] = project(
      REASON,
      d.a + Math.sin(t * d.sp + d.ph) * 0.014,
      d.b + Math.cos(t * d.sp * 0.8 + d.ph) * 0.012,
    );
    dot(x, y, d.r, d.ink, (0.45 + 0.4 * Math.sin(t * 2 * d.sp + d.ph)) * fade);
  }

  // Beam: tokens stream from the reasoning panel into the output cloud.
  const [sx, sy] = project(REASON, 0.8, 0.5);
  for (const b of parts.beam) {
    const q = (b.q + t * b.sp) % 1;
    const spread = 6 + 64 * Math.pow(q, 1.5);
    const x = sx + (OUT[0] - sx) * q;
    const y = sy + (OUT[1] - sy) * q + b.off * spread + Math.sin(t * 2 + b.ph) * 2;
    const ink = Ink.Beam0 + Math.min(BEAM_STEPS - 1, Math.floor(q * BEAM_STEPS));
    dot(x, y, b.r, ink, Math.pow(Math.sin(Math.PI * q), 0.6) * 0.85 * fade);
  }

  // Output: an irregular point cloud turning slowly in depth.
  const ang = t * 0.18;
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  for (const p of parts.cloud) {
    const x = p.x * ca - p.z * sa;
    const z = p.x * sa + p.z * ca;
    const s = (380 / (380 + z)) * 1.15;
    const depth = clamp((s / 1.15 - 0.82) / 0.36);
    dot(OUT[0] + x * s, OUT[1] + p.y * s, p.r * s, p.ink, (0.35 + 0.6 * depth) * fade);
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}
