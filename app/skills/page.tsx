import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SkillsEcosystem } from "@/components/skills/skills-ecosystem";
import { skillsCopy } from "@/content/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Senior Software Engineer working across software engineering, machine learning and computer vision, exploring multimodal AI and vision-language models.",
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader label={skillsCopy.eyebrow} title={skillsCopy.title} intro={skillsCopy.intro} />
      <Section
        id="skills"
        aria-labelledby="skills-ecosystem-title"
        className="border-t-0 pt-0 md:pt-0"
      >
        <h2 id="skills-ecosystem-title" className="sr-only">
          Skill ecosystem
        </h2>
        <SkillsEcosystem />
      </Section>
    </>
  );
}
