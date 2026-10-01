import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { highlights, highlightsCopy, type Highlight, type HighlightStage } from "@/content/about";
import { cn } from "@/lib/utils";

function groupByStage(items: Highlight[]) {
  const groups = new Map<HighlightStage, Highlight[]>();
  for (const item of items) groups.set(item.stage, [...(groups.get(item.stage) ?? []), item]);
  return [...groups];
}

function HighlightRow({ item }: { item: Highlight }) {
  const body = (
    <>
      <div className="min-w-0">
        <h4 className="font-display text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-accent sm:text-2xl">
          {item.title}
        </h4>
        <p className="mt-1.5 leading-relaxed text-muted-foreground">{item.note}</p>
      </div>
      {item.workSlug && (
        <ArrowUpRight
          aria-hidden
          className="mt-1.5 size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
        />
      )}
    </>
  );
  const row = "flex items-start justify-between gap-6 py-5";

  return item.workSlug ? (
    <Link href={`/work#${item.workSlug}`} className={cn("group", row)}>
      {body}
    </Link>
  ) : (
    <div className={row}>{body}</div>
  );
}

/** Selected projects as evidence for each stage of the journey. Not a copy of /work. */
export function ProjectHighlights() {
  return (
    <Section aria-labelledby="highlights-title">
      <SectionHeader
        id="highlights-title"
        label="Projects"
        index={5}
        title={highlightsCopy.title}
        intro={highlightsCopy.intro}
        action={{ href: "/work", label: "View all work" }}
      />

      <Stagger className="mt-14 border-t md:mt-20">
        {groupByStage(highlights).map(([stage, items]) => (
          <StaggerItem
            key={stage}
            className="grid gap-2 border-b py-6 md:py-8 lg:grid-cols-12 lg:gap-8"
          >
            <h3 className="label-mono pt-2 text-muted-foreground lg:col-span-3 lg:pt-6">{stage}</h3>
            <ul className="divide-y divide-dashed lg:col-span-9">
              {items.map((item) => (
                <li key={item.title}>
                  <HighlightRow item={item} />
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
