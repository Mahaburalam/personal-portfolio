import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ResearchVisualization } from "./research-visualization";

export function ResearchVisualizationSection() {
  return (
    <Section aria-labelledby="viz-title" className="bg-grid">
      <SectionHeader
        id="viz-title"
        label="Lab notebook"
        index={3}
        title="Spend visual tokens where they matter."
        intro="The idea connecting my current research: instead of encoding every patch of an image at a fixed resolution, adapt what the model looks at to the question being asked."
      />
      <Reveal className="mt-14 md:mt-20">
        <ResearchVisualization />
      </Reveal>
    </Section>
  );
}
