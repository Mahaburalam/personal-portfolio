import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "About" };

// Full page built in Phase 8 (CLAUDE.md §20).
export default function AboutPage() {
  return (
    <PageHeader
      label="About"
      title="AI Researcher & Engineer with a background in production software engineering."
      intro="My current focus is Computer Vision, Vision-Language Models and efficient multimodal AI systems."
    />
  );
}
