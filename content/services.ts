export type Service = {
  slug: string;
  title: string;
  summary: string;
  capabilities: string[];
};

// TODO(content): owner to confirm wording and scope of each service.
export const services: Service[] = [
  {
    slug: "computer-vision",
    title: "Computer Vision Systems",
    summary:
      "Turning images into structured, usable signals — from recognition to visual pipelines.",
    capabilities: ["Recognition & detection", "Image processing pipelines", "Model evaluation"],
  },
  {
    slug: "vision-language",
    title: "Vision-Language & Multimodal Prototyping",
    summary: "Exploring how models see and reason across images and text, with efficiency in mind.",
    capabilities: ["VLM prototyping", "Visual reasoning", "Efficient inference"],
  },
  {
    slug: "ai-products",
    title: "AI Product Engineering",
    summary: "Taking AI ideas from notebook to product: agents, integrations and interfaces.",
    capabilities: ["AI features & agents", "Model integration", "Product interfaces"],
  },
  {
    slug: "software-engineering",
    title: "Production Software Engineering",
    summary:
      "The engineering foundation that makes intelligent systems reliable in the real world.",
    capabilities: ["System architecture", "Full-stack delivery", "Enterprise platforms"],
  },
];

export const servicesCopy = {
  title: "AI systems, from research to production.",
  intro: "Computer vision, AI products, agents and the engineering that makes them real.",
};
