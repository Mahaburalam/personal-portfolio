import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { services, servicesCopy } from "@/content/services";

export function ServicesPreview() {
  return (
    <Section aria-labelledby="services-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeader
          variant="rail"
          id="services-title"
          label="Services"
          index={5}
          title={servicesCopy.title}
          intro={servicesCopy.intro}
          action={{ href: "/services", label: "All services" }}
          className="lg:col-span-3"
        />

        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:col-span-9">
          {services.map((service, i) => (
            <StaggerItem
              as="li"
              key={service.slug}
              className="flex flex-col rounded-lg border bg-card p-6 transition-colors duration-300 hover:border-foreground/25 sm:p-8"
            >
              <span className="label-mono text-foreground/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {service.summary}
              </p>
              <ul className="mt-auto space-y-2 border-t pt-5">
                {service.capabilities.map((c) => (
                  <li key={c} className="label-mono flex items-center gap-3 text-muted-foreground">
                    <span aria-hidden className="bg-spectrum h-px w-3" />
                    {c}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
