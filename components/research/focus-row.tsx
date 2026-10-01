import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionLabel } from "@/components/layout/section-label";
import { ButtonLink } from "@/components/ui/button";
import { focusAreas, focusCopy } from "@/content/focus";

/** Homepage "Currently exploring": six focus areas in one hairline-divided row. */
export function FocusRow() {
  return (
    <Section aria-labelledby="focus-title">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel index={4}>{focusCopy.label}</SectionLabel>
          <h2
            id="focus-title"
            className="mt-5 font-display text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl"
          >
            {focusCopy.title}
          </h2>
        </div>
        <ButtonLink href="/about#exploring-title" variant="ghost" arrow>
          View all
        </ButtonLink>
      </Reveal>

      {/* Hairlines come from the 1px gaps; revealed as one block so they never show as a solid fill. */}
      <Reveal className="mt-12 md:mt-14" delay={0.05}>
        <ol className="grid grid-cols-2 gap-px border-y bg-border md:grid-cols-3 xl:grid-cols-6">
          {focusAreas.map((area, i) => (
            <li key={area.label} className="flex gap-3 bg-background px-4 py-6 xl:px-5">
              <span className="label-mono pt-1 text-foreground/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {area.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.line}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
