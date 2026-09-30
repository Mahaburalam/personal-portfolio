import Link from "next/link";
import { Container } from "@/components/layout/container";
import { navItems, profile, socialLinks } from "@/lib/site";

export function SiteFooter() {
  const links = socialLinks.filter((l): l is { label: string; href: string } => !!l.href);

  return (
    <footer className="border-t py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-display text-sm font-semibold tracking-[0.18em] uppercase">
            {profile.name}
          </p>
          <p className="label-mono text-muted-foreground">{profile.role}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[...navItems, ...links].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="label-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="label-mono text-muted-foreground">© {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
}
