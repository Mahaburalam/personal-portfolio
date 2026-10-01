import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { experienceCopy } from "@/content/about";
import { roles } from "@/content/experience";
import { socialLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Roles, most recent first. Unknown fields are omitted rather than shown as placeholders. */
export function ExperienceTimeline() {
  const linkedin = socialLinks.find((l) => l.icon === "linkedin")?.href;

  return (
    <Section aria-labelledby="experience-title">
      <SectionHeader
        id="experience-title"
        label="Experience"
        index={2}
        title={experienceCopy.title}
        intro={experienceCopy.intro}
      />

      <Stagger as="ol" className="mt-14 border-t md:mt-20">
        {roles.map((role) => {
          const meta = [role.org, role.location].filter(Boolean).join(" · ");
          return (
            <StaggerItem
              as="li"
              key={`${role.title}-${role.org ?? ""}-${role.period ?? ""}`}
              className="grid gap-5 border-b py-10 md:py-14 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-3">
                {role.current ? (
                  <p className="label-mono inline-flex items-center gap-2 text-foreground">
                    <span
                      aria-hidden
                      className="size-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none"
                    />
                    Present
                    {role.period && <span className="text-muted-foreground">· {role.period}</span>}
                  </p>
                ) : (
                  role.period && <p className="label-mono text-muted-foreground">{role.period}</p>
                )}
              </div>

              <div
                className={cn(
                  "lg:col-span-9",
                  role.current && "border-l-2 border-accent pl-5 sm:pl-8",
                )}
              >
                {role.current && <p className="label-mono text-accent">Current role</p>}
                <h3
                  className={cn(
                    "font-display font-semibold tracking-tight",
                    role.current ? "mt-2 text-3xl sm:text-5xl" : "text-2xl sm:text-3xl",
                  )}
                >
                  {role.title}
                </h3>
                {meta && <p className="mt-3 font-medium text-muted-foreground">{meta}</p>}
                {role.summary && (
                  <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                    {role.summary}
                  </p>
                )}
                {role.highlights && role.highlights.length > 0 && (
                  <ul className="mt-6 max-w-2xl space-y-2">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex gap-3 leading-relaxed text-muted-foreground">
                        <span aria-hidden className="text-foreground/30">
                          —
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {linkedin && (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="label-mono mt-6 inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground lg:col-span-9 lg:col-start-4"
          >
            Full history on LinkedIn
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </div>
      )}
    </Section>
  );
}
