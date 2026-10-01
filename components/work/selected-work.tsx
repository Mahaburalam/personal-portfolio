import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { projects } from "@/content/projects";
import { ProjectTile } from "./project-tile";

export function SelectedWork() {
  return (
    <Section aria-labelledby="work-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeader
          variant="rail"
          id="work-title"
          label="Selected work"
          index={1}
          title="Featured projects and case studies."
          intro="Real-world solutions. Research-driven ideas."
          action={{ href: "/work", label: "View all work" }}
          className="lg:col-span-3"
        />

        <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem as="li" key={project.slug}>
              <ProjectTile project={project} href={`/work#${project.slug}`} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
