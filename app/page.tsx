import { AboutPreview } from "@/components/about/about-preview";
import { ExperienceProof } from "@/components/about/experience-proof";
import { ContactCta } from "@/components/contact/contact-cta";
import { Currently } from "@/components/hero/currently";
import { Hero } from "@/components/hero/hero";
import { ResearchPreview } from "@/components/research/research-preview";
import { ResearchVisualizationSection } from "@/components/research/research-visualization-section";
import { SignalBand } from "@/components/signal/signal-band";
import { ServicesPreview } from "@/components/services/services-preview";
import { SkillsPreview } from "@/components/skills/skills-preview";
import { SelectedWork } from "@/components/work/selected-work";

// Section order is fixed by CLAUDE.md §8. The footer comes from the root layout.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Currently />
      <SelectedWork />
      <ResearchPreview />
      <ResearchVisualizationSection />
      <ServicesPreview />
      <SkillsPreview />
      <ExperienceProof />
      <AboutPreview />
      <ContactCta />
      <SignalBand />
    </>
  );
}
