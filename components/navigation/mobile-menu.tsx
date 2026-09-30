"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";
import { isActive } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

const ease = [0.16, 1, 0.3, 1] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc closes; Tab is trapped inside the panel.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>("a, button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        className="inline-flex size-11 items-center justify-center rounded-md"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            onKeyDown={onKeyDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease }}
            className="bg-background fixed inset-0 z-50 flex flex-col px-5 pt-4 pb-8 sm:px-8"
          >
            <div className="flex h-12 items-center justify-between">
              <span className="font-display text-sm font-semibold tracking-[0.18em] uppercase">
                Mahabur Alam
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-md"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-12 flex-1">
              <ul className="space-y-1">
                {navItems.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease, delay: 0.05 + i * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "font-display flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-tight",
                          active ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        <span className="label-mono text-muted-foreground/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="label-mono text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
