import { cn } from "@/lib/utils";

/**
 * Bracket monogram `[MA·]`. Letters and brackets use currentColor; the token dot uses `signal`.
 * Decorative — the wrapping link carries the accessible name. Hover reacts to a parent `.group`.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" aria-hidden className={cn("h-8 w-12 overflow-visible", className)}>
      <path
        d="M7 1H1v6M41 1h6v6M1 25v6h6M47 25v6h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
        className="origin-center opacity-50 transition-[opacity,scale] duration-300 ease-out-expo transform-view group-hover:scale-[1.08] group-hover:opacity-100"
      />
      <text
        x="22.5"
        y="21.5"
        textAnchor="middle"
        fill="currentColor"
        className="font-display text-[15px] font-semibold tracking-tight"
      >
        MA
      </text>
      <rect x="36" y="18.5" width="3" height="3" className="fill-signal" />
    </svg>
  );
}
