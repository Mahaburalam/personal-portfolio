import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { principles, principlesCopy } from "@/content/about";

export function WorkingPrinciples() {
  return (
    <Section aria-labelledby="principles-title">
      <SectionHeader
        id="principles-title"
        label="Principles"
        index={7}
        title={principlesCopy.title}
      />

      <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-12 lg:gap-8">
        <Stagger as="ol" className="border-t lg:col-span-9 lg:col-start-4">
          {principles.map((p, i) => (
            <StaggerItem
              as="li"
              key={p.title}
              className="grid gap-2 border-b py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.3fr)] md:items-baseline"
            >
              <span className="label-mono text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {p.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground sm:col-start-2 md:col-start-3">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
