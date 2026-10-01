import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { services, servicesCopy } from "@/content/services";

export function ServicesPreview() {
  return (
    <Section aria-labelledby="services-title">
      <SectionHeader
        id="services-title"
        label="Services"
        index={4}
        title={servicesCopy.title}
        intro={servicesCopy.intro}
        action={{ href: "/services", label: "Services" }}
      />

      <Stagger as="ul" className="mt-14 grid border-t border-l sm:grid-cols-2 md:mt-20">
        {services.map((service, i) => (
          <StaggerItem
            as="li"
            key={service.slug}
            className="flex flex-col border-r border-b p-6 sm:p-8 lg:p-10"
          >
            <span className="label-mono text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-8 font-display text-xl font-semibold tracking-tight sm:text-2xl">
              {service.title}
            </h3>
            <p className="mt-3 mb-8 max-w-md leading-relaxed text-muted-foreground">
              {service.summary}
            </p>
            <ul className="mt-auto space-y-2 border-t pt-5">
              {service.capabilities.map((c) => (
                <li key={c} className="label-mono flex items-center gap-3 text-muted-foreground">
                  <span aria-hidden className="h-px w-3 bg-border" />
                  {c}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
