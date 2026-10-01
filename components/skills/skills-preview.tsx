import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { skillCategories, skillsCopy } from "@/content/skills";

/** Homepage teaser (CLAUDE.md §8): categories + a few skills each; the full ecosystem is /skills. */
export function SkillsPreview() {
  return (
    <Section aria-labelledby="skills-title">
      <SectionHeader
        id="skills-title"
        label="Skills"
        index={5}
        title={skillsCopy.title}
        intro={skillsCopy.intro}
        action={{ href: "/skills", label: "All skills" }}
      />

      <Stagger
        as="ol"
        className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
      >
        {skillCategories.map((category, i) => {
          const highlights = [
            ...category.skills.filter((skill) => skill.featured),
            ...category.skills.filter((skill) => !skill.featured),
          ].slice(0, 3);
          return (
            <StaggerItem as="li" key={category.id} className="border-t pt-6">
              <p className="label-mono flex items-baseline justify-between text-accent">
                {category.stance}
                <span className="text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
              </p>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                {category.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
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
    </Section>
  );
}
