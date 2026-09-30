export type ResearchStatus =
  "idea" | "concept" | "experiment" | "ongoing" | "preprint" | "submitted" | "published";

export type ResearchItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Must be accurate — never upgrade without confirmation. CLAUDE.md §16 */
  status: ResearchStatus;
};

export const research: ResearchItem[] = [
  {
    slug: "resroute-vlm",
    title: "ResRoute-VLM",
    summary: "Dynamic Initial Resolution Routing for Efficient Vision-Language Models.",
    tags: ["VLM", "Computer Vision", "Efficient AI", "Adaptive Computing"],
    status: "ongoing",
  },
  {
    slug: "multicrop-vlm",
    title: "MultiCrop-VLM",
    summary: "Adaptive Multi-Region Visual Acquisition for Visual Reasoning.",
    tags: ["VLM", "Visual Reasoning", "Efficiency"],
    status: "ongoing",
  },
  {
    slug: "amortized-vision",
    title: "Amortized Vision",
    summary: "Persistent Visual Information Across Multiple Questions.",
    tags: ["VLM", "Visual Memory", "Efficiency"],
    status: "ongoing",
  },
];
