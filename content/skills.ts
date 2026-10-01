export type SkillGroup = {
  slug: string;
  /** One-word capability verb: what these skills let me do. */
  verb: string;
  title: string;
  description: string;
  /** Real tools only. Hidden in the UI while empty. */
  tools: string[];
};

// Organized by capability, never as a logo wall (CLAUDE.md §19).
// TODO(content): owner's real tools/stack per group.
export const skillGroups: SkillGroup[] = [
  {
    slug: "see",
    verb: "See",
    title: "Computer Vision",
    description: "Recognition, image processing and visual pipelines that turn pixels into signal.",
    tools: [],
  },
  {
    slug: "reason",
    verb: "Reason",
    title: "VLMs & Multimodal AI",
    description: "Vision-language models, visual reasoning and efficient multimodal inference.",
    tools: [],
  },
  {
    slug: "build",
    verb: "Build",
    title: "AI Systems",
    description: "Integrating models into products: agents, AI features and end-to-end systems.",
    tools: [],
  },
  {
    slug: "ship",
    verb: "Ship",
    title: "Software Engineering",
    description: "Architecture, full-stack delivery and production platforms — the foundation.",
    tools: [],
  },
];

export const skillsCopy = {
  title: "Capabilities.",
  intro: "Organized by what they let me build, not by logo.",
};
