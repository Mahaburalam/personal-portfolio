import { availability } from "@/content/contact";
import { cn } from "@/lib/utils";

/** "● Open to …" status line. The dot pulses (static under reduced motion). */
export function AvailabilityStatus({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "label-mono inline-flex items-center gap-3 rounded-full border bg-card px-4 py-2 text-foreground",
        className,
      )}
    >
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-signal" />
      </span>
      {availability}
    </p>
  );
}
