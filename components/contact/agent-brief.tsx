import { Reveal } from "@/components/animations/reveal";
import { SectionLabel } from "@/components/layout/section-label";
import { Section } from "@/components/layout/section";
import { CopyButton } from "@/components/ui/copy-button";
import { agentBriefCopy, buildAgentBrief } from "@/content/contact";
import { cn } from "@/lib/utils";

export function AgentBrief() {
  const brief = buildAgentBrief();

  return (
    <Section aria-labelledby="agent-brief-title">
      <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionLabel>{agentBriefCopy.label}</SectionLabel>
          <h2
            id="agent-brief-title"
            className="mt-6 font-display text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl"
          >
            {agentBriefCopy.title}
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">
            {agentBriefCopy.intro}
          </p>
        </div>

        <figure
          aria-label="Contact brief for AI agents"
          className="overflow-hidden rounded-lg border bg-card lg:col-span-8"
        >
          <div className="flex items-center justify-between border-b py-1 pr-2 pl-5">
            <p className="label-mono flex items-center gap-3 text-muted-foreground">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2 rounded-full bg-border" />
                <span className="size-2 rounded-full bg-border" />
                <span className="size-2 rounded-full bg-border" />
              </span>
              CONTACT.md
            </p>
            <CopyButton text={brief} label="Copy agent brief" />
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed sm:p-6">
            <code>
              {brief.split("\n").map((line, i) => (
                <span
                  key={i}
                  className={cn(
                    "block min-h-[1lh]",
                    line.startsWith("#")
                      ? "text-accent"
                      : /^(\d\.|-)/.test(line)
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {line}
                </span>
              ))}
            </code>
          </pre>
        </figure>
      </Reveal>
    </Section>
  );
}
