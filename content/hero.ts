import { profile } from "@/lib/site";

/** Hero headline: `profile.statement` with the emphasised word split out for `.text-spectrum`. */
export const heroHeadline = {
  lead: "From ideas to",
  emphasis: "intelligent",
  tail: "systems.",
} as const;

/** Hero labels row: the profile labels plus the engineering foundation (CLAUDE.md §8). */
export const heroLabels = [...profile.labels, "Software Engineering"];

/** Pipeline stages under the hero visual — also the visual's text equivalent. */
export const heroStages = ["Image", "Visual Tokens", "Reasoning", "Intelligent Output"] as const;

export const heroVisual: {
  /**
   * TODO(content): optional photo for the first panel (e.g. `/hero/scene.jpg` in public/).
   * `null` → a procedural SVG street scene drawn in theme tokens.
   */
  image: string | null;
} = { image: null };
