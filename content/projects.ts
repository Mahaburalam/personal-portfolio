export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Primary capability shown as the card's mono category. */
  category: string;
  /** Short chip on the homepage tile cover, e.g. "AI / CV". Falls back to `category`. */
  badge?: string;
  /**
   * Cover screenshot in public/ (e.g. `/projects/hrms.png`). Without one the tile shows a
   * generated token-grid cover. TODO(content): add real screenshots only.
   */
  cover?: { src: string; alt: string };
  // TODO(content): year, role, context (company / personal), stack, links — add only real values.
  year?: string;
  role?: string;
  context?: string;
};

export const projects: Project[] = [
  {
    slug: "bot2vision",
    title: "Bot2Vision",
    summary: "Automated hand-drawn shape recognition using computer vision and machine learning.",
    tags: ["Computer Vision", "ML", "Image Processing"],
    category: "Computer Vision",
    badge: "AI / CV",
  },
  {
    slug: "hrms",
    title: "Enterprise HRMS",
    summary: "Production workforce management platform built for real-world enterprise operations.",
    tags: ["Product Engineering", "Full-Stack", "Enterprise"],
    category: "Product Engineering",
    badge: "Product",
  },
  {
    slug: "horizon-mind",
    title: "Horizon Mind",
    summary: "Research-driven AI products and intelligent systems.",
    tags: ["AI", "Research", "Product"],
    category: "AI Products",
    badge: "Product / AI",
  },
];
