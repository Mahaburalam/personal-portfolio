import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { research } from "@/content/research";
import { ResearchLab } from "./research-lab";

/** Homepage Research Lab (CLAUDE.md §8): rail header, three research lines, patch-field schematic. */
export function ResearchPreview() {
  return (
    <Section aria-labelledby="research-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeader
          variant="rail"
          id="research-title"
          label="Research lab"
          index={2}
          title="Exploring adaptive vision-language systems."
          intro="Ongoing research lines focused on efficient VLMs, visual reasoning and multimodal intelligence."
          action={{ href: "/research", label: "Explore research" }}
          className="lg:col-span-3"
        />
        <Reveal className="lg:col-span-9 lg:pt-1" delay={0.05}>
          <ResearchLab items={research} />
        </Reveal>
      </div>
    </Section>
  );
}
