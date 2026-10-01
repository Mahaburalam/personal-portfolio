import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { projects } from "@/content/projects";
import { ProjectCard } from "./project-card";

export function SelectedWork() {
  return (
    <Section aria-labelledby="work-title">
      <SectionHeader
        id="work-title"
        label="Selected Work"
        index={1}
        title="Systems I've built."
        intro="Real-world systems. Research-driven ideas."
        action={{ href: "/work", label: "All work" }}
      />

      <Stagger as="ul" className="mt-14 border-t md:mt-20">
        {projects.map((project, i) => (
          <StaggerItem as="li" key={project.slug}>
            <ProjectCard project={project} index={i} href={`/work#${project.slug}`} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
