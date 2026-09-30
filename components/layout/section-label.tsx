import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SectionLabelProps = ComponentProps<"p"> & {
  /** Rendered as `LABEL / 01` */
  index?: number;
};

export function SectionLabel({ index, className, children, ...props }: SectionLabelProps) {
  return (
    <p className={cn("label-mono text-muted-foreground", className)} {...props}>
      {children}
      {index !== undefined && (
        <span className="text-foreground/40"> / {String(index).padStart(2, "0")}</span>
      )}
    </p>
  );
}
