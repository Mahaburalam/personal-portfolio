import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Services" };

// Full page built in Phase 6 (CLAUDE.md §20).
export default function ServicesPage() {
  return (
    <PageHeader
      label="Services"
      title="AI systems, from research to production."
      intro="Computer vision, AI products, agents and the engineering that makes them real."
    />
  );
}
