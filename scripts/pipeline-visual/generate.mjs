/**
 * Pipeline visual: IMAGE → VISUAL TOKENS → REASONING → INTELLIGENT OUTPUT (owner's mockup), as standalone
 * brand assets in public/hero/pipeline/ — static SVG, CSS-animated SVG and Lottie JSON, dark + light.
 * PNGs are rendered from the static SVGs by render-png.sh. Not used by the site hero (CLAUDE.md §8).
 *
 * The scene is built once as plain data (polygons, circles, glyph contours) and serialised twice, so SVG
 * and Lottie match. Panels are faked 3D: every point goes through a per-panel perspective projection.
 * Deterministic (seeded). No npm deps; the photo warp needs python3 + Pillow. Run: pnpm gen:pipeline
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "../../public/hero/pipeline");
const glyphs = JSON.parse(readFileSync(join(here, "label-glyphs.json"), "utf8"));

const W = 1920;
const H = 1080;
const FPS = 30;
const INTRO = 45; // 1.5s build-in, plays once (Lottie marker "intro")
const LOOP = 180; // 6s seamless loop (Lottie marker "loop"); every period below divides it
const END = INTRO + LOOP;
const IN_DUR = 24;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const THEMES = {
  dark: {
    bg: "#070A12",
    card: "#0C101A",
    ink: "#E6E6E6",
    muted: "#8A92A3",
    s0: "#6E8BFF",
    s1: "#A47BFF",
    signal: "#3FD0D4",
    glow: true,
  },
  light: {
    bg: "#F4F5F7",
    card: "#FFFFFF",
    ink: "#12141A",
    muted: "#5B6170",
    s0: "#3149D8",
    s1: "#6A3FD4",
    signal: "#0E8F9A",
    glow: false,
  },
};

// ---------- utils ----------

/** Same algorithm as lib/random.ts (this .mjs script can't import TS). */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const r1 = (n) => Math.round(n * 10) / 10;
const r3 = (n) => Math.round(n * 1000) / 1000;
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c) =>
  "#" +
  c
    .map((v) =>
      Math.round(clamp(v, 0, 255))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
const mix = (a, b, t) => {
  const [ca, cb] = [rgb(a), rgb(b)];
  return toHex(ca.map((v, i) => v + (cb[i] - v) * t));
};
const avg = (cols) =>
  toHex([0, 1, 2].map((i) => cols.reduce((s, c) => s + rgb(c)[i], 0) / cols.length));
const lum = (h) => {
  const [r, g, b] = rgb(h);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
const rect = (x0, y0, x1, y1) => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const chamfer = (x0, y0, x1, y1, c) => [
  [x0 + c, y0],
  [x1 - c, y0],
  [x1, y0 + c],
  [x1, y1 - c],
  [x1 - c, y1],
  [x0 + c, y1],
  [x0, y1 - c],
  [x0, y0 + c],
];
const ngon = (cx, cy, r, n = 16, jitter = () => 1) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = jitter();
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
  });
const cubic = (p0, p1, p2, p3, t) => {
  const m = 1 - t;
  return [0, 1].map(
    (i) => m * m * m * p0[i] + 3 * m * m * t * p1[i] + 3 * m * t * t * p2[i] + t * t * t * p3[i],
  );
};
function inPoly([x, y], pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// ---------- scene items ----------
// poly: { t:"poly", pts, fill?, o, stroke?: {c, w, o}, open? }   circle: { t:"circle", x, y, r, fill, o, stroke? }
// bez: { t:"bez", contours: [{v, i, o}], fill, o }                group: { t:"group", items, anim? }
// fill: "#hex" | { lin: [[x,y],[x,y]], stops } | { rad: [[cx,cy], r], stops }   stops: [offset, "#hex", alpha]
// anim: pulse (opacity) · flow (particle along a path) · scan (translate) · breathe (scale) — see TRACKS.

const poly = (pts, fill, o = 1, extra = {}) => ({ t: "poly", pts, fill, o, ...extra });
const line = (pts, c, w, o) => ({ t: "poly", pts, open: true, o: 1, stroke: { c, w, o } });
const group = (items, anim) => ({ t: "group", items, anim });
/** Opacity pulse around a shape's own opacity: the group carries it, so the shape becomes opaque. */
const pulsed = (shape, a) => group([{ ...shape, o: 1 }], { kind: "pulse", base: shape.o, ...a });

/** Per-panel perspective: a 300×400 plane rotated about Y, its right side receding. */
const THETA = (62 * Math.PI) / 180;
const FOCAL = 1600;
function projector(cx, cy, S) {
  const c = Math.cos(THETA);
  const s = Math.sin(THETA);
  return ([x, y]) => {
    const u = x - 150;
    const v = y - 200;
    const k = FOCAL / (FOCAL + u * s);
    return [cx + u * c * k * S, cy + v * k * S];
  };
}

const CY = 470;
const PANELS = {
  image: { cx: 215, S: 1.3 },
  patches: { cx: 435, S: 1.25 },
  embed: { cx: 585, S: 1.25 },
  tokens: { cx: 735, S: 1.25 },
  matrix: { cx: 885, S: 1.25 },
  reasoning: { cx: 1090, S: 1.25 },
};
const proj = Object.fromEntries(
  Object.entries(PANELS).map(([k, p]) => [k, projector(p.cx, CY, p.S)]),
);
const FRAME = rect(0, 0, 300, 400);

/**
 * Source photo for the image panel; patches and tokens are sampled from it too. Pre-warped into the
 * panel's perspective by warp-photo.py (Pillow). Set to null for the procedural vector street.
 */
const PHOTO_SRC = join(here, "../../public/hero/street.jpg");
const PHOTO = PHOTO_SRC
  ? JSON.parse(
      execFileSync("python3", [join(here, "warp-photo.py")], {
        input: JSON.stringify({ src: PHOTO_SRC, quad: FRAME.map(proj.image), scale: 2 }),
        maxBuffer: 64 * 1024 * 1024,
      }).toString(),
    )
  : null;

// ---------- 01 image: a vector street (local 300×400, vanishing point ≈ 150,240) ----------

const SKY_STOPS = [
  [0, "#3E55BE"],
  [0.55, "#93A6F2"],
  [1, "#E2E6F6"],
];
function skyColor(y) {
  const t = clamp(y / 260, 0, 1);
  for (let i = 1; i < SKY_STOPS.length; i++) {
    const [o0, c0] = SKY_STOPS[i - 1];
    const [o1, c1] = SKY_STOPS[i];
    if (t <= o1) return mix(c0, c1, (t - o0) / (o1 - o0));
  }
  return SKY_STOPS.at(-1)[1];
}

/** Scene polygons in local coords, bottom → top. `sky: true` = vertical gradient. */
function buildScene() {
  const rand = mulberry32(5);
  const items = [{ pts: rect(0, 0, 300, 262), sky: true }];
  const add = (pts, c) => items.push({ pts, c });

  // distant blocks + the tower at the vanishing point
  add(rect(110, 198, 127, 240), "#8C97BC");
  add(rect(124, 208, 140, 240), "#7D89AE");
  add(rect(160, 202, 176, 240), "#8591B5");
  add(rect(172, 212, 190, 240), "#7A85A9");
  add(
    [
      [149.3, 88],
      [150.7, 88],
      [151, 118],
      [149, 118],
    ],
    "#59627E",
  );
  add(
    [
      [147.6, 118],
      [152.4, 118],
      [153.8, 240],
      [146.2, 240],
    ],
    "#59627E",
  );
  add(ngon(150, 148, 8.5, 12), "#646E8C");

  // facades: s ∈ [0,1] from the near edge to the far edge (foreshortened), t ∈ [0,1] top → bottom
  const facade = (nearX, farX, top, bottom, color, seed) => {
    const [t0, t1] = top; // y at near / far edge
    const [b0, b1] = bottom;
    const at = (s, t) => {
      const f = (2 * s) / (1 + s);
      const x = nearX + (farX - nearX) * f;
      const yt = t0 + (t1 - t0) * f;
      const yb = b0 + (b1 - b0) * f;
      return [x, yt + (yb - yt) * t];
    };
    const quad = (sa, sb, ta, tb) => [at(sa, ta), at(sb, ta), at(sb, tb), at(sa, tb)];
    const r = mulberry32(seed);
    add(quad(0, 1, 0, 1), color);
    add(quad(0, 1, 0, 0.035), mix(color, "#000000", 0.25));
    add(quad(0, 1, 0.86, 1), mix(color, "#000000", 0.2));
    const cols = 7;
    const rows = 9;
    for (let ci = 0; ci < cols; ci++) {
      for (let ri = 0; ri < rows; ri++) {
        const roll = r();
        const c = roll < 0.12 ? "#D6C38A" : roll < 0.3 ? "#2A3043" : "#56628A";
        add(
          quad(
            (ci + 0.22) / cols,
            (ci + 0.72) / cols,
            0.07 + (ri + 0.18) * (0.76 / rows),
            0.07 + (ri + 0.68) * (0.76 / rows),
          ),
          c,
        );
      }
    }
  };
  facade(0, 124, [30, 198], [322, 244], "#3A4259", 13);
  facade(300, 178, [14, 196], [340, 244], "#333A4F", 17);

  // road, grass median, curbs, lane dashes
  add(
    [
      [0, 400],
      [0, 336],
      [128, 242],
      [172, 242],
      [300, 352],
      [300, 400],
    ],
    "#454B5C",
  );
  add(
    [
      [146, 242],
      [154, 242],
      [198, 400],
      [102, 400],
    ],
    "#4F5F4B",
  );
  const lane = (from, to) => {
    for (let k = 0; k < 7; k++) {
      const t0 = (k / 7) ** 1.7;
      const t1 = ((k + 0.5) / 7) ** 1.7;
      const p = (t) => [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
      const [a, b] = [p(t0), p(t1)];
      const [wa, wb] = [0.4 + t0 * 3, 0.4 + t1 * 3];
      add(
        [
          [a[0] - wa, a[1]],
          [a[0] + wa, a[1]],
          [b[0] + wb, b[1]],
          [b[0] - wb, b[1]],
        ],
        "#C9CEDB",
      );
    }
  };
  lane([138, 242], [36, 400]);
  lane([162, 242], [264, 400]);
  add(
    [
      [145, 242],
      [146.5, 242],
      [104, 400],
      [98, 400],
    ],
    "#8E95A6",
  );
  add(
    [
      [153.5, 242],
      [155, 242],
      [202, 400],
      [196, 400],
    ],
    "#8E95A6",
  );

  // tree rows along both kerbs, shrinking toward the vanishing point
  const trees = (from, to, r0, r1) => {
    for (let k = 5; k >= 0; k--) {
      const t = k / 5;
      const cx = from[0] + (to[0] - from[0]) * t;
      const cy = from[1] + (to[1] - from[1]) * t;
      const r = r0 + (r1 - r0) * t;
      const blob = ngon(cx, cy - r * 0.3, r, 14, () => 0.85 + rand() * 0.3).map(([x, y]) => [
        clamp(x, 0, 300),
        clamp(y, 0, 400),
      ]);
      add(blob, k % 2 ? "#21403C" : "#2B5249");
    }
  };
  trees([26, 306], [122, 240], 34, 6);
  trees([274, 318], [180, 240], 34, 6);
  return items;
}

const SCENE = buildScene();
const sceneColor = (p) => {
  if (PHOTO) {
    const { cols, rows, colors } = PHOTO.grid;
    const gx = clamp(Math.floor((p[0] / 300) * cols), 0, cols - 1);
    const gy = clamp(Math.floor((p[1] / 400) * rows), 0, rows - 1);
    return colors[gy * cols + gx];
  }
  for (let i = SCENE.length - 1; i >= 0; i--) {
    const it = SCENE[i];
    if (inPoly(p, it.pts)) return it.sky ? skyColor(p[1]) : it.c;
  }
  return skyColor(p[1]);
};
/** Mean scene color over a local box (n×n samples) — the "patch" of the image under a cell. */
const sampleBox = (x0, y0, x1, y1, n = 4) => {
  const cols = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      cols.push(sceneColor([x0 + ((i + 0.5) / n) * (x1 - x0), y0 + ((j + 0.5) / n) * (y1 - y0)]));
  return avg(cols);
};

// ---------- layers ----------

function panelBase(P, T, { fill, alpha = 1, border, borderW = 1.2, ghost = true } = {}) {
  const items = [];
  const quad = FRAME.map(P);
  if (ghost) {
    const name = Object.keys(proj).find((k) => proj[k] === P);
    const { cx, S } = PANELS[name];
    const G = projector(cx + 30, CY - 6, S * 1.04);
    items.push(
      poly(FRAME.map(G), undefined, 1, {
        stroke: T.glow ? { c: mix(T.s0, T.ink, 0.3), w: 1, o: 0.3 } : { c: T.ink, w: 1, o: 0.12 },
      }),
    );
  }
  if (!T.glow) {
    items.push(
      poly(
        quad.map(([x, y]) => [x + 8, y + 16]),
        T.ink,
        0.05,
      ),
    );
    items.push(
      poly(
        quad.map(([x, y]) => [x + 3, y + 6]),
        T.ink,
        0.05,
      ),
    );
  }
  items.push(poly(quad, fill ?? T.card, alpha));
  return { items, quad, border: border ?? (T.glow ? mix(T.card, T.s0, 0.35) : "#D5DAE2"), borderW };
}

const borderOf = ({ quad, border, borderW }, o = 1) =>
  poly(quad, undefined, 1, { stroke: { c: border, w: borderW, o } });

/** Image panel: card, then the photo (its own layer, clipped to the panel) or the vector street, then the frame. */
function imageLayers(T) {
  const P = proj.image;
  const base = panelBase(P, T, { border: T.glow ? "#D9E4FF" : T.ink, borderW: T.glow ? 2.2 : 1.4 });
  const frame = [
    ...(T.glow ? [poly(base.quad, undefined, 1, { stroke: { c: T.s0, w: 8, o: 0.18 } })] : []),
    borderOf(base, T.glow ? 1 : 0.28),
  ];
  if (PHOTO) {
    return [
      { name: "image", start: 2, items: base.items },
      { name: "image-photo", start: 2, items: [], photo: PHOTO, clip: base.quad },
      { name: "image-frame", start: 2, items: frame },
    ];
  }
  const items = [...base.items];
  for (const it of SCENE) {
    if (it.sky) {
      items.push(
        poly(it.pts.map(P), {
          lin: [P([150, 0]), P([150, 262])],
          stops: SKY_STOPS.map(([o, c]) => [o, c, 1]),
        }),
      );
    } else items.push(poly(it.pts.map(P), it.c));
  }
  return [{ name: "image", start: 2, items: [...items, ...frame] }];
}

function scanLayer(T) {
  const P = proj.image;
  const band = [
    [0, -80],
    [300, -80],
    [300, 0],
    [0, 0],
  ].map(P);
  const top = Math.min(...band.map((p) => p[1]));
  const bottom = Math.max(...FRAME.map(P).map((p) => p[1]));
  const a = T.glow ? 1 : 0.6;
  const grad = {
    lin: [
      [0, top],
      [0, Math.max(...band.map((p) => p[1]))],
    ],
    stops: [
      [0, T.signal, 0],
      [0.82, T.signal, 0.2 * a],
      [0.97, T.glow ? "#E6FCFF" : T.signal, 0.55 * a],
      [1, T.signal, 0],
    ],
  };
  return {
    clip: FRAME.map(P),
    items: [group([poly(band, grad)], { kind: "scan", P: 180, phase: 0, dy: bottom - top + 4 })],
  };
}

function patchesLayer(T) {
  const P = proj.patches;
  const base = panelBase(P, T);
  const items = [...base.items];
  const cols = 6;
  const rows = 8;
  const g = 3.5;
  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const [x0, y0] = [cx * 50, cy * 50];
      const c = mix(sampleBox(x0, y0, x0 + 50, y0 + 50), T.s0, T.glow ? 0.14 : 0.08);
      items.push(poly(rect(x0 + g, y0 + g, x0 + 50 - g, y0 + 50 - g).map(P), c));
    }
  }
  // selected patches hop: one highlight after another (CLAUDE.md §8 "a few patches selected")
  const picks = [
    [2, 2],
    [3, 2],
    [3, 3],
    [2, 4],
    [3, 5],
  ];
  picks.forEach(([cx, cy], i) => {
    const pts = rect(cx * 50 + 2, cy * 50 + 2, cx * 50 + 48, cy * 50 + 48).map(P);
    items.push(
      group(
        [
          poly(pts, T.signal, T.glow ? 0.22 : 0.16),
          poly(pts, undefined, 1, { stroke: { c: T.signal, w: 2, o: 1 } }),
        ],
        { kind: "pulse", P: 180, phase: i * 36, base: 0, amp: 1, e: 6 },
      ),
    );
  });
  items.push(borderOf(base));
  return items;
}

function embedLayer(T) {
  const P = proj.embed;
  const rand = mulberry32(29);
  const base = panelBase(P, T);
  const items = [...base.items];
  const g = 6;
  for (let cx = 0; cx < 6; cx++) {
    for (let cy = 0; cy < 8; cy++) {
      const [x0, y0] = [cx * 50, cy * 50];
      const L = lum(sampleBox(x0, y0, x0 + 50, y0 + 50));
      const hue = mix(T.s0, T.s1, clamp(cx / 6 + (rand() - 0.5) * 0.35, 0, 1));
      const c = mix(T.card, hue, clamp(0.22 + 0.85 * L + (rand() - 0.5) * 0.15, 0.15, 1));
      items.push(poly(chamfer(x0 + g, y0 + g, x0 + 50 - g, y0 + 50 - g, 4).map(P), c));
    }
  }
  items.push(borderOf(base));
  return items;
}

function tokensLayer(T) {
  const P = proj.tokens;
  const rand = mulberry32(31);
  const base = panelBase(P, T);
  const items = [...base.items];
  const cols = 10;
  const rows = 13;
  const [pw, ph] = [300 / cols, 400 / rows];
  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const [x0, y0] = [cx * pw, cy * ph];
      const L = lum(sampleBox(x0, y0, x0 + pw, y0 + ph, 3));
      const live = rand() < 0.1;
      const o = live ? 0.95 : clamp(0.12 + 0.85 * L + (rand() - 0.5) * 0.3, 0.1, 1);
      const c = live ? T.signal : mix(T.s0, T.s1, clamp(cx / cols + (rand() - 0.5) * 0.3, 0, 1));
      const shape = poly(chamfer(x0 + 4, y0 + 4, x0 + pw - 4, y0 + ph - 4, 3.5).map(P), c, o);
      // a brightness wave sweeps left → right through the token grid
      items.push(
        pulsed(shape, { P: 90, phase: cx * 7 + rand() * 6, amp: Math.min(0.45, 1 - o), e: 2 }),
      );
    }
  }
  items.push(borderOf(base));
  return items;
}

function matrixLayer(T) {
  const P = proj.matrix;
  const rand = mulberry32(37);
  const base = panelBase(P, T);
  const items = [...base.items];
  const cols = 14;
  const rows = 19;
  const [pw, ph] = [300 / cols, 400 / rows];
  const dot = T.glow ? mix(T.ink, T.s0, 0.4) : mix(T.s0, T.ink, 0.25);
  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const [x0, y0] = [cx * pw + pw / 2, cy * ph + ph / 2];
      const L = lum(sampleBox(x0 - pw, y0 - ph, x0 + pw, y0 + ph, 3));
      const o = clamp(0.1 + 0.8 * L + (rand() - 0.5) * 0.45, 0.06, 0.95);
      const c = rand() < 0.08 ? T.signal : rand() < 0.25 ? T.s1 : dot;
      const shape = poly(rect(x0 - 4, y0 - 4, x0 + 4, y0 + 4).map(P), c, o);
      items.push(
        rand() < 0.3 ? pulsed(shape, { P: 60, phase: rand() * 60, amp: 1 - o, e: 2 }) : shape,
      );
    }
  }
  items.push(borderOf(base));
  return items;
}

function reasoningLayer(T) {
  const P = proj.reasoning;
  const rand = mulberry32(43);
  const base = panelBase(P, T, {
    fill: mix(T.card, T.signal, T.glow ? 0.1 : 0.05),
    alpha: T.glow ? 0.9 : 1,
    border: T.signal,
    borderW: 1.5,
    ghost: false,
  });
  const items = [...base.items];
  const gauss = () => rand() + rand() + rand() - 1.5;
  const nodes = Array.from({ length: 110 }, () => [
    clamp(300 * Math.sqrt(rand()), 12, 288),
    clamp(200 + gauss() * 150, 16, 384),
  ]);
  // reasoning as a sparse graph: each node links to its nearest neighbour
  for (const [i, a] of nodes.entries()) {
    let best = null;
    let bd = Infinity;
    for (const [j, b] of nodes.entries()) {
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (j !== i && d < bd) [best, bd] = [b, d];
    }
    if (best && bd < 60) items.push(line([a, best].map(P), T.signal, 0.8, T.glow ? 0.35 : 0.4));
  }
  for (const n of nodes) {
    const [x, y] = P(n);
    const c = n[0] > 220 && rand() < 0.4 ? mix(T.signal, T.s1, 0.5) : T.signal;
    const o = 0.35 + rand() * 0.6;
    const dot = { t: "circle", x, y, r: 1.4 + rand() * 2.4, fill: c, o };
    items.push(rand() < 0.25 ? pulsed(dot, { P: 90, phase: rand() * 90, amp: 1 - o, e: 2 }) : dot);
  }
  items.push(borderOf(base, T.glow ? 0.75 : 0.6));
  return items;
}

const CLUSTERS = [
  [1520, 410],
  [1650, 525],
  [1530, 640],
];

function streamsLayer(T) {
  const rand = mulberry32(47);
  const items = [];
  const grad = {
    lin: [
      [1000, 0],
      [1600, 0],
    ],
    stops: [
      [0, T.signal, 1],
      [1, T.s1, 1],
    ],
  };
  const streams = Array.from({ length: 9 }, (_, i) => {
    const y0 = 330 + i * 38;
    const end = CLUSTERS[Math.floor(i / 3)];
    const ctrl = [[1000, y0], [1120, y0], [1300, end[1] + (i % 3) * 14 - 14], end];
    return ctrl;
  });
  for (const s of streams) {
    items.push({
      t: "bez",
      stroke: { c: grad, w: 1.2, o: T.glow ? 0.38 : 0.45 },
      contours: [
        {
          v: [s[0], s[3]],
          o: [
            [s[1][0] - s[0][0], s[1][1] - s[0][1]],
            [0, 0],
          ],
          i: [
            [0, 0],
            [s[2][0] - s[3][0], s[2][1] - s[3][1]],
          ],
        },
      ],
      open: true,
      o: 1,
    });
  }
  for (let p = 0; p < 40; p++) {
    const k = p % 9;
    const pts = Array.from({ length: 13 }, (_, j) => cubic(...streams[k], j / 12));
    items.push(
      group(
        [
          {
            t: "circle",
            x: 0,
            y: 0,
            r: 2 + rand() * 1.6,
            fill: mix(T.signal, T.s1, rand()),
            o: 1,
          },
        ],
        { kind: "flow", P: 90, phase: rand() * 90, pts, alpha: 0.95, key: k },
      ),
    );
  }
  return items;
}

function outputLayer(T) {
  const rand = mulberry32(53);
  const gauss = () => (rand() + rand() + rand() - 1.5) * 1.15;
  const dots = [];
  const core = T.glow ? mix(T.ink, T.s1, 0.2) : mix(T.ink, T.s1, 0.5);
  const twinkle = (dot, i) =>
    i % 4 === 0
      ? pulsed(dot, { P: i % 8 === 0 ? 60 : 90, phase: rand() * 90, amp: (1 - dot.o) * 0.9, e: 2 })
      : dot;

  // the hand-off from reasoning: teal tokens drifting into the output
  for (let i = 0; i < 110; i++) {
    const x = 1210 + rand() ** 0.8 * 220;
    const y = 500 + gauss() * 90;
    dots.push(
      twinkle(
        {
          t: "circle",
          x,
          y,
          r: 1 + rand() * 1.8,
          fill: mix(T.signal, T.s0, rand() * 0.5),
          o: 0.25 + rand() * 0.6,
        },
        i,
      ),
    );
  }
  // scatter around the answer
  for (let i = 0; i < 170; i++) {
    const x = 1350 + rand() ** 0.7 * 520;
    const y = 525 + gauss() * 150;
    dots.push(
      twinkle(
        {
          t: "circle",
          x,
          y,
          r: 0.8 + rand() * 1.6,
          fill: mix(T.s0, T.s1, rand()),
          o: 0.15 + rand() * 0.45,
        },
        i,
      ),
    );
  }
  // three dense clusters: the structured answer
  for (let i = 0; i < 540; i++) {
    const [cx, cy] = CLUSTERS[i % 3];
    const dx = gauss() * 48;
    const dy = gauss() * 42;
    const d = Math.hypot(dx / 48, dy / 42);
    const roll = rand();
    const fill =
      roll < 0.1 ? T.signal : roll < 0.18 && d < 0.7 ? core : mix(T.s0, T.s1, 0.3 + rand() * 0.7);
    dots.push(
      twinkle(
        {
          t: "circle",
          x: cx + dx,
          y: cy + dy,
          r: 1.1 + rand() * 1.6 + Math.max(0, 1 - d) * 1.4,
          fill,
          o: clamp(0.4 + rand() * 0.6 - d * 0.15, 0.25, 1),
        },
        i,
      ),
    );
  }
  const links = line(CLUSTERS, T.ink, 1, T.glow ? 0.18 : 0.22);
  const nodes = CLUSTERS.map(([x, y]) => ({
    t: "circle",
    x,
    y,
    r: 6,
    fill: T.bg,
    o: 1,
    stroke: { c: T.signal, w: 1.8, o: 1 },
  }));
  return [
    group([links, ...dots, ...nodes], { kind: "breathe", P: 180, amt: 0.03, origin: [1585, 525] }),
  ];
}

function halosLayer(T) {
  if (!T.glow) return [];
  const halo = ([cx, cy], r, c, a) =>
    poly(rect(cx - r, cy - r, cx + r, cy + r), {
      rad: [[cx, cy], r],
      stops: [
        [0, c, a],
        [1, c, 0],
      ],
    });
  return [
    halo([215, 470], 330, T.s0, 0.08),
    halo([760, 470], 420, T.s0, 0.09),
    halo([1100, 480], 320, T.signal, 0.1),
    halo([1585, 525], 380, T.s1, 0.17),
  ];
}

function labelsLayer(T) {
  const SIZE = 22;
  const k = SIZE / glyphs.size;
  const BASE = 880;
  const label = (text, cx, color, o = 1) => {
    const g = glyphs.glyphs[text];
    const x0 = cx - (g.advance * k) / 2;
    return {
      t: "bez",
      fill: color,
      o,
      contours: g.contours.map((c) => ({
        v: c.v.map(([x, y]) => [x0 + x * k, BASE + y * k]),
        i: c.i.map(([x, y]) => [x * k, y * k]),
        o: c.o.map(([x, y]) => [x * k, y * k]),
      })),
      width: g.advance * k,
      cx,
    };
  };
  const words = [
    label("Image", 215, T.muted),
    label("Visual Tokens", 660, T.muted),
    label("Reasoning", 1090, T.muted),
    label("Intelligent Output", 1585, T.muted),
  ];
  const arrows = words
    .slice(1)
    .map((w, i) =>
      label(
        "→",
        (words[i].cx + words[i].width / 2 + w.cx - w.width / 2) / 2,
        T.muted,
        T.glow ? 0.5 : 0.6,
      ),
    );
  return [...words, ...arrows];
}

function buildLayers(T) {
  return [
    { name: "halos", start: 0, items: halosLayer(T) },
    ...imageLayers(T),
    { name: "image-scan", start: 2, ...scanLayer(T) },
    { name: "patches", start: 5, items: patchesLayer(T) },
    { name: "embedding", start: 8, items: embedLayer(T) },
    { name: "visual-tokens", start: 11, items: tokensLayer(T) },
    { name: "token-matrix", start: 14, items: matrixLayer(T) },
    { name: "reasoning", start: 17, items: reasoningLayer(T) },
    { name: "streams", start: 19, items: streamsLayer(T) },
    { name: "output", start: 21, items: outputLayer(T) },
    { name: "labels", start: 20, items: labelsLayer(T) },
  ].filter((l) => l.items.length || l.photo);
}

// ---------- tracks: one timeline, serialised to CSS keyframes and Lottie keyframes ----------

const fade = (s) => clamp(Math.min(s / 0.15, (1 - s) / 0.15), 0, 1);
const TRACKS = {
  pulse: (a) => ({
    n: 8,
    disc: false,
    css: `pulse-${a.P}-${a.e}`,
    cssFrame: (s) => `opacity:calc(var(--b) + var(--a) * ${r3(Math.sin(Math.PI * s) ** a.e)})`,
    lottie: { o: (s) => r1((a.base + a.amp * Math.sin(Math.PI * s) ** a.e) * 100) },
  }),
  flow: (a) => {
    const at = (s) => a.pts[Math.round(s * 12)];
    return {
      n: 12,
      disc: true,
      css: `flow-${a.key}`,
      cssFrame: (s) =>
        `transform:translate(${r1(at(s)[0])}px,${r1(at(s)[1])}px);opacity:calc(var(--a) * ${r3(fade(s))})`,
      lottie: {
        p: (s) => at(s).map(r1),
        o: (s) => r1(a.alpha * fade(s) * 100),
      },
    };
  },
  scan: (a) => ({
    n: 1,
    disc: true,
    css: `scan-${Math.round(a.dy)}`,
    cssFrame: (s) => `transform:translate(0,${r1(s * a.dy)}px)`,
    lottie: { p: (s) => [0, r1(s * a.dy)] },
  }),
  breathe: (a) => ({
    n: 8,
    disc: false,
    css: `breathe-${a.P}`,
    cssFrame: (s) => `transform:scale(${r3(1 + a.amt * Math.sin(Math.PI * s) ** 2)})`,
    lottie: {
      s: (s) => {
        const v = r1((1 + a.amt * Math.sin(Math.PI * s) ** 2) * 100);
        return [v, v];
      },
    },
  }),
};
const phaseOf = (a) => (((a.phase ?? 0) % a.P) + a.P) % a.P;

/** Lottie keyframes for one property over the loop; values before the loop hold the first one. */
function lottieKeys(a, fn) {
  const tr = TRACKS[a.kind](a);
  const step = a.P / tr.n;
  const phase = phaseOf(a);
  const times = new Set([0, LOOP]);
  for (let t = phase % step; t <= LOOP + 1e-6; t += step) times.add(r3(t));
  const keys = [];
  for (const t of [...times].sort((x, y) => x - y)) {
    let cyc = (((t - phase) % a.P) + a.P) % a.P;
    if (a.P - cyc < 1e-3) cyc = 0;
    if (tr.disc && cyc === 0 && t > 0) keys.push([t - 0.01, fn(1)]);
    keys.push([t, fn(cyc / a.P)]);
  }
  return {
    a: 1,
    k: keys.map(([t, v], i) => {
      const key = { t: r3(t + INTRO), s: Array.isArray(v) ? v : [v] };
      if (i < keys.length - 1) Object.assign(key, { o: { x: 0, y: 0 }, i: { x: 1, y: 1 } });
      return key;
    }),
  };
}

// ---------- SVG ----------

function svgDoc(T, layers, { animated }) {
  const defs = [];
  const keyframes = new Map();
  let uid = 0;

  const paint = (f) => {
    if (typeof f === "string") return f;
    const id = `g${uid++}`;
    const stops = f.stops
      .map(
        ([o, c, a]) =>
          `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${r3(a)}"` : ""}/>`,
      )
      .join("");
    defs.push(
      f.lin
        ? `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r1(f.lin[0][0])}" y1="${r1(f.lin[0][1])}" x2="${r1(f.lin[1][0])}" y2="${r1(f.lin[1][1])}">${stops}</linearGradient>`
        : `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${r1(f.rad[0][0])}" cy="${r1(f.rad[0][1])}" r="${r1(f.rad[1])}">${stops}</radialGradient>`,
    );
    return `url(#${id})`;
  };
  const style = (it) => {
    let s = it.fill ? ` fill="${paint(it.fill)}"` : ` fill="none"`;
    if (it.stroke) {
      s += ` stroke="${paint(it.stroke.c)}" stroke-width="${it.stroke.w}"`;
      if (it.stroke.o < 1) s += ` stroke-opacity="${r3(it.stroke.o)}"`;
      s += ` stroke-linejoin="round"`;
    }
    if (it.o < 1) s += ` opacity="${r3(it.o)}"`;
    return s;
  };
  const d = (it) => {
    if (it.t === "poly")
      return `M${it.pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L")}${it.open ? "" : "Z"}`;
    return it.contours
      .map(({ v, i, o }) => {
        let s = `M${r1(v[0][0])} ${r1(v[0][1])}`;
        const n = v.length;
        const segs = it.open ? n - 1 : n;
        for (let k = 0; k < segs; k++) {
          const a = v[k];
          const b = v[(k + 1) % n];
          const c1 = [a[0] + o[k][0], a[1] + o[k][1]];
          const c2 = [b[0] + i[(k + 1) % n][0], b[1] + i[(k + 1) % n][1]];
          s +=
            o[k][0] || o[k][1] || i[(k + 1) % n][0] || i[(k + 1) % n][1]
              ? `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(b[0])} ${r1(b[1])}`
              : `L${r1(b[0])} ${r1(b[1])}`;
        }
        return it.open ? s : s + "Z";
      })
      .join("");
  };

  const animAttrs = (a) => {
    const tr = TRACKS[a.kind](a);
    if (!keyframes.has(tr.css)) {
      const frames = Array.from(
        { length: tr.n + 1 },
        (_, j) => `${r3((j / tr.n) * 100)}%{${tr.cssFrame(j / tr.n)}}`,
      );
      keyframes.set(
        tr.css,
        `.${tr.css}{animation:${tr.css} ${a.P / FPS}s linear infinite both}@keyframes ${tr.css}{${frames.join("")}}`,
      );
    }
    // start one period early so loop time 0 lands at the right point of the cycle
    const delay = r3((INTRO + phaseOf(a) - a.P) / FPS);
    const vars =
      a.kind === "pulse"
        ? `--b:${r3(a.base)};--a:${r3(a.amp)};`
        : a.kind === "flow"
          ? `--a:${a.alpha};`
          : a.kind === "breathe"
            ? `transform-origin:${a.origin[0]}px ${a.origin[1]}px;`
            : "";
    return ` class="${tr.css}" style="${vars}animation-delay:${delay}s"`;
  };

  // static state = loop time 0 (matches Lottie frame 45)
  const staticFlow = (a) => {
    const s = ((((0 - phaseOf(a)) % a.P) + a.P) % a.P) / a.P;
    const pt = a.pts[Math.round(s * 12)];
    return { pt, o: a.alpha * fade(Math.round(s * 12) / 12) };
  };

  const node = (it) => {
    if (it.t === "group") {
      const a = it.anim;
      if (a?.kind === "flow") {
        const { pt, o } = staticFlow(a);
        const c = it.items[0];
        return `<circle r="${r1(c.r)}" fill="${c.fill}" transform="translate(${r1(pt[0])} ${r1(pt[1])})"${o < 1 ? ` opacity="${r3(o)}"` : ""}${animated ? animAttrs(a) : ""}/>`;
      }
      const inner = it.items.map(node).join("");
      if (a?.kind === "pulse") {
        if (!animated && a.base === 0) return "";
        return `<g opacity="${r3(a.base)}"${animated ? animAttrs(a) : ""}>${inner}</g>`;
      }
      return `<g${a && animated ? animAttrs(a) : ""}>${inner}</g>`;
    }
    if (it.t === "circle")
      return `<circle cx="${r1(it.x)}" cy="${r1(it.y)}" r="${r1(it.r)}"${style(it)}/>`;
    return `<path d="${d(it)}"${style(it)}/>`;
  };

  const body = layers
    .map((l, li) => {
      let inner = l.photo
        ? `<image href="${l.photo.data}" x="${l.photo.x}" y="${l.photo.y}" width="${l.photo.w}" height="${l.photo.h}" preserveAspectRatio="none"/>`
        : l.items.map(node).join("");
      if (l.clip) {
        defs.push(
          `<clipPath id="clip${li}"><path d="${d({ t: "poly", pts: l.clip })}"/></clipPath>`,
        );
        inner = `<g clip-path="url(#clip${li})">${inner}</g>`;
      }
      const intro = animated ? ` class="in" style="animation-delay:${r3(l.start / FPS)}s"` : "";
      return `<g id="${l.name}"${intro}>${inner}</g>`;
    })
    .join("\n");

  const css = animated
    ? `<style>.in{animation:in ${IN_DUR / FPS}s cubic-bezier(${EASE_OUT_EXPO.join(",")}) both}@keyframes in{from{opacity:0;transform:translateX(-60px)}}${[...keyframes.values()].join("")}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">Image → Visual Tokens → Reasoning → Intelligent Output</title>
<desc id="d">An image is split into patches, encoded as visual tokens, reasoned over, and turned into an intelligent output.</desc>
${css}<defs>${defs.join("")}</defs>
<rect width="${W}" height="${H}" fill="${T.bg}"/>
${body}
</svg>
`;
}

// ---------- Lottie (bodymovin 5.x: shape layers + the embedded photo as an image layer) ----------

const lc = (hex) => [...rgb(hex).map((v) => r3(v / 255)), 1];
const st = (k) => ({ a: 0, k });
const trIdentity = () => ({
  ty: "tr",
  p: st([0, 0]),
  a: st([0, 0]),
  s: st([100, 100]),
  r: st(0),
  o: st(100),
  sk: st(0),
  sa: st(0),
});

function lottiePaint(f, o, stroke) {
  if (typeof f === "string") {
    return stroke
      ? { ty: "st", c: st(lc(f)), o: st(r1(o * 100)), w: st(stroke.w), lc: 2, lj: 2, ml: 4, bm: 0 }
      : { ty: "fl", c: st(lc(f)), o: st(r1(o * 100)), r: 1, bm: 0 };
  }
  const colors = f.stops.flatMap(([off, c]) => [off, ...lc(c).slice(0, 3)]);
  const alphas = f.stops.flatMap(([off, , a]) => [off, r3(a)]);
  const geo = f.lin
    ? { t: 1, s: st(f.lin[0].map(r1)), e: st(f.lin[1].map(r1)) }
    : {
        t: 2,
        s: st(f.rad[0].map(r1)),
        e: st([r1(f.rad[0][0] + f.rad[1]), r1(f.rad[0][1])]),
        h: st(0),
        a: st(0),
      };
  const base = {
    o: st(r1(o * 100)),
    g: { p: f.stops.length, k: st([...colors, ...alphas]) },
    ...geo,
    bm: 0,
  };
  return stroke
    ? { ty: "gs", ...base, w: st(stroke.w), lc: 2, lj: 2, ml: 4 }
    : { ty: "gf", ...base, r: 1 };
}

function lottieShape(it) {
  if (it.t === "circle")
    return { ty: "el", p: st([r1(it.x), r1(it.y)]), s: st([r1(it.r * 2), r1(it.r * 2)]), d: 1 };
  const contours =
    it.t === "poly"
      ? [{ v: it.pts, i: it.pts.map(() => [0, 0]), o: it.pts.map(() => [0, 0]) }]
      : it.contours;
  return contours.map((c) => ({
    ty: "sh",
    ks: st({
      c: !it.open,
      v: c.v.map((p) => p.map(r1)),
      i: c.i.map((p) => p.map(r1)),
      o: c.o.map((p) => p.map(r1)),
    }),
  }));
}

function lottieItem(it, fillOpacity = it.o) {
  if (it.t === "group") {
    const a = it.anim;
    const tr = trIdentity();
    const children = it.items;
    if (a) {
      const fns = TRACKS[a.kind](a).lottie;
      for (const [prop, fn] of Object.entries(fns)) tr[prop] = lottieKeys(a, fn);
      if (a.kind === "breathe") {
        tr.a = st(a.origin);
        tr.p = st(a.origin);
      }
    }
    return {
      ty: "gr",
      it: [
        ...children
          .slice()
          .reverse()
          .map((c) => lottieItem(c)),
        tr,
      ],
      bm: 0,
    };
  }
  const shapes = [lottieShape(it)].flat();
  const styles = [];
  if (it.stroke) styles.push(lottiePaint(it.stroke.c, it.stroke.o * it.o, it.stroke));
  if (it.fill) styles.push(lottiePaint(it.fill, fillOpacity));
  return { ty: "gr", it: [...shapes, ...styles, trIdentity()], bm: 0 };
}

function lottieDoc(name, T, layers) {
  const introKeys = (start, from, to) => ({
    a: 1,
    k: [
      {
        t: start,
        s: from,
        o: { x: EASE_OUT_EXPO[0], y: EASE_OUT_EXPO[1] },
        i: { x: EASE_OUT_EXPO[2], y: EASE_OUT_EXPO[3] },
      },
      { t: start + IN_DUR, s: to },
    ],
  });
  const assets = [];
  const out = layers.map((l, idx) => {
    // image layers live in their own pixel space: placed by position + scale, masked in pixels
    const ph = l.photo;
    const k = ph ? ph.px[0] / ph.w : 1;
    const [ox, oy] = ph ? [ph.x, ph.y] : [0, 0];
    const clip = l.clip?.map(([x, y]) => [r1((x - ox) * k), r1((y - oy) * k)]);
    if (ph) assets.push({ id: l.name, w: ph.px[0], h: ph.px[1], u: "", p: ph.data, e: 1 });
    return {
      ddd: 0,
      ind: idx + 1,
      ty: ph ? 2 : 4,
      ...(ph && { refId: l.name }),
      nm: l.name,
      sr: 1,
      ks: {
        o: introKeys(l.start, [0], [100]),
        r: st(0),
        p: introKeys(l.start, [ox - 60, oy, 0], [ox, oy, 0]),
        a: st([0, 0, 0]),
        s: st([r3(100 / k), r3(100 / k), 100]),
      },
      ao: 0,
      ...(clip && {
        hasMask: true,
        masksProperties: [
          {
            inv: false,
            mode: "a",
            pt: st({
              c: true,
              v: clip,
              i: clip.map(() => [0, 0]),
              o: clip.map(() => [0, 0]),
            }),
            o: st(100),
            x: st(0),
            nm: "clip",
          },
        ],
      }),
      ...(!ph && {
        shapes: [
          {
            ty: "gr",
            nm: l.name,
            it: [
              ...l.items
                .slice()
                .reverse()
                .map((c) => lottieItem(c)),
              trIdentity(),
            ],
            bm: 0,
          },
        ],
      }),
      ip: 0,
      op: END,
      st: 0,
      bm: 0,
    };
  });
  return {
    v: "5.12.2",
    fr: FPS,
    ip: 0,
    op: END,
    w: W,
    h: H,
    nm: name,
    ddd: 0,
    assets,
    // top layer first; background as the last (bottom) layer
    layers: [
      ...out.reverse().map((l, i) => ({ ...l, ind: i + 1 })),
      {
        ddd: 0,
        ind: out.length + 1,
        ty: 4,
        nm: "background",
        sr: 1,
        ks: { o: st(100), r: st(0), p: st([0, 0, 0]), a: st([0, 0, 0]), s: st([100, 100, 100]) },
        ao: 0,
        shapes: [lottieItem(poly(rect(0, 0, W, H), T.bg))],
        ip: 0,
        op: END,
        st: 0,
        bm: 0,
      },
    ],
    markers: [
      { tm: 0, cm: "intro", dr: INTRO },
      { tm: INTRO, cm: "loop", dr: LOOP },
    ],
  };
}

// ---------- write ----------

mkdirSync(OUT, { recursive: true });
for (const [theme, T] of Object.entries(THEMES)) {
  const layers = buildLayers(T);
  const files = {
    [`pipeline-${theme}.svg`]: svgDoc(T, layers, { animated: false }),
    [`pipeline-${theme}-animated.svg`]: svgDoc(T, layers, { animated: true }),
    [`pipeline-${theme}.json`]: JSON.stringify(lottieDoc(`pipeline-${theme}`, T, layers)),
  };
  for (const [file, data] of Object.entries(files)) {
    writeFileSync(join(OUT, file), data);
    console.log(`${file.padEnd(32)} ${(Buffer.byteLength(data) / 1024).toFixed(0)} KB`);
  }
}
