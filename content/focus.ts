/**
 * Homepage "Currently exploring" row (CLAUDE.md §8) — owner-provided focus areas. These are
 * directions and interests, worded as such; never results or expertise claims (§16).
 */
export type FocusArea = { label: string; line: string };

export const focusCopy = {
  label: "Currently exploring",
  title: "Where I'm focusing next.",
} as const;

export const focusAreas: FocusArea[] = [
  { label: "Efficient VLMs", line: "Reducing visual computation while preserving reasoning." },
  { label: "Multimodal AI", line: "Combining vision, language and context." },
  { label: "Visual Reasoning", line: "Better spatial and temporal understanding." },
  { label: "Computer Vision", line: "From detection to understanding." },
  { label: "Edge AI", line: "On-device intelligent systems." },
  { label: "AI Agents", line: "Autonomous systems for real-world tasks." },
];
