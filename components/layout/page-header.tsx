import { Container } from "./container";
import { SectionLabel } from "./section-label";

type PageHeaderProps = { label: string; title: string; intro?: string };

export function PageHeader({ label, title, intro }: PageHeaderProps) {
  return (
    <header className="pt-16 pb-12 md:pt-24 md:pb-16">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <h1 className="font-display mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">{intro}</p>
        )}
      </Container>
    </header>
  );
}
