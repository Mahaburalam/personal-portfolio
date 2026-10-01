import { profile } from "@/lib/site";

export const contactCopy = {
  title: "Let's build something intelligent.",
  intro: "Have a research idea, AI product, computer vision problem or engineering project?",
};

// TODO(content): owner to confirm the availability wording before launch.
export const availability = "Open to research collaborations and AI engineering work";

export const inquiryTypes = [
  { value: "research", label: "Research collaboration" },
  { value: "project", label: "AI / Computer Vision project" },
  { value: "role", label: "Full-time role" },
  { value: "other", label: "Something else" },
] as const;

export type InquiryType = (typeof inquiryTypes)[number]["value"];

export const formCopy = {
  heading: "Start a conversation",
  note: "Fields marked * are required.",
  messagePlaceholder:
    "The problem you're working on, the data or system involved, and any timeline that matters.",
  success: "Message sent. Thank you — I'll reply to the address you gave.",
  error: "Something went wrong while sending. Please try again, or email me directly.",
  unconfigured: "The form isn't connected yet. Please email me directly instead.",
};

/** One-line descriptions for the channels panel, keyed by link label. */
export const channelNotes: Record<string, string> = {
  Email: "Direct line for anything that doesn't fit the form.",
  Phone: "Calls for time-sensitive conversations.",
};

export const agentBriefCopy = {
  label: "For agents",
  title: "Let your agent reach out.",
  intro:
    "Paste this brief into ChatGPT, Claude or your own agent. It has everything needed to write me a useful first message.",
};

/** Plain-text brief an AI agent can act on. Built from site data so it never drifts. */
export function buildAgentBrief(): string {
  return [
    `# CONTACT.md — ${profile.name}`,
    "",
    `${profile.role}. Currently ${profile.current}.`,
    `Focus: ${profile.labels.join(" · ")}.`,
    `Research: ${profile.researchFocus}.`,
    "",
    "Open to:",
    ...inquiryTypes.filter((t) => t.value !== "other").map((t) => `- ${t.label}`),
    "",
    "To reach out on my behalf:",
    `1. Email ${profile.email}`,
    '   Subject: "[Inquiry] <short topic>"',
    "2. Include: who you are, the problem, any data or system",
    "   constraints, and the timeline.",
    "",
    `Or use the form at ${profile.url}/contact`,
  ].join("\n");
}
