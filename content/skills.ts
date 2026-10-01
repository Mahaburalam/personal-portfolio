/** Simple Icons slugs with a glyph in `components/skills/tech-icon.tsx`. */
export type TechIcon =
  | "javascript"
  | "typescript"
  | "nodedotjs"
  | "express"
  | "react"
  | "nextdotjs"
  | "tailwindcss"
  | "html5"
  | "css"
  | "postgresql"
  | "mysql"
  | "mongodb"
  | "python"
  | "numpy"
  | "pandas"
  | "scikitlearn"
  | "pytorch"
  | "opencv"
  | "git"
  | "github"
  | "linux"
  | "docker"
  | "vercel"
  | "claudecode";

export type Skill = {
  name: string;
  /** Only real technologies get a logo; concepts stay text-only. */
  icon?: TechIcon;
  /** Stronger visual treatment. Prominence only — never a proficiency rating. */
  featured?: boolean;
};

/** primary = strongest · secondary = supporting · emerging = research direction (CLAUDE.md §9). */
export type SkillTier = "primary" | "secondary" | "emerging";

export type SkillCategory = {
  id: string;
  title: string;
  /** Neutral, visible verb so the tier never relies on color alone. */
  stance:
    "Developing" | "Focused on" | "Exploring" | "Researching" | "Building with" | "Working with";
  tier: SkillTier;
  description: string;
  skills: Skill[];
};

// Visual order on /skills (AI-first). Card numbers derive from this order.
// TODO(content): descriptions are draft copy — owner to review.
export const skillCategories: SkillCategory[] = [
  {
    id: "ai-ml",
    title: "AI / Machine Learning",
    stance: "Developing",
    tier: "primary",
    description: "Training and evaluating models in Python, from classical ML to deep learning.",
    skills: [
      { name: "Python", icon: "python", featured: true },
      { name: "NumPy", icon: "numpy" },
      { name: "Pandas", icon: "pandas" },
      { name: "Scikit-learn", icon: "scikitlearn" },
      { name: "Machine Learning" },
      { name: "Deep Learning", featured: true },
      { name: "PyTorch", icon: "pytorch", featured: true },
      { name: "Model Evaluation" },
      { name: "Model Optimization" },
    ],
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    stance: "Focused on",
    tier: "primary",
    description:
      "My primary AI focus: models that classify, detect and understand images, with an eye on efficiency and edge deployment.",
    skills: [
      { name: "Computer Vision", featured: true },
      { name: "Image Classification" },
      { name: "Object Detection" },
      { name: "Image Processing" },
      { name: "Vision Transformers", featured: true },
      { name: "CNNs" },
      { name: "OpenCV", icon: "opencv" },
      { name: "Efficient Vision Models" },
      { name: "Edge AI" },
    ],
  },
  {
    id: "multimodal",
    title: "Multimodal AI",
    stance: "Exploring",
    tier: "emerging",
    description: "Where vision meets language: how models ground text in what they see.",
    skills: [
      { name: "Vision-Language Models", featured: true },
      { name: "Multimodal AI", featured: true },
      { name: "Visual Question Answering" },
      { name: "Vision-Language Reasoning" },
      { name: "Multimodal Learning" },
      { name: "Visual Representation Learning" },
      { name: "Efficient VLMs" },
    ],
  },
  {
    id: "research",
    title: "AI Research",
    stance: "Researching",
    tier: "emerging",
    description: "Reading, reproducing and testing ideas, with a focus on model efficiency.",
    skills: [
      { name: "AI Research" },
      { name: "Computer Vision Research" },
      { name: "Deep Learning Research" },
      { name: "Model Efficiency" },
      { name: "AI Evaluation" },
      { name: "Experimental Design" },
      { name: "Literature Review" },
      { name: "Research Prototyping" },
      { name: "Paper Analysis" },
    ],
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    stance: "Building with",
    tier: "primary",
    description: "Building scalable production systems and backend services — the foundation.",
    skills: [
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript", featured: true },
      { name: "Node.js", icon: "nodedotjs", featured: true },
      { name: "Express.js", icon: "express" },
      { name: "REST APIs" },
      { name: "Backend Development" },
      { name: "API Design" },
      { name: "System Design" },
      { name: "Software Architecture" },
      { name: "Microservices" },
      { name: "Web Application Development" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    stance: "Working with",
    tier: "secondary",
    description: "Interfaces for the systems I build, including this site.",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css" },
      { name: "Responsive Web Design" },
    ],
  },
  {
    id: "data",
    title: "Database & Data",
    stance: "Working with",
    tier: "secondary",
    description: "Modeling and storing data for production applications.",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "SQL" },
      { name: "Database Design" },
      { name: "Data Modeling" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Engineering",
    stance: "Working with",
    tier: "secondary",
    description: "The everyday toolchain behind shipping and experimenting.",
    // REST APIs lives under Software Engineering only (it was listed in both).
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Linux", icon: "linux" },
      { name: "Docker", icon: "docker" },
      { name: "Vercel", icon: "vercel" },
      { name: "CI/CD" },
      { name: "Claude Code", icon: "claudecode" },
      { name: "VS Code" }, // Microsoft logos are not in Simple Icons
    ],
  },
];

/** Id of the research-direction node in the graph (not a category). */
export const DIRECTION_ID = "direction";

/** Related pairs: drawn as traces on /skills and used for hover emphasis. Order = source → target. */
export const skillLinks: [string, string][] = [
  ["ai-ml", "computer-vision"],
  ["ai-ml", "multimodal"],
  ["ai-ml", "research"],
  ["multimodal", "research"],
  ["computer-vision", "multimodal"],
  ["multimodal", DIRECTION_ID],
  ["research", DIRECTION_ID],
  ["computer-vision", "software-engineering"],
  [DIRECTION_ID, "software-engineering"],
  ["software-engineering", "frontend"],
  ["software-engineering", "data"],
  ["software-engineering", "tools"],
];

export type DirectionStep = { label: string; phase: "now" | "next" | "horizon" };

/** Where the research is heading — a direction, not a claim of expertise. */
export const researchDirection: DirectionStep[] = [
  { label: "Computer Vision", phase: "now" },
  { label: "Multimodal AI", phase: "now" },
  { label: "Vision-Language Models", phase: "now" },
  { label: "Embodied AI", phase: "next" },
  { label: "World Models", phase: "horizon" },
];

export const skillsCopy = {
  eyebrow: "Technical expertise",
  title: "Skills & Technologies",
  intro:
    "Building production software today while exploring intelligent systems, computer vision, and multimodal AI for tomorrow.",
};
