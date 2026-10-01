import Link from "next/link";
import { Container } from "@/components/layout/container";
import { activeSocialLinks, navItems, profile } from "@/lib/site";

export function SiteFooter() {
  const links = activeSocialLinks;

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
                  className="label-mono text-muted-foreground transition-colors hover:text-foreground"
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
