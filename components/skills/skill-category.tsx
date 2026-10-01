import { Stagger, StaggerItem } from "@/components/animations/stagger";
import type { ReactNode } from "react";
import type { SkillCategory, SkillTier } from "@/content/skills";
import { cn } from "@/lib/utils";
import { SkillChip } from "./skill-chip";

const frames: Record<SkillTier, string> = {
  primary: "border bg-card",
  secondary: "border bg-background",
  // Research direction: dashed notebook card, like the research entries
  emerging: "bg-grid border border-dashed bg-card/80",
};

const markers: Record<SkillTier, string> = {
  primary: "size-1.5 rounded-full bg-accent",
  secondary: "h-px w-3 bg-foreground/40",
  emerging: "size-2 rounded-full border border-foreground/50",
};

type SkillCategoryCardProps = {
  category: SkillCategory;
  /** 0-based position in the visual order — rendered as `01`. */
  index: number;
  /** Decorative extra pinned to the card bottom (e.g. the CV patch scan). */
  visual?: ReactNode;
};

/**
 * One capability group on /skills. Focusable so keyboard and touch users get the same
 * highlight as hover; the active state comes from the `group/card` shell in skills-graph.tsx.
 */
export function SkillCategoryCard({ category, index, visual }: SkillCategoryCardProps) {
  const titleId = `skills-${category.id}-title`;
  const primary = category.tier === "primary";

  return (
    <article
      tabIndex={0}
      aria-labelledby={titleId}
      className={cn(
        "flex h-full flex-col rounded-md p-6 transition-[translate,border-color,background-color] duration-300 ease-out-expo sm:p-8",
        frames[category.tier],
        "group-data-[related=true]/card:border-foreground/25",
        "group-data-[active=true]/card:-translate-y-1 group-data-[active=true]/card:border-foreground/40 group-data-[active=true]/card:bg-muted/50",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className={cn("label-mono", primary ? "text-accent" : "text-foreground/40")}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="label-mono flex items-center gap-2 text-muted-foreground">
          <span aria-hidden className={markers[category.tier]} />
          {category.stance}
        </span>
      </div>

      <h3
        id={titleId}
        className={cn(
          "mt-8 font-display font-semibold tracking-tight transition-colors duration-200 group-data-[active=true]/card:text-accent",
          primary ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
        )}
      >
        {category.title}
      </h3>
      <p className="mt-3 max-w-prose leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      <div className="pt-6">
        <Stagger as="ul" className="flex flex-wrap gap-2">
          {category.skills.map((skill, i) => (
            <StaggerItem as="li" key={skill.name}>
              <SkillChip skill={skill} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {visual && <div className="mt-auto pt-8">{visual}</div>}
    </article>
  );
}
