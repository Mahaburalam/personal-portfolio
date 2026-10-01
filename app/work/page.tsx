import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/work/project-card";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Portfolio" };

// Project index. Case studies (/work/[slug], MDX) land in Phase 4 (CLAUDE.md §20).
export default function WorkPage() {
  return (
    <>
      <PageHeader
        label="Portfolio"
        title="Featured projects and case studies."
        intro="Real-world systems. Research-driven ideas. Built with modern technologies."
      />
      <Section aria-labelledby="projects-title" className="border-t-0 pt-0 md:pt-0">
        <h2 id="projects-title" className="sr-only">
          All projects
        </h2>
        <ul className="border-t">
          {projects.map((project, i) => (
            <li key={project.slug} id={project.slug} className="scroll-mt-24">
              <ProjectCard project={project} index={i} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
