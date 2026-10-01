"use client";

import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/random";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  createParticles,
  drawDynamic,
  drawStatic,
  hexToRgb,
  inkColors,
  mix,
  rgba,
  VH,
  VW,
  type Palette,
  type RGB,
  type Tile,
} from "./hero-scene";

const REVEAL_MS = 1400;

function readPalette(): Palette {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const token = (name: string) => hexToRgb(css.getPropertyValue(name));
  return {
    dark: root.classList.contains("dark"),
    bg: token("--background"),
    fg: token("--foreground"),
    blue: token("--spectrum-start"),
    violet: token("--spectrum-end"),
    cyan: token("--signal"),
  };
}

/** Soft round glow sprite per ink colour (dark theme; drawn additively). */
function makeSprite(c: RGB, white: RGB) {
  const s = document.createElement("canvas");
  s.width = s.height = 32;
  const x = s.getContext("2d");
  if (!x) return s;
  const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, rgba(mix(c, white, 0.55), 1));
  g.addColorStop(0.16, rgba(c, 0.95));
  g.addColorStop(0.38, rgba(c, 0.3));
  g.addColorStop(1, rgba(c, 0));
  x.fillStyle = g;
  x.fillRect(0, 0, 32, 32);
  return s;
}

/**
 * Hero canvas (CLAUDE.md §8, §10): static glass panels + photo + token tiles are rendered once per
 * size / theme into an offscreen layer (with a blur bloom in dark mode); a rAF loop adds the moving
 * parts on top. Starts after the first-load intro, reveals left → right, pauses offscreen, drops to
 * 30 fps and half the particles on small screens, and renders one still frame under reduced motion.
 */
export function HeroCanvas({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let pal = readPalette();
    let img: HTMLImageElement | null = null;
    let layer: HTMLCanvasElement | null = null;
    let twinkles: Tile[] = [];
    let sprites: HTMLCanvasElement[] = [];
    let inks: string[] = [];
    let small = false;
    let parts = createParticles(mulberry32(5), 1);
    let scale = 1;
    let raf = 0;
    let visible = false;
    let last = 0;
    let t0 = -1;

    const introPlaying = () => !!document.documentElement.dataset.intro;

    const build = () => {
      if (!img) return;
      const width = wrap.clientWidth;
      if (!width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round((width * dpr * VH) / VW);
      scale = canvas.width / VW;

      const nextSmall = width < 640;
      if (nextSmall !== small) {
        small = nextSmall;
        parts = createParticles(mulberry32(5), small ? 0.5 : 1);
      }

      layer = document.createElement("canvas");
      layer.width = canvas.width;
      layer.height = canvas.height;
      const l = layer.getContext("2d");
      if (!l) return;
      l.setTransform(scale, 0, 0, scale, 0, 0);
      twinkles = drawStatic(l, img, pal, mulberry32(9));

      // Bloom: a blurred copy added on top (dark only; skipped where canvas filters are unsupported).
      if (pal.dark && typeof l.filter === "string") {
        const b = document.createElement("canvas");
        b.width = layer.width;
        b.height = layer.height;
        const bx = b.getContext("2d");
        if (bx) {
          bx.filter = `blur(${Math.round(7 * scale)}px)`;
          bx.drawImage(layer, 0, 0);
          l.setTransform(1, 0, 0, 1, 0, 0);
          l.globalCompositeOperation = "lighter";
          l.globalAlpha = 0.55;
          l.drawImage(b, 0, 0);
          l.globalAlpha = 1;
          l.globalCompositeOperation = "source-over";
        }
      }

      const colors = inkColors(pal);
      sprites = pal.dark ? colors.map((c) => makeSprite(c, pal.fg)) : [];
      inks = colors.map((c) => rgba(c, 1));
    };

    const dot = (x: number, y: number, r: number, ink: number, alpha: number) => {
      if (alpha <= 0.01) return;
      ctx.globalAlpha = Math.min(1, alpha);
      if (pal.dark) {
        const s = r * 5;
        ctx.drawImage(sprites[ink], x - s / 2, y - s / 2, s, s);
      } else {
        ctx.fillStyle = inks[ink];
        ctx.fillRect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6);
      }
    };

    const render = (now: number) => {
      if (!layer) return;
      if (t0 < 0) {
        if (!reduce && introPlaying()) return;
        t0 = now;
      }
      const p = reduce ? 1 : Math.min(1, (now - t0) / REVEAL_MS);
      const reveal = 1 - Math.pow(1 - p, 4);
      const t = reduce ? 6 : 2 + (now - t0) / 1000;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = Math.max(1, Math.round(canvas.width * reveal));
      ctx.drawImage(layer, 0, 0, w, canvas.height, 0, 0, w, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      drawDynamic(ctx, t, Math.min(1, Math.max(0, p * 1.6 - 0.6)), pal, twinkles, parts, dot);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (small && now - last < 32) return;
      last = now;
      render(now);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) render(performance.now());
      else if (visible) raf = requestAnimationFrame(loop);
    };

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      img = image;
      build();
      start();
    };
    image.src = src;

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) render(performance.now());
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(wrap);

    // Theme switch → re-read tokens and rebuild the static layer.
    const mo = new MutationObserver(() => {
      const next = readPalette();
      if (next.dark === pal.dark && next.blue.join() === pal.blue.join()) return;
      pal = next;
      build();
      if (reduce) render(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      image.onload = null;
    };
  }, [reduce, src]);

  return (
    <div ref={wrapRef} className="relative aspect-[1000/440] w-full">
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
