import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { roles, stages } from "@/content/experience";
import { projects } from "@/content/projects";
import { research } from "@/content/research";
import { profile } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ExperienceProof() {
  const currentRole = roles.find((r) => r.current);
  // Derived from content — never hand-typed numbers (CLAUDE.md §16).
  const proof = [
    { value: projects.length, label: "Selected projects" },
    {
      value: research.filter((r) => r.status === "ongoing").length,
      label: "Ongoing research lines",
    },
  ];

  return (
    <Section aria-labelledby="path-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <SectionHeader
          variant="rail"
          id="path-title"
          label="Path"
          index={7}
          title="From engineering to research."
          intro="A production software engineering foundation, moving deliberately toward AI research."
          className="lg:col-span-3"
        />

        {/* Story arc */}
        <Stagger as="ol" className="relative lg:col-span-6">
          {stages.map((stage, i) => {
            const last = i === stages.length - 1;
            return (
              <StaggerItem
                as="li"
                key={stage.index}
                className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-10 last:pb-0"
              >
                {!last && (
                  <span
                    aria-hidden
                    className="absolute top-6 bottom-0 left-[0.3rem] w-px bg-border"
                  />
                )}
                <span className="flex items-start gap-3 pt-1.5">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 size-2.5 shrink-0 rounded-full border",
                      last
                        ? "bg-spectrum border-transparent"
                        : "border-foreground/40 bg-background",
                    )}
                  />
                </span>
                <div>
                  <p className="label-mono text-muted-foreground">{stage.index}</p>
                  <h3
                    className={cn(
                      "mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
                      last && "text-spectrum",
                    )}
                  >
                    {stage.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{stage.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Proof */}
        <Reveal className="lg:col-span-3" delay={0.1}>
          <dl className="space-y-8 rounded-lg border bg-card p-6">
            {currentRole && (
              <div>
                <dt className="label-mono text-muted-foreground">Now</dt>
                <dd className="mt-2 font-medium">{currentRole.title}</dd>
                {(currentRole.org || currentRole.period) && (
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {[currentRole.org, currentRole.period].filter(Boolean).join(" · ")}
                  </dd>
                )}
              </div>
            )}
            <div>
              <dt className="label-mono text-muted-foreground">Research focus</dt>
              <dd className="mt-2 font-medium">{profile.researchFocus}</dd>
            </div>
            {proof.map((p) => (
              <div key={p.label}>
                <dt className="label-mono text-muted-foreground">{p.label}</dt>
                <dd className="mt-1 font-display text-4xl font-semibold tracking-tight tabular-nums">
                  {String(p.value).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
