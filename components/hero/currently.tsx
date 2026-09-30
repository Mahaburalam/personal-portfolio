import { SectionLabel } from "@/components/layout/section-label";
import { Section } from "@/components/layout/section";
import { currently } from "@/content/currently";

export function Currently() {
  return (
    <Section aria-labelledby="currently-title" className="py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-12">
        <SectionLabel id="currently-title" className="lg:col-span-3">
          Currently
        </SectionLabel>
        <ol className="divide-y lg:col-span-9">
          {currently.map((item, i) => (
            <li key={item} className="flex items-baseline gap-6 py-4 first:pt-0">
              <span className="label-mono text-muted-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl tracking-tight sm:text-2xl">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
