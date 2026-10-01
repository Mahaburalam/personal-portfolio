import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ResearchVisualization } from "./research-visualization";

export function ResearchVisualizationSection() {
  return (
    <Section aria-labelledby="viz-title" className="bg-grid">
      {/* The schematic needs width: rail beside it only on xl, stacked above it below that. */}
      <div className="grid gap-12 xl:grid-cols-12 xl:gap-10">
        <SectionHeader
          variant="rail"
          id="viz-title"
          label="Lab notebook"
          index={3}
          title="Spend visual tokens where they matter."
          intro="The idea connecting my current research: instead of encoding every patch of an image at a fixed resolution, adapt what the model looks at to the question being asked."
          className="xl:col-span-3"
        />
        <Reveal className="xl:col-span-9" delay={0.05}>
          <ResearchVisualization />
        </Reveal>
      </div>
    </Section>
  );
}
