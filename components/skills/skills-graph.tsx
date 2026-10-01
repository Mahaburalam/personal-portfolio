"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type GraphNode = {
  id: string;
  /** Grid placement (xl 12-col layout lives in skills-ecosystem.tsx). */
  className: string;
  /** Server-rendered card. */
  content: ReactNode;
};

type SkillsGraphProps = {
  nodes: GraphNode[];
  links: [string, string][];
};

type Box = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

const XL = "(min-width: 1280px)";
/** Corner cut of each trace bend — the circuit-board look. */
const CHAMFER = 12;

function subscribeXl(onChange: () => void) {
  const mq = matchMedia(XL);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Traces only on xl; hydration-safe (server and first client render: false). */
function useIsXl() {
  return useSyncExternalStore(
    subscribeXl,
    () => matchMedia(XL).matches,
    () => false,
  );
}

/** Box relative to `root`, from offsets so entry / hover transforms don't skew it. */
function boxOf(el: HTMLElement, root: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/**
 * Orthogonal trace with 45° chamfers. Below → bottom-center down to the gap, across, down to
 * the target's top-center (shared centers give the ┌─┴─┐ branching). Same row → straight across.
 */
function route(a: Box, b: Box): { d: string; from: Point; to: Point } {
  if (b.y >= a.y + a.h - 1) {
    const from = { x: a.x + a.w / 2, y: a.y + a.h };
    const to = { x: b.x + b.w / 2, y: b.y };
    const dx = to.x - from.x;
    const midY = (from.y + to.y) / 2;
    const c = Math.min(CHAMFER, Math.abs(dx) / 2, (to.y - from.y) / 2);
    if (Math.abs(dx) < 1) return { d: `M${from.x} ${from.y}V${to.y}`, from, to };
    const s = Math.sign(dx);
    return {
      d: `M${from.x} ${from.y}V${midY - c}L${from.x + s * c} ${midY}H${to.x - s * c}L${to.x} ${midY + c}V${to.y}`,
      from,
      to,
    };
  }
  const y = (Math.max(a.y, b.y) + Math.min(a.y + a.h, b.y + b.h)) / 2;
  const [left, right] = a.x < b.x ? [a, b] : [b, a];
  const from = { x: left.x + left.w, y };
  const to = { x: right.x, y };
  return { d: `M${from.x} ${y}H${to.x}`, from, to };
}

/**
 * Skill ecosystem (CLAUDE.md §10 "Skills graph"): cards in a grid, connected on xl by an
 * aria-hidden SVG trace layer. Hover / focus / tap activates a card: it lifts, its traces and
 * chips light up, related cards get a firmer border and unrelated ones dim (xl). Animation is
 * CSS gated by `data-skills` (globals.css); none under reduced motion or without JS.
 */
export function SkillsGraph({ nodes, links }: SkillsGraphProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shells = useRef(new Map<string, HTMLDivElement>());
  const [active, setActive] = useState<string | null>(null);
  const [layout, setLayout] = useState<{ w: number; h: number; boxes: Record<string, Box> }>();
  const reduce = useReducedMotion();
  const isXl = useIsXl();

  const neighbours = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const [a, b] of links) {
      if (!map.has(a)) map.set(a, new Set());
      if (!map.has(b)) map.set(b, new Set());
      map.get(a)!.add(b);
      map.get(b)!.add(a);
    }
    return map;
  }, [links]);

  // Measure card boxes on xl; the root's size changes whenever any card reflows.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isXl) return;
    const measure = () => {
      const boxes: Record<string, Box> = {};
      for (const [id, el] of shells.current) boxes[id] = boxOf(el, root);
      setLayout({ w: root.offsetWidth, h: root.offsetHeight, boxes });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [isXl]);

  // armed → play once in view; pause the looping pulses whenever offscreen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduce) {
      delete root.dataset.skills;
      delete root.dataset.skillsPaused;
      return;
    }
    root.dataset.skills = "armed";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.dataset.skills = "play";
          delete root.dataset.skillsPaused;
        } else {
          root.dataset.skillsPaused = "";
        }
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduce]);

  const traces = useMemo(() => {
    if (!layout) return [];
    return links.flatMap(([a, b]) => {
      const boxA = layout.boxes[a];
      const boxB = layout.boxes[b];
      return boxA && boxB ? [{ id: `${a}->${b}`, a, b, ...route(boxA, boxB) }] : [];
    });
  }, [layout, links]);

  // One ring per distinct endpoint (branches share their trunk ends).
  const ports = useMemo(() => {
    const map = new Map<string, Point & { ids: Set<string> }>();
    for (const t of traces) {
      for (const p of [t.from, t.to]) {
        const key = `${Math.round(p.x)}:${Math.round(p.y)}`;
        const port = map.get(key) ?? { ...p, ids: new Set<string>() };
        port.ids.add(t.a).add(t.b);
        map.set(key, port);
      }
    }
    return [...map.entries()];
  }, [traces]);

  const setShell = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) shells.current.set(id, el);
      else shells.current.delete(id);
    },
    [],
  );

  const release = (id: string) => setActive((current) => (current === id ? null : current));
  const touches = (a: string, b: string) => active !== null && (a === active || b === active);

  return (
    <div
      ref={rootRef}
      className="relative max-md:pl-5 max-md:before:absolute max-md:before:inset-y-0 max-md:before:left-[5px] max-md:before:border-l max-md:before:border-dashed"
    >
      <Stagger
        as="ol"
        className="grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-12 xl:gap-x-10 xl:gap-y-16"
      >
        {nodes.map((node) => {
          const isActive = active === node.id;
          const related = active !== null && !isActive && !!neighbours.get(active)?.has(node.id);
          return (
            <StaggerItem as="li" key={node.id} className={node.className}>
              <div
                ref={setShell(node.id)}
                data-active={isActive || undefined}
                data-related={related || undefined}
                data-dim={(active !== null && !isActive && !related) || undefined}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(node.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && release(node.id)}
                onFocus={() => setActive(node.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) release(node.id);
                }}
                className={cn(
                  "group/card relative h-full transition-opacity duration-300 ease-out-expo xl:data-[dim=true]:opacity-55",
                  // Mobile spine port, centered on the dashed line
                  "max-md:before:absolute max-md:before:top-8 max-md:before:-left-5 max-md:before:size-2.5 max-md:before:rounded-full max-md:before:border max-md:before:border-foreground/40 max-md:before:bg-background",
                )}
              >
                {node.content}
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {isXl && layout && (
        <svg
          aria-hidden
          width={layout.w}
          height={layout.h}
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          className="pointer-events-none absolute inset-0 z-10 overflow-visible"
          fill="none"
        >
          {traces.map((t, i) => {
            const lit = touches(t.a, t.b);
            return (
              <g
                key={t.id}
                className={cn(
                  "transition-opacity duration-300",
                  active !== null && !lit && "opacity-40",
                )}
              >
                <path
                  d={t.d}
                  pathLength={1}
                  strokeWidth={1.5}
                  style={{ "--i": i } as CSSProperties}
                  className={cn(
                    "skills-trace transition-[stroke] duration-300",
                    lit ? "stroke-accent" : "stroke-foreground/20",
                  )}
                />
                <path
                  d={t.d}
                  pathLength={1}
                  strokeWidth={2}
                  strokeLinecap="round"
                  style={
                    {
                      "--dur": `${3.2 + (i % 4) * 0.7}s`,
                      "--delay": `${(i * 0.53) % 2.4}s`,
                    } as CSSProperties
                  }
                  className="skills-pulse stroke-signal opacity-70"
                />
              </g>
            );
          })}
          {ports.map(([key, p], i) => (
            <circle
              key={key}
              cx={p.x}
              cy={p.y}
              r={4}
              strokeWidth={1.5}
              style={{ "--i": i } as CSSProperties}
              className={cn(
                "skills-node fill-background transition-[stroke] duration-300",
                active !== null && p.ids.has(active) ? "stroke-accent" : "stroke-foreground/35",
              )}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
