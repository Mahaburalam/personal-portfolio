import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { StatusBadge } from "@/components/research/status-badge";
import { Tag } from "@/components/ui/tag";
import { researchCopy, researchInterests, statusLegend } from "@/content/about";
import { research } from "@/content/research";
import { cn } from "@/lib/utils";
import { PublicationList } from "./publication-list";

const liveTerms = ["Experiment", "Ongoing"];

/**
 * Research notebook (CLAUDE.md §9): what is in progress, what is only an interest, and how to tell
 * them apart. Publications appear only when real ones exist.
 */
export function ResearchFocus() {
  return (
    <Section aria-labelledby="research-title">
      <SectionHeader
        id="research-title"
        label="Research"
        index={3}
        title={researchCopy.title}
        intro={researchCopy.intro}
        action={{ href: "/research", label: "Research lab" }}
      />

      <div className="bg-grid mt-14 rounded-lg border p-3 sm:p-4 md:mt-20">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
          <section
            aria-labelledby="ongoing-title"
            className="rounded-md border border-dashed bg-card/90 p-6 sm:p-8 lg:col-span-8"
          >
            <h3 id="ongoing-title" className="label-mono text-muted-foreground">
              Ongoing research
            </h3>
            <Stagger as="ul" className="mt-6 divide-y border-t">
              {research.map((item, i) => (
                <StaggerItem as="li" key={item.slug}>
                  <Link
                    href={`/research#${item.slug}`}
                    className="group grid grid-cols-[2.75rem_1fr] gap-x-3 gap-y-3 py-6 sm:grid-cols-[3.5rem_1fr_auto] sm:items-start sm:gap-x-6"
                  >
                    <span className="label-mono pt-1.5 text-muted-foreground">
                      R/{String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-display text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 leading-relaxed text-muted-foreground">{item.summary}</p>
                    </div>
                    <span className="col-start-2 flex items-center gap-3 sm:col-start-3">
                      <StatusBadge status={item.status} />
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 text-muted-foreground transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                      />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <section
            aria-labelledby="interests-title"
            className="flex flex-col rounded-md border border-dashed bg-card/90 p-6 sm:p-8 lg:col-span-4"
          >
            <h3 id="interests-title" className="label-mono text-muted-foreground">
              Research interests
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {researchInterests.map((interest) => (
                <li key={interest}>
                  <Tag className="bg-background text-foreground">{interest}</Tag>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground lg:mt-auto lg:pt-8">
              Interests are questions I follow — not finished work.
            </p>
          </section>

          <PublicationList className="lg:col-span-12" />

          <section
            aria-labelledby="legend-title"
            className="rounded-md border border-dashed bg-card/90 p-6 sm:p-8 lg:col-span-12"
          >
            <h3 id="legend-title" className="label-mono text-muted-foreground">
              How to read a status
            </h3>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
              {statusLegend.map(({ term, definition }) => (
                <div key={term}>
                  <dt className="label-mono inline-flex items-center gap-2 text-foreground">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 rounded-full",
                        liveTerms.includes(term) ? "bg-signal" : "bg-muted-foreground",
                      )}
                    />
                    {term}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </Section>
  );
}
