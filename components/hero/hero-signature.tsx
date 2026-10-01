import { Fragment } from "react";
import { heroStages, heroVisual } from "@/content/hero";
import { HeroCanvas } from "./hero-canvas";
import { stageCenters } from "./hero-scene";

/**
 * Hero visual signature (CLAUDE.md §8): IMAGE → VISUAL TOKENS → REASONING → INTELLIGENT OUTPUT.
 * The canvas is decorative; the figcaption is its text equivalent and stays readable without JS.
 */
export function HeroSignature() {
  const arrows = stageCenters.slice(1).map((x, i) => (x + stageCenters[i]) / 2);

  return (
    <figure className="max-sm:rounded-lg max-sm:border max-sm:bg-card max-sm:px-2 max-sm:pt-4 max-sm:pb-3">
      <HeroCanvas src={heroVisual.image} />
      <figcaption className="relative mt-3 sm:mt-5 sm:h-5">
        <span className="sr-only">
          Diagram: an image is split into patches, encoded as visual tokens, reasoned over, and
          turned into an intelligent output.
        </span>
        {/* Mobile: a plain row. sm+: each caption sits under its stage. */}
        <span
          aria-hidden
          className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground sm:block sm:text-xs"
        >
          {heroStages.map((stage, i) => (
            <Fragment key={stage}>
              {i > 0 && (
                <span
                  className="text-foreground/30 sm:absolute sm:top-0 sm:-translate-x-1/2"
                  style={{ left: `${arrows[i - 1] * 100}%` }}
                >
                  →
                </span>
              )}
              <span
                className="whitespace-nowrap sm:absolute sm:top-0 sm:-translate-x-1/2"
                style={{ left: `${stageCenters[i] * 100}%` }}
              >
                {stage}
              </span>
            </Fragment>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
