export type ResearchStatus =
  "idea" | "concept" | "experiment" | "ongoing" | "preprint" | "submitted" | "published";

export type ResearchItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Must be accurate — never upgrade without confirmation. CLAUDE.md §16 */
  status: ResearchStatus;
  /** One-line description of the homepage Research Lab schematic for this line (not a result). */
  schematic: string;
};

export const research: ResearchItem[] = [
  {
    slug: "resroute-vlm",
    title: "ResRoute-VLM",
    summary: "Dynamic Initial Resolution Routing for Efficient Vision-Language Models.",
    tags: ["VLM", "Computer Vision", "Efficient AI", "Adaptive Computing"],
    status: "ongoing",
    schematic: "Resolution routed per patch: fine where it matters, coarse elsewhere.",
  },
  {
    slug: "multicrop-vlm",
    title: "MultiCrop-VLM",
    summary: "Adaptive Multi-Region Visual Acquisition for Visual Reasoning.",
    tags: ["VLM", "Visual Reasoning", "Efficiency"],
    status: "ongoing",
    schematic: "A coarse global view, plus high-resolution crops of the regions a question needs.",
  },
  {
    slug: "amortized-vision",
    title: "Amortized Vision",
    summary: "Persistent Visual Information Across Multiple Questions.",
    tags: ["VLM", "Visual Memory", "Efficiency"],
    status: "ongoing",
    schematic: "Encoded patches persist and are reused across follow-up questions.",
  },
];
