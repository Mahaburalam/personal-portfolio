import { profile } from "@/lib/site";
import { cn } from "@/lib/utils";

/* "Shared Apex" MA mark — same outlined paths as public/brand/ma-symbol.svg (CLAUDE.md §6). */
const LETTERS =
  "M2.89 8L8.89 8L8.89 32.2L2.89 32.2ZM9.22 8L17.09 31.24L26.17 8L32.61 8L45.11 40L38.67 40L29.39 16.25L20.11 40L13.72 40L2.89 8Z";
const CURSOR = "M25.75 31.2h7.28v3.6h-7.28Z";
const TOKEN = "M2.89 34h6v6h-6Z";

/** The MA symbol alone. Ink uses currentColor; the token patch uses `signal`. Decorative. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="2.89 8 42.22 32" aria-hidden className={cn("h-5.5 w-auto shrink-0", className)}>
      <path d={LETTERS} fill="currentColor" />
      <path d={CURSOR} fill="currentColor" className="group-hover:animate-cursor-blink" />
      <path d={TOKEN} className="fill-signal" />
    </svg>
  );
}

/**
 * Mark + name. Decorative — the wrapping link carries the accessible name.
 * Hover (parent `.group`) blinks the A's cursor bar.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[15px] font-semibold tracking-tight">{profile.name}</span>
    </span>
  );
}
