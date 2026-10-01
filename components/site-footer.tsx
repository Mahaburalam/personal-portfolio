import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/navigation/logo";
import { SocialIcon } from "@/components/ui/social-icon";
import { activeSocialLinks, navItems, profile } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Link
            href="/"
            aria-label={`${profile.name} — home`}
            className="group -ml-1 inline-flex h-11 items-center justify-self-start px-1"
          >
            <Logo />
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 md:justify-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="label-mono inline-flex h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="-ml-3 flex items-center gap-1 md:-mr-3 md:ml-0 md:justify-self-end">
            {activeSocialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${link.label} (opens in new tab)`}
                  title={link.label}
                  className="group grid size-11 place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                >
                  <SocialIcon
                    icon={link.icon}
                    className="transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="label-mono text-muted-foreground">{profile.role}</p>
        </div>
      </Container>
    </footer>
  );
}
