"use client";

import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useInView } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Tag } from "@/components/ui/tag";
import type { ResearchItem } from "@/content/research";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ResearchField } from "./research-field";
import { StatusBadge } from "./status-badge";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Homepage Research Lab body: three research lines in hairline columns + the patch-field schematic
 * and a 01/03 pager. The active line auto-advances while in view; any hover, focus or pager press
 * pins it. Static under reduced motion.
 */
export function ResearchLab({ items }: { items: ResearchItem[] }) {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const count = items.length;

  useEffect(() => {
    if (reduce || pinned || !inView) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), 5000);
    return () => clearInterval(t);
  }, [reduce, pinned, inView, count]);

  const select = (i: number) => {
    setActive((i + count) % count);
    setPinned(true);
  };

  const current = items[active];

  return (
    <div ref={ref} className="grid gap-12 xl:grid-cols-12 xl:gap-8">
      <ol className="grid sm:grid-cols-3 xl:col-span-7">
        {items.map((item, i) => (
          <li
            key={item.slug}
            onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
            onFocus={() => select(i)}
            className="relative flex flex-col border-t py-6 sm:border-t-0 sm:border-l sm:px-5 sm:py-1 sm:first:border-l-0 sm:first:pl-0"
          >
            <span
              aria-hidden
              className={cn(
                "bg-spectrum absolute top-0 left-0 h-0.5 w-10 transition-opacity duration-300 sm:-top-4",
                i > 0 && "sm:left-5",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
            <div className="flex items-center justify-between gap-3">
              <span className="label-mono text-foreground/40">{pad(i + 1)}</span>
              <StatusBadge status={item.status} />
            </div>
            <h3
              className={cn(
                "mt-5 font-display text-lg font-semibold tracking-tight transition-colors",
                i === active ? "text-foreground" : "text-foreground/75",
              )}
            >
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Topics">
              {item.tags.slice(0, 3).map((tag) => (
                <li key={tag}>
                  <Tag variant="chip">{tag}</Tag>
                </li>
              ))}
            </ul>
            <Link
              href={`/research#${item.slug}`}
              className="group mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-6 text-sm font-medium transition-colors hover:text-accent"
            >
              Read notes<span className="sr-only">: {item.title}</span>
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ol>

      <figure className="flex items-start gap-4 xl:col-span-5">
        <div className="min-w-0 flex-1">
          <ResearchField mode={active} className="max-w-md xl:max-w-none" />
          <figcaption className="mt-5 border-t pt-4" aria-live={pinned ? "polite" : "off"}>
            <span className="label-mono text-muted-foreground">
              R/{pad(active + 1)} · {current.title} · Schematic
            </span>
            <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
              {current.schematic}
            </span>
          </figcaption>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => select(active - 1)}
            aria-label="Previous research line"
            className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronUp aria-hidden className="size-4" />
          </button>
          <span className="label-mono py-1 text-muted-foreground tabular-nums [writing-mode:vertical-rl]">
            <span className="text-foreground">{pad(active + 1)}</span> / {pad(count)}
          </span>
          <button
            type="button"
            onClick={() => select(active + 1)}
            aria-label="Next research line"
            className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown aria-hidden className="size-4" />
          </button>
        </div>
      </figure>
    </div>
  );
}
