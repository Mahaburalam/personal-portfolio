/** Homepage About preview (CLAUDE.md §8). */
export const about = {
  headline: "AI Researcher & Engineer with a background in production software engineering.",
  focus:
    "My current focus is Computer Vision, Vision-Language Models and efficient multimodal AI systems.",
};

/* ---------------------------------------------------------------------------------------------
 * /about — narrative copy (CLAUDE.md §9 "About"). Facts only: anything unverified stays out.
 * ------------------------------------------------------------------------------------------- */

export const aboutMeta = {
  title: "About Mahabur Alam — AI Researcher & Engineer",
  description:
    "Mahabur Alam is an AI researcher and engineer working on Computer Vision, Vision-Language Models and Multimodal AI, backed by production software engineering experience.",
};

export const aboutHero = {
  intro:
    "I research how machines see and reason — Computer Vision, Vision-Language Models and multimodal AI — and I build those systems with the discipline of a senior software engineer who ships production software.",
  tags: ["AI Research", "Computer Vision", "Multimodal AI", "Software Engineering"],
  /** The relationship the hero has to communicate, in order. */
  trajectory: ["Software Engineering", "AI Engineering", "Computer Vision", "AI Research"],
};

export type JourneyPhase = "foundation" | "practice" | "now" | "direction";

export type JourneyStep = {
  index: string;
  title: string;
  description: string;
  phase: JourneyPhase;
};

export const journeyCopy = {
  title: "From software to intelligence.",
  intro:
    "Each stage built the next. The engineering never went away — it is what makes the research buildable.",
};

/** A finer-grained telling of the site's story arc (`stages` in experience.ts). */
export const journey: JourneyStep[] = [
  {
    index: "01",
    title: "Education",
    // TODO(content): name the degree here once confirmed.
    description: "Studies at Daffodil International University — the first foundation.",
    phase: "foundation",
  },
  {
    index: "02",
    title: "Software Engineering",
    description: "Learning to design, build and maintain software that other people depend on.",
    phase: "foundation",
  },
  {
    index: "03",
    title: "Production Systems",
    description:
      "Enterprise platforms and reporting systems in real operations, where reliability matters more than demos.",
    phase: "practice",
  },
  {
    index: "04",
    title: "AI / Machine Learning",
    description: "Bringing models into products, and learning where they help and where they fail.",
    phase: "now",
  },
  {
    index: "05",
    title: "Computer Vision",
    description:
      "Teaching systems to understand images — recognition, visual pipelines, evaluation.",
    phase: "now",
  },
  {
    index: "06",
    title: "AI Research",
    description:
      "Investigating how vision-language models can see more efficiently and adaptively.",
    phase: "now",
  },
  {
    index: "07",
    title: "Efficient & multimodal intelligent systems",
    description:
      "Systems that perceive, reason and act across modalities — where the work is heading.",
    phase: "direction",
  },
];

export const experienceCopy = {
  title: "Professional experience.",
  intro:
    "The production foundation behind the research — real systems, real users, real constraints.",
};

export const researchCopy = {
  title: "Research & AI.",
  intro:
    "Research questions grown out of engineering problems: how to make vision-language systems see only as much as a question needs.",
};

/** Areas I follow — interests, not claims of results. */
export const researchInterests = [
  "Computer Vision",
  "Vision-Language Models",
  "Multimodal AI",
  "Efficient AI",
  "Adaptive Visual Processing",
  "Edge AI",
  "AI Security",
  "Intelligent Systems",
];

/** How to read the status words used on this page (CLAUDE.md §16). */
export const statusLegend = [
  { term: "Interest", definition: "A question I follow and read about. No work claimed." },
  { term: "Proposed", definition: "A defined idea with a plan, not yet started." },
  { term: "Experiment", definition: "Early runs to test whether an idea holds." },
  { term: "Ongoing", definition: "Active research. No results are claimed until they exist." },
  { term: "Publication", definition: "Peer-reviewed or publicly released work." },
];

export const credentialsCopy = {
  title: "Education & learning.",
  intro: "Formal foundations, and the courses that keep the engineering current.",
};

export type HighlightStage = "Engineering" | "AI / ML" | "Computer Vision" | "AI Products";

export type Highlight = {
  title: string;
  stage: HighlightStage;
  note: string;
  /** Slug in `projects.ts` — links to `/work#slug` when set. */
  workSlug?: string;
};

export const highlightsCopy = {
  title: "Built along the way.",
  intro: "Evidence for the journey — not the full portfolio.",
};

// TODO(content): years, roles and links for each highlight — add only real values.
export const highlights: Highlight[] = [
  {
    title: "Offshore ERP",
    stage: "Engineering",
    note: "Enterprise software running as a production system.",
  },
  {
    title: "DigiDial Reporting",
    stage: "Engineering",
    note: "Reporting and data-oriented application work.",
  },
  {
    title: "Enterprise HRMS",
    stage: "Engineering",
    note: "Production workforce management platform for real-world enterprise operations.",
    workSlug: "hrms",
  },
  {
    title: "AI Based DIU Student Drop Out Solution",
    stage: "AI / ML",
    note: "Academic project applying machine learning to student drop-out.",
  },
  {
    title: "Bot2Vision",
    stage: "Computer Vision",
    note: "Hand-drawn shape recognition with computer vision and machine learning.",
    workSlug: "bot2vision",
  },
  {
    title: "Horizon Mind",
    stage: "AI Products",
    note: "Research-driven AI products and intelligent systems.",
    workSlug: "horizon-mind",
  },
];

export type ExplorePhase = "now" | "next" | "horizon";

export type ExploreArea = { label: string; verb: string; phase: ExplorePhase };

export const exploringCopy = {
  title: "Currently exploring.",
  intro: "Where my attention goes now, and what comes after. A direction, not a claim.",
  /** Long-term line; `emphasis` is set in the accent color. */
  horizon: {
    lead: "Building toward intelligent systems that can",
    emphasis: "perceive, reason and interact",
    tail: "with the world.",
  },
  status: {
    exploring: "AI · Computer Vision · Multimodal systems",
  },
};

export const exploring: ExploreArea[] = [
  { label: "Computer Vision", verb: "Researching", phase: "now" },
  { label: "Vision-Language Models", verb: "Researching", phase: "now" },
  { label: "Multimodal AI", verb: "Exploring", phase: "now" },
  { label: "Efficient AI", verb: "Investigating", phase: "now" },
  { label: "Edge AI", verb: "Exploring", phase: "next" },
  { label: "AI Security", verb: "Exploring", phase: "next" },
  { label: "Embodied AI", verb: "Building toward", phase: "next" },
  { label: "World Models", verb: "Building toward", phase: "horizon" },
];

export const phaseLabel: Record<ExplorePhase, string> = {
  now: "Now",
  next: "Next",
  horizon: "Horizon",
};

export const principlesCopy = {
  title: "How I work.",
};

// TODO(content): owner review of the principle wording.
export const principles = [
  {
    title: "Build before hype",
    body: "A working system says more than a claim. I ship first, describe second.",
  },
  {
    title: "Research with purpose",
    body: "Questions come from real constraints — cost, latency, reliability — not from trends.",
  },
  {
    title: "Engineer for real systems",
    body: "Models live inside software. Interfaces, failure modes and maintenance are part of the work.",
  },
  {
    title: "Learn continuously",
    body: "The field moves weekly. Reading papers and rebuilding ideas is part of the job.",
  },
  {
    title: "Prove with experiments",
    body: "An idea counts when it survives a measurement. Until then it is labelled as an idea.",
  },
];

export const aboutCta = {
  intro:
    "Whether it's research, an AI system, a computer vision problem or a production software challenge.",
};
