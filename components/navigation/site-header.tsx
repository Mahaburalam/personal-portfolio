import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-sm font-semibold tracking-[0.18em] uppercase">
          Mahabur Alam
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
