import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./section-label";

type SectionHeaderProps = {
  /** Id of the `h2`; pass the same value to the section's `aria-labelledby`. */
  id: string;
  label: string;
  index?: number;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  className?: string;
};

/** Homepage section header: mono label in a 3-col rail, display heading in the other 9. */
export function SectionHeader({
  id,
  label,
  index,
  title,
  intro,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal className={cn("grid gap-6 lg:grid-cols-12 lg:gap-8", className)}>
      <SectionLabel index={index} className="lg:col-span-3 lg:pt-3">
        {label}
      </SectionLabel>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:col-span-9">
        <div className="max-w-3xl">
          <h2
            id={id}
            className="font-display text-3xl leading-[1.05] font-semibold tracking-tight sm:text-5xl"
          >
            {title}
          </h2>
          {intro && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
          )}
        </div>
        {action && (
          <ButtonLink href={action.href} variant="ghost" arrow className="shrink-0">
            {action.label}
          </ButtonLink>
        )}
      </div>
    </Reveal>
  );
}
