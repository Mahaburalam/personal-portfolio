import { ArrowUpRight } from "lucide-react";
import { publications } from "@/content/credentials";
import { cn } from "@/lib/utils";

/** Paper-style list of verified publications. Renders nothing until one exists (CLAUDE.md §16). */
export function PublicationList({ className }: { className?: string }) {
  if (publications.length === 0) return null;

  return (
    <section
      aria-labelledby="publications-title"
      className={cn("rounded-md border bg-card p-6 sm:p-8", className)}
    >
      <h3 id="publications-title" className="label-mono text-muted-foreground">
        Publications
      </h3>
      <ol className="mt-6 divide-y border-t">
        {publications.map((pub, i) => (
          <li key={pub.title} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-6">
            <span className="label-mono text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <article>
              <p className="label-mono text-muted-foreground">
                {pub.venue} · <time>{pub.year}</time>
              </p>
              <h4 className="mt-2 font-display text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
                {pub.title}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {pub.authors.map((author, j) => (
                  <span key={author.name}>
                    {j > 0 && ", "}
                    <span className={cn(author.self && "font-semibold text-foreground")}>
                      {author.name}
                    </span>
                  </span>
                ))}
              </p>
              {pub.summary && (
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                  {pub.summary}
                </p>
              )}
              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold transition-colors hover:text-accent"
                >
                  View publication
                  <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">: {pub.title}</span>
                </a>
              )}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
