import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { skillCategories, skillsCopy } from "@/content/skills";

/** Homepage teaser (CLAUDE.md §8): categories + a few skills each; the full ecosystem is /skills. */
export function SkillsPreview() {
  return (
    <Section aria-labelledby="skills-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeader
          variant="rail"
          id="skills-title"
          label="Skills"
          index={6}
          title={skillsCopy.title}
          intro={skillsCopy.intro}
          action={{ href: "/skills", label: "All skills" }}
          className="lg:col-span-3"
        />

        <Stagger as="ol" className="grid gap-4 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-4">
          {skillCategories.map((category, i) => {
            const highlights = [
              ...category.skills.filter((skill) => skill.featured),
              ...category.skills.filter((skill) => !skill.featured),
            ].slice(0, 3);
            return (
              <StaggerItem
                as="li"
                key={category.id}
                className="flex flex-col rounded-lg border bg-card p-5"
              >
                <p className="label-mono flex items-baseline justify-between text-accent">
                  {category.stance}
                  <span className="text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
                </p>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
                  {category.title}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {highlights.map((skill) => (
                    <li key={skill.name} className="label-mono text-muted-foreground">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
