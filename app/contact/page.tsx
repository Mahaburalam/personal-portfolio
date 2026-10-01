import type { Metadata } from "next";
import { Reveal } from "@/components/animations/reveal";
import { AgentBrief } from "@/components/contact/agent-brief";
import { AvailabilityStatus } from "@/components/contact/availability-status";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { contactCopy, formCopy } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: contactCopy.intro,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader label="Contact" index={6} title={contactCopy.title} intro={contactCopy.intro}>
        <AvailabilityStatus />
      </PageHeader>

      <Section aria-label="Contact options" className="border-t-0 pt-0 md:pt-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-8">
            <section
              aria-labelledby="form-title"
              className="rounded-lg border bg-card p-5 sm:p-8 lg:p-10"
            >
              <h2 id="form-title" className="label-mono mb-8 text-foreground">
                {formCopy.heading}
              </h2>
              <ContactForm />
            </section>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <aside aria-labelledby="channels-title" className="lg:sticky lg:top-24">
              <ContactChannels />
            </aside>
          </Reveal>
        </div>
      </Section>

      <AgentBrief />
    </>
  );
}
