import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { profile } from "@/lib/site";
import { HeroPipeline } from "./hero-pipeline";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-14 pb-20 md:pt-24 md:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 xl:col-span-7">
          <p className="label-mono text-muted-foreground">{profile.labels.join(" · ")}</p>

          <h1 id="hero-title" className="mt-6">
            <span className="block font-display text-5xl leading-[0.95] font-semibold tracking-tight uppercase sm:text-6xl xl:text-7xl">
              {profile.name}
            </span>
            <span className="label-mono mt-5 block text-sm text-accent">{profile.role}</span>
          </h1>

          <p className="mt-10 max-w-xl font-display text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
            {profile.statement}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.summary}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/work" arrow>
              Explore Work
            </ButtonLink>
            <ButtonLink href="/research" variant="outline" arrow>
              Research
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-lg gap-4 border-t pt-6 sm:grid-cols-2">
            <div>
              <dt className="label-mono text-muted-foreground">Currently</dt>
              <dd className="mt-1 text-sm font-medium">{profile.current}</dd>
            </div>
            <div>
              <dt className="label-mono text-muted-foreground">Research focus</dt>
              <dd className="mt-1 text-sm font-medium">{profile.researchFocus}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6 xl:col-span-5">
          <HeroPipeline />
        </div>
      </Container>
    </section>
  );
}
