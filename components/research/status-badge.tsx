import type { ResearchStatus } from "@/content/research";
import { cn } from "@/lib/utils";

const live: ResearchStatus[] = ["experiment", "ongoing"];

/** Research status chip. Active work gets a pulsing signal dot (static under reduced motion). */
export function StatusBadge({ status, className }: { status: ResearchStatus; className?: string }) {
  const isLive = live.includes(status);

  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-2 rounded-sm border bg-background px-2 py-1",
        isLive ? "border-signal/40 text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          isLive ? "animate-pulse bg-signal motion-reduce:animate-none" : "bg-muted-foreground",
        )}
      />
      <span className="sr-only">Status: </span>
      {status}
    </span>
  );
}
