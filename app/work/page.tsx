import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Work" };

// Full page built in Phase 4 (CLAUDE.md §20).
export default function WorkPage() {
  return (
    <PageHeader
      label="Work"
      title="Featured projects and case studies."
      intro="Real-world systems. Research-driven ideas. Built with modern technologies."
    />
  );
}
