import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { about } from "@/content/about";

export const metadata: Metadata = { title: "About" };

// Full page built in Phase 8 (CLAUDE.md §20).
export default function AboutPage() {
  return <PageHeader label="About" title={about.headline} intro={about.focus} />;
}
