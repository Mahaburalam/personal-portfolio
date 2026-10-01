import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tagVariants = cva("inline-flex items-center rounded-sm border text-muted-foreground", {
  variants: {
    variant: {
      /** Mono uppercase metadata label. */
      label: "label-mono px-2 py-1",
      /** Small normal-case topic chip (homepage tiles and research columns). */
      chip: "px-2 py-0.5 font-mono text-[11px] leading-5",
    },
  },
  defaultVariants: { variant: "label" },
});

export function Tag({
  variant,
  className,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return <span className={cn(tagVariants({ variant }), className)} {...props} />;
}
