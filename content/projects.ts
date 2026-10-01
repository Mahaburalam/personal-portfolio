export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Primary capability shown as the card's mono category. */
  category: string;
  // TODO(content): year, role, stack, links, cover image — add only real values.
  year?: string;
  role?: string;
};

export const projects: Project[] = [
  {
    slug: "bot2vision",
    title: "Bot2Vision",
    summary: "Automated hand-drawn shape recognition using computer vision and machine learning.",
    tags: ["Computer Vision", "ML", "Image Processing"],
    category: "Computer Vision",
  },
  {
    slug: "hrms",
    title: "Enterprise HRMS",
    summary: "Production workforce management platform built for real-world enterprise operations.",
    tags: ["Product Engineering", "Full-Stack", "Enterprise"],
    category: "Product Engineering",
  },
  {
    slug: "horizon-mind",
    title: "Horizon Mind",
    summary: "Research-driven AI products and intelligent systems.",
    tags: ["AI", "Research", "Product"],
    category: "AI Products",
  },
];
