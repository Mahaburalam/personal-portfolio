import { Reveal } from "@/components/animations/reveal";
import { SectionLabel } from "@/components/layout/section-label";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { about } from "@/content/about";

export function AboutPreview() {
  return (
    <Section aria-labelledby="about-title">
      <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <SectionLabel index={7} className="lg:col-span-3 lg:pt-3">
          About
        </SectionLabel>
        <div className="lg:col-span-9">
          <h2
            id="about-title"
            className="max-w-4xl font-display text-3xl leading-[1.1] font-semibold tracking-tight sm:text-5xl"
          >
            {about.headline}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {about.focus}
          </p>
          <ButtonLink href="/about" variant="outline" arrow className="mt-10">
            More about me
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
