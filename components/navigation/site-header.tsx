import Link from "next/link";
import { Container } from "@/components/layout/container";
import { profile } from "@/lib/site";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label={`${profile.name} — home`}
          className="group -ml-1 inline-flex h-11 items-center px-1"
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <NavLinks />
          <ThemeToggle className="ml-2" />
        </nav>

        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
