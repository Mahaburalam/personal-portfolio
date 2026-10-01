import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
  /** When set, the whole row links here. */
  href?: string;
  className?: string;
};

/** Editorial project row: index + metadata rail, display title, tags. */
export function ProjectCard({ project, index, href, className }: ProjectCardProps) {
  const meta = [project.category, project.year, project.role].filter(Boolean);

  const body = (
    <div className="grid gap-5 py-8 md:py-10 lg:grid-cols-12 lg:gap-8">
      <div className="flex items-baseline gap-4 lg:col-span-3 lg:flex-col lg:gap-2">
        <span className="label-mono text-foreground/40">{String(index + 1).padStart(2, "0")}</span>
        <span className="label-mono text-muted-foreground">{meta.join(" · ")}</span>
      </div>

      <div className="lg:col-span-6">
        <h3
          className={cn(
            "font-display text-2xl font-semibold tracking-tight sm:text-4xl",
            href && "transition-colors duration-200 group-hover:text-accent",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{project.summary}</p>
      </div>

      <div className="flex items-start justify-between gap-4 lg:col-span-3">
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
        {href && (
          <ArrowUpRight
            aria-hidden
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        )}
      </div>
    </div>
  );

  return (
    <article className={cn("border-b", className)}>
      {href ? (
        <Link href={href} className="group block">
          {body}
        </Link>
      ) : (
        body
      )}
    </article>
  );
}
