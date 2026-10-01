import type { Skill } from "@/content/skills";
import { cn } from "@/lib/utils";
import { TechIcon } from "./tech-icon";

type SkillChipProps = {
  skill: Skill;
  /** Position in the list — staggers the hover ripple. */
  index: number;
};

/**
 * Compact technical tag. Featured skills get more ink, never a rating.
 * Reacts to the parent card's `group/card` active state (skills-graph.tsx).
 */
export function SkillChip({ skill, index }: SkillChipProps) {
  return (
    <span
      style={{ transitionDelay: `${index * 20}ms` }}
      className={cn(
        "flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-xs leading-tight transition-[color,border-color,background-color] duration-300 ease-out-expo",
        skill.featured
          ? "border-foreground/20 bg-muted/60 font-medium text-foreground"
          : "text-muted-foreground group-data-[active=true]/card:text-foreground",
        "group-data-[active=true]/card:border-foreground/30",
      )}
    >
      {skill.icon && (
        <TechIcon
          icon={skill.icon}
          className={cn(
            "transition-[translate,color] duration-300 ease-out-expo group-data-[active=true]/card:-translate-y-px group-data-[active=true]/card:text-accent",
            skill.featured && "text-accent",
          )}
        />
      )}
      {skill.name}
    </span>
  );
}
