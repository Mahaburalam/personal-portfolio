import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { research } from "@/content/research";
import { profile } from "@/lib/site";
import { ResearchEntry } from "./research-entry";

export function ResearchPreview() {
  return (
    <Section aria-labelledby="research-title">
      <SectionHeader
        id="research-title"
        label="Research"
        index={2}
        title="What I investigate."
        intro="Exploring how intelligent systems can see, reason and adapt."
        action={{ href: "/research", label: "Research lab" }}
      />

      <div className="bg-grid mt-14 rounded-lg border p-3 sm:p-4 md:mt-20">
        <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 px-3 pt-2 pb-4 text-muted-foreground sm:px-4">
          <span className="text-foreground/40">Focus</span>
          {profile.researchFocus}
        </p>
        <Stagger as="ul" className="grid gap-3 sm:gap-4 lg:grid-cols-3">
          {research.map((item, i) => (
            <StaggerItem as="li" key={item.slug}>
              <ResearchEntry item={item} index={i} href={`/research#${item.slug}`} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
