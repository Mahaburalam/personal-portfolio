import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Research" };

// Full page built in Phase 5 (CLAUDE.md §20).
export default function ResearchPage() {
  return (
    <PageHeader
      label="Research"
      title="Research lab"
      intro="Exploring how intelligent systems can see, reason and adapt."
    />
  );
}
