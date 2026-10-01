import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";
import { coverMotif, ProjectCover } from "./project-cover";

type ProjectTileProps = {
  project: Project;
  href: string;
  className?: string;
};

/** Homepage project card: cover, category chip, title, summary, tags, meta + "View case". */
export function ProjectTile({ project, href, className }: ProjectTileProps) {
  // Only verified facts — unknown year / context simply don't render (CLAUDE.md §16).
  const meta = [project.year, project.context].filter(Boolean);

  return (
    <article className={cn("h-full", className)}>
      <Link
        href={href}
        className="group flex h-full flex-col rounded-lg border bg-card p-3 transition-[border-color,transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:border-foreground/25 hover:shadow-xl hover:shadow-foreground/5"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-md border">
          {project.cover ? (
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
            />
          ) : (
            <ProjectCover
              slug={project.slug}
              motif={coverMotif(project.category)}
              className="transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
            />
          )}
          <span className="label-mono absolute top-2.5 left-2.5 rounded-sm border bg-background/85 px-2 py-1 text-foreground backdrop-blur-sm">
            {project.badge ?? project.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-2 pt-5 pb-2">
          <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Tag variant="chip">{tag}</Tag>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs">
            <span className="label-mono text-muted-foreground">{meta.join(" · ")}</span>
            <span className="inline-flex items-center gap-1.5 font-medium transition-colors group-hover:text-accent">
              View case
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
