import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { skillGroups, skillsCopy } from "@/content/skills";

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
        {skillGroups.map((group, i) => (
          <StaggerItem as="li" key={group.slug} className="border-t pt-6">
            <p className="label-mono flex items-baseline justify-between text-accent">
              {group.verb}
              <span className="text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
            </p>
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
              {group.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{group.description}</p>
            {group.tools.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
                {group.tools.map((tool) => (
                  <li key={tool} className="label-mono text-muted-foreground">
                    {tool}
                  </li>
                ))}
              </ul>
            )}
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
