import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Contact" };

// Full page built in Phase 9 (CLAUDE.md §20).
export default function ContactPage() {
  return (
    <PageHeader
      label="Contact"
      title="Let's build something intelligent."
      intro="Have a research idea, AI product, computer vision problem or engineering project?"
    />
  );
}
