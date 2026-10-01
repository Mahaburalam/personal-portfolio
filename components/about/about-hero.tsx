import { ArrowDown, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { Tag } from "@/components/ui/tag";
import { aboutHero } from "@/content/about";
import { profile } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * /about hero: the name as an editorial headline, the role, and the trajectory that connects
 * software engineering to AI research. The h1 is not animated — it is the LCP element.
 */
export function AboutHero() {
  const [first, ...rest] = profile.name.split(" ");
  const steps = aboutHero.trajectory;

  return (
    <header className="pt-16 pb-20 md:pt-24 md:pb-28">
      <Container>
        <SectionLabel index={5}>About</SectionLabel>

        <h1 className="mt-8 font-display text-[3.5rem] leading-[0.92] font-semibold tracking-tight sm:text-7xl lg:text-8xl xl:text-[8.5rem]">
          <span className="block sm:inline">{first}</span>{" "}
          <span className="block sm:inline">{rest.join(" ")}</span>
        </h1>
        <p className="mt-6 font-display text-2xl font-medium tracking-tight text-accent sm:text-4xl">
          {profile.role}
        </p>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {aboutHero.intro}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Areas">
              {aboutHero.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </div>

          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <div className="border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <p id="trajectory-title" className="label-mono text-muted-foreground">
                Trajectory
              </p>
              <ol
                aria-labelledby="trajectory-title"
                className="mt-5 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3 lg:flex-col lg:items-start lg:gap-2"
              >
                {steps.map((step, i) => {
                  const last = i === steps.length - 1;
                  return (
                    <li
                      key={step}
                      className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 lg:flex-col lg:items-start lg:gap-2"
                    >
                      <span
                        className={cn(
                          "label-mono inline-flex items-center gap-2",
                          last ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {last && (
                          <span
                            aria-hidden
                            className="size-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none"
                          />
                        )}
                        {step}
                        {last && <span className="sr-only"> (current focus)</span>}
                      </span>
                      {!last && (
                        <>
                          <ArrowDown
                            aria-hidden
                            className="size-3.5 text-foreground/30 md:hidden lg:block"
                          />
                          <ArrowRight
                            aria-hidden
                            className="hidden size-3.5 text-foreground/30 md:block lg:hidden"
                          />
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>
        </div>
      </Container>
    </header>
  );
}
