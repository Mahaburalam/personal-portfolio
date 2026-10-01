import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { servicesCopy } from "@/content/services";

export const metadata: Metadata = { title: "Services" };

// Full page built in Phase 6 (CLAUDE.md §20).
export default function ServicesPage() {
  return <PageHeader label="Services" title={servicesCopy.title} intro={servicesCopy.intro} />;
}
