import { Reveal } from "@/components/animations/reveal";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { exploring, exploringCopy, phaseLabel, type ExplorePhase } from "@/content/about";
import { profile } from "@/lib/site";
import { cn } from "@/lib/utils";

const dot: Record<ExplorePhase, string> = {
  now: "animate-pulse bg-signal motion-reduce:animate-none",
  next: "border border-foreground/60",
  horizon: "border border-dashed border-foreground/60",
};

/** Where the work is heading, closed by a compact "current status" strip. A direction, not a claim. */
export function CurrentlyExploring() {
  const { horizon } = exploringCopy;
  const status = [
    { term: "Now", value: profile.current },
    { term: "Exploring", value: exploringCopy.status.exploring },
    { term: "Research focus", value: profile.researchFocus },
  ];

  return (
    <Section aria-labelledby="exploring-title" className="bg-card">
      <SectionHeader
        id="exploring-title"
        label="Exploring"
        index={6}
        title={exploringCopy.title}
        intro={exploringCopy.intro}
      />

      <Stagger
        as="ul"
        className="mt-14 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
      >
        {exploring.map((area, i) => (
          <StaggerItem
            as="li"
            key={area.label}
            className={cn(
              "flex flex-col justify-between gap-6 bg-card p-6 sm:min-h-48 sm:gap-10 sm:p-8",
              area.phase === "horizon" && "bg-grid",
            )}
          >
            <p className="label-mono flex items-center justify-between gap-4 text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className={cn("size-2 rounded-full", dot[area.phase])} />
                <span className={cn(area.phase === "now" && "text-foreground")}>
                  {phaseLabel[area.phase]}
                </span>
              </span>
              <span className="text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
            </p>
            <div>
              <p className="label-mono text-muted-foreground">{area.verb}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight font-semibold tracking-tight sm:text-[1.75rem]">
                {area.label}
              </h3>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-16 grid gap-6 md:mt-24 lg:grid-cols-12 lg:gap-8">
        <p className="label-mono text-muted-foreground lg:col-span-3 lg:pt-3">Long-term</p>
        <p className="max-w-4xl font-display text-3xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:col-span-9">
          {horizon.lead} <span className="text-accent">{horizon.emphasis}</span> {horizon.tail}
        </p>
      </Reveal>

      <Reveal className="mt-16 md:mt-24">
        <section aria-labelledby="status-title" className="lg:grid lg:grid-cols-12 lg:gap-8">
          <h3 id="status-title" className="label-mono text-muted-foreground lg:col-span-3 lg:pt-6">
            Current status
          </h3>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3 lg:col-span-9 lg:mt-0">
            {status.map(({ term, value }) => (
              <div key={term} className="bg-background p-6">
                <dt className="label-mono text-muted-foreground">{term}</dt>
                <dd className="mt-2 leading-snug font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>
    </Section>
  );
}
