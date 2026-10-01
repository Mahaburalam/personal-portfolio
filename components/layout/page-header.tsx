import type { ReactNode } from "react";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

type PageHeaderProps = {
  label: string;
  /** Rendered as `LABEL / 06` */
  index?: number;
  title: string;
  intro?: string;
  /** Extra content under the intro, e.g. a status line. */
  children?: ReactNode;
};

export function PageHeader({ label, index, title, intro, children }: PageHeaderProps) {
  return (
    <header className="pt-16 pb-12 md:pt-24 md:pb-16">
      <Container>
        <SectionLabel index={index}>{label}</SectionLabel>
        <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}
