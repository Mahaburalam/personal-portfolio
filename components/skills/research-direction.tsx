import { researchDirection, type DirectionStep } from "@/content/skills";
import { cn } from "@/lib/utils";

const phaseLabel: Record<DirectionStep["phase"], string> = {
  now: "Now",
  next: "Next",
  horizon: "Horizon",
};

/**
 * Research direction strip: where the work is heading, not a claim of expertise.
 * `now` steps are solid, later ones hollow + dashed. The travelling dot (`.skills-travel`)
 * only runs while the skills graph is in view (globals.css); hidden on small screens.
 */
export function ResearchDirection() {
  return (
    <div className="bg-grid h-full rounded-md border border-dashed bg-card/80 p-6 sm:p-8">
      <p className="label-mono flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-muted-foreground">
        <span id="skills-direction-title">Research direction</span>
        <span className="text-foreground/40">A direction, not a claim</span>
      </p>

      <div className="relative mt-6">
        {/* Track: solid through the "now" steps, dashed beyond. Centers of node 1 → node 5. */}
        <span
          aria-hidden
          className="absolute top-[5px] right-[calc(20%-5px)] left-[5px] hidden border-t border-dashed border-foreground/30 sm:block"
        />
        <span
          aria-hidden
          className="absolute top-[5px] left-[5px] hidden h-px w-[40%] bg-foreground/40 sm:block"
        />
        <span
          aria-hidden
          className="absolute top-[5px] right-[calc(20%-5px)] left-[5px] hidden motion-reduce:hidden sm:block"
        >
          <span className="skills-travel absolute inset-x-0 top-0 block">
            <span className="absolute top-0 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
          </span>
        </span>

        <ol aria-labelledby="skills-direction-title" className="grid gap-4 sm:grid-cols-5 sm:gap-0">
          {researchDirection.map((step) => (
            <li key={step.label} className="relative flex items-start gap-3 sm:flex-col sm:pr-3">
              <span
                aria-hidden
                className={cn(
                  "relative mt-[3px] size-2.5 shrink-0 rounded-full sm:mt-0",
                  step.phase === "now"
                    ? "bg-foreground"
                    : "border border-dashed border-foreground/60 bg-background",
                )}
              />
              <span className="flex flex-col gap-1">
                <span className="text-sm leading-snug font-semibold">{step.label}</span>
                <span className="label-mono text-muted-foreground">{phaseLabel[step.phase]}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
