import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ResearchEntry } from "@/components/research/research-entry";
import { research } from "@/content/research";

export const metadata: Metadata = { title: "Research" };

// Research index. Detail pages (/research/[slug]) land in Phase 5 (CLAUDE.md §20).
export default function ResearchPage() {
  return (
    <>
      <PageHeader
        label="Research"
        title="Research lab"
        intro="Exploring how intelligent systems can see, reason and adapt."
      />
      <Section aria-labelledby="entries-title" className="border-t-0 pt-0 md:pt-0">
        <h2 id="entries-title" className="sr-only">
          Research entries
        </h2>
        <div className="bg-grid rounded-lg border p-3 sm:p-4">
          <ul className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {research.map((item, i) => (
              <li key={item.slug} id={item.slug} className="scroll-mt-24">
                <ResearchEntry item={item} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
