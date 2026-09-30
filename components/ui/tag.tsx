import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "label-mono text-muted-foreground inline-flex items-center rounded-sm border px-2 py-1",
        className,
      )}
      {...props}
    />
  );
}
