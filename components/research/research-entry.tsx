import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ResearchItem } from "@/content/research";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

type ResearchEntryProps = {
  item: ResearchItem;
  index: number;
  /** When set, the whole entry links here. */
  href?: string;
  className?: string;
};

/** Lab-notebook entry: `R/01` id, status, title, abstract line, hashtags. */
export function ResearchEntry({ item, index, href, className }: ResearchEntryProps) {
  const body = (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <span className="label-mono text-muted-foreground">
          R/{String(index + 1).padStart(2, "0")}
        </span>
        <StatusBadge status={item.status} />
      </div>

      <h3
        className={cn(
          "mt-10 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
          href && "transition-colors duration-200 group-hover:text-accent",
        )}
      >
        {item.title}
      </h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{item.summary}</p>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-dashed pt-5">
        <ul className="flex flex-wrap gap-x-3 gap-y-1" aria-label="Topics">
          {item.tags.map((tag) => (
            <li key={tag} className="label-mono tracking-normal text-muted-foreground normal-case">
              #{tag}
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

  const frame = "bg-card/80 block h-full rounded-md border border-dashed";

  return (
    <article className={cn("h-full", className)}>
      {href ? (
        <Link
          href={href}
          className={cn(frame, "group transition-colors duration-200 hover:border-foreground/40")}
        >
          {body}
        </Link>
      ) : (
        <div className={frame}>{body}</div>
      )}
    </article>
  );
}
