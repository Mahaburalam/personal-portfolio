import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import { Reveal } from "@/components/animations/reveal";
import { SectionLabel } from "@/components/layout/section-label";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { contactCopy } from "@/content/contact";
import { activeSocialLinks, profile } from "@/lib/site";

export function ContactCta() {
  const links = activeSocialLinks;

  return (
    <Section aria-labelledby="contact-title" className="py-24 md:py-36">
      <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <SectionLabel index={8} className="lg:col-span-3 lg:pt-4">
          Contact
        </SectionLabel>
        <div className="lg:col-span-9">
          <h2
            id="contact-title"
            className="max-w-4xl font-display text-4xl leading-[1.02] font-semibold tracking-tight sm:text-6xl xl:text-7xl"
          >
            {contactCopy.title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {contactCopy.intro}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnetic>
              <ButtonLink href="/contact" arrow>
                Start a conversation
              </ButtonLink>
            </Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center font-medium underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-current"
            >
              {profile.email}
            </a>
          </div>

          {links.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t pt-6">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="label-mono inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
