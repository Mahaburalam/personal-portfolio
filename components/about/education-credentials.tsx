import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { credentialsCopy } from "@/content/about";
import { certifications, education } from "@/content/credentials";

/** Education and certifications as two quiet columns — part of the story, not a resume dump. */
export function EducationCredentials() {
  return (
    <Section aria-labelledby="education-title">
      <SectionHeader
        id="education-title"
        label="Education"
        index={4}
        title={credentialsCopy.title}
        intro={credentialsCopy.intro}
      />

      <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5 lg:col-start-4">
          <section aria-labelledby="education-list-title">
            <h3 id="education-list-title" className="label-mono text-muted-foreground">
              Education
            </h3>
            <ul className="mt-6">
              {education.map((item) => {
                const program = [item.degree, item.field].filter(Boolean).join(", ");
                return (
                  <li key={item.institution} className="border-t pt-6">
                    <p className="font-display text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                      {item.institution}
                    </p>
                    {program && <p className="mt-3 font-medium text-muted-foreground">{program}</p>}
                    {item.period && (
                      <p className="label-mono mt-3 text-muted-foreground">{item.period}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-4">
          <section aria-labelledby="certifications-title">
            <h3 id="certifications-title" className="label-mono text-muted-foreground">
              Courses & certifications
            </h3>
            <ul className="mt-6">
              {certifications.map((cert) => (
                <li key={cert.name} className="border-t pt-6">
                  <p className="font-display text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
                    {cert.name}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {cert.provider}
                    {cert.partner && <> · {cert.partner}</>}
                  </p>
                  <dl className="label-mono mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                    <dt className="text-foreground/40">Issued</dt>
                    <dd className="text-muted-foreground">
                      <time dateTime={cert.issuedIso}>{cert.issued}</time>
                    </dd>
                    {cert.credentialId && (
                      <>
                        <dt className="text-foreground/40">Credential</dt>
                        <dd className="break-all text-muted-foreground">{cert.credentialId}</dd>
                      </>
                    )}
                  </dl>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold transition-colors hover:text-accent"
                    >
                      Verify credential
                      <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only">: {cert.name}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </Section>
  );
}
