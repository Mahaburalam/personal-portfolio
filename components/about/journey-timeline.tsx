import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { journey, journeyCopy, type JourneyPhase } from "@/content/about";
import { cn } from "@/lib/utils";
import { JourneyProgress } from "./journey-progress";

const phaseLabel: Record<JourneyPhase, string> = {
  foundation: "Foundation",
  practice: "Practice",
  now: "Now",
  direction: "Direction",
};

const node: Record<JourneyPhase, string> = {
  foundation: "border-foreground/40 bg-background",
  practice: "border-foreground/40 bg-background",
  now: "border-accent bg-accent",
  direction: "border-dashed border-foreground/60 bg-background",
};

export function JourneyTimeline() {
  return (
    <Section aria-labelledby="journey-title">
      <SectionHeader
        id="journey-title"
        label="Journey"
        index={1}
        title={journeyCopy.title}
        intro={journeyCopy.intro}
      />

      <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-9 lg:col-start-4">
          <JourneyProgress>
            <Stagger as="ol">
              {journey.map((step) => {
                const direction = step.phase === "direction";
                return (
                  <StaggerItem
                    as="li"
                    key={step.index}
                    className="relative grid grid-cols-[1.75rem_1fr] gap-x-3 pb-12 last:pb-0 sm:grid-cols-[1.75rem_8.5rem_1fr] sm:gap-x-6"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "relative mt-1.5 size-2.5 rounded-full border",
                        node[step.phase],
                      )}
                    />
                    <p className="label-mono flex gap-3 text-muted-foreground sm:mt-0.5 sm:flex-col sm:gap-1">
                      <span>{step.index}</span>
                      <span
                        className={cn(step.phase === "now" ? "text-accent" : "text-foreground/40")}
                      >
                        {phaseLabel[step.phase]}
                      </span>
                    </p>
                    <div className="col-start-2 mt-2 sm:col-start-3 sm:mt-0">
                      <h3
                        className={cn(
                          "font-display text-2xl leading-tight font-semibold tracking-tight sm:text-3xl",
                          direction && "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                      {direction && (
                        <p className="label-mono mt-3 text-foreground/40">
                          A direction, not a claim
                        </p>
                      )}
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </JourneyProgress>
        </div>
      </div>
    </Section>
  );
}
