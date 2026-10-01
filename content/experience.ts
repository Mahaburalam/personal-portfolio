export type Stage = {
  index: string;
  title: string;
  description: string;
};

/** The story arc across the site (CLAUDE.md §1). */
export const stages: Stage[] = [
  {
    index: "01",
    title: "Engineering",
    description: "Building and shipping production software systems.",
  },
  {
    index: "02",
    title: "AI Engineering",
    description: "Bringing machine learning into real products.",
  },
  {
    index: "03",
    title: "Computer Vision",
    description: "Teaching systems to understand what they see.",
  },
  {
    index: "04",
    title: "Research",
    description: "Efficient & adaptive vision-language systems.",
  },
  {
    index: "05",
    title: "Future",
    description: "VLMs, Multimodal, Efficient AI, Embodied AI, World Models.",
  },
];

export type Role = {
  title: string;
  org: string | null;
  period: string | null;
  current: boolean;
  /** Optional details for /about — only rendered when set. */
  location?: string;
  summary?: string;
  highlights?: string[];
};

/** Most recent first. */
export const roles: Role[] = [
  {
    title: "Senior Software Engineer",
    // TODO(content): organization, period, location, summary and highlights — add only real values.
    // Earlier roles go below this one.
    org: null,
    period: null,
    current: true,
  },
];
