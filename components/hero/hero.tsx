import { Magnetic } from "@/components/animations/magnetic";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { heroHeadline, heroLabels } from "@/content/hero";
import { profile } from "@/lib/site";
import { HeroSignature } from "./hero-signature";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pt-14 pb-20 md:pt-24 md:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="label-mono text-muted-foreground">{profile.role}</p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-4xl leading-[1.04] font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-[2.75rem] xl:text-[3.75rem]"
          >
            <span className="sr-only">{profile.name} — </span>
            <span className="block">{heroHeadline.lead}</span>
            <span className="block">
              <span className="text-spectrum">{heroHeadline.emphasis}</span> {heroHeadline.tail}
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.summary}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <ButtonLink href="/work" arrow>
                Explore Work
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/research" variant="outline" arrow>
                Research
              </ButtonLink>
            </Magnetic>
          </div>

          <ul
            className="label-mono mt-10 flex flex-wrap gap-x-2.5 gap-y-2 tracking-[0.1em] text-muted-foreground"
            aria-label="Focus areas"
          >
            {heroLabels.map((label, i) => (
              <li key={label} className="flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden className="text-foreground/30">
                    ·
                  </span>
                )}
                {label}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-2 border-t pt-6 text-sm">
            <div className="flex items-center gap-2.5">
              <dt className="flex items-center gap-2.5 text-muted-foreground">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-signal/60 motion-reduce:animate-none" />
                  <span className="relative size-2 rounded-full bg-signal" />
                </span>
                Currently:
              </dt>
              <dd className="font-medium">{profile.current}</dd>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 pl-[1.125rem]">
              <dt className="text-muted-foreground">Research focus:</dt>
              <dd className="font-medium">{profile.researchFocus}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6">
          <HeroSignature />
        </div>
      </Container>
    </section>
  );
}
