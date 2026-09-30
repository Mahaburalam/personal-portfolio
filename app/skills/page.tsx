import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Skills" };

// Full page built in Phase 7 (CLAUDE.md §20).
export default function SkillsPage() {
  return (
    <PageHeader
      label="Skills"
      title="Capabilities."
      intro="Organized by what they let me build, not by logo."
    />
  );
}
