/**
 * Copy for the homepage research visualization. The figure is a SCHEMATIC of the ideas behind
 * the research lines in `research.ts` — token counts come from the diagram's own grid,
 * never from experiments (CLAUDE.md §16).
 */

/** How the adaptive side acquires the image in a given scenario. */
export type Acquisition =
  | "coarse" // whole image at low resolution
  | "fine" // whole image at full resolution
  | "regions" // low-res global view + full-res crops of selected regions
  | "encode" // encode once and store
  | "reuse"; // answer from stored visual tokens

export type VizScenario = { query: string; acquisition: Acquisition; note: string };

export type VizTab = {
  id: string;
  /** Matches a `research.ts` slug. */
  researchSlug: string;
  label: string;
  idea: string;
  /** Token counts accumulate across scenarios (multiple questions on one image). */
  cumulative?: boolean;
  scenarios: VizScenario[];
};

export const vizTabs: VizTab[] = [
  {
    id: "routing",
    researchSlug: "resroute-vlm",
    label: "Resolution routing",
    idea: "Choose the initial resolution per question instead of always encoding at full detail.",
    scenarios: [
      {
        query: "Is there an object in the scene?",
        acquisition: "coarse",
        note: "A coarse view is enough, so the router starts low.",
      },
      {
        query: "What does the small label say?",
        acquisition: "fine",
        note: "Fine detail is needed, so the router escalates to full resolution.",
      },
    ],
  },
  {
    id: "regions",
    researchSlug: "multicrop-vlm",
    label: "Multi-region acquisition",
    idea: "Keep a cheap global view and acquire full detail only for the regions that matter.",
    scenarios: [
      {
        query: "How do the two highlighted objects differ?",
        acquisition: "regions",
        note: "Global context at low resolution, plus two full-resolution crops.",
      },
    ],
  },
  {
    id: "amortized",
    researchSlug: "amortized-vision",
    label: "Amortized vision",
    idea: "Encode an image once and reuse its visual tokens across follow-up questions.",
    cumulative: true,
    scenarios: [
      {
        query: "Q1 · What is in the image?",
        acquisition: "encode",
        note: "First question: the image is encoded and its tokens are kept.",
      },
      {
        query: "Q2 · Where is the larger object?",
        acquisition: "reuse",
        note: "Follow-up: answered from stored tokens, with no re-encoding.",
      },
      {
        query: "Q3 · Are the objects touching?",
        acquisition: "reuse",
        note: "Cost stays flat while a fixed pipeline re-encodes every time.",
      },
    ],
  },
];
