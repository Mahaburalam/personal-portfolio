import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group inline-flex min-h-11 items-center gap-2 rounded-md px-5 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background hover:bg-accent hover:text-accent-foreground",
        outline: "border border-border text-foreground hover:border-foreground",
        ghost: "px-0 text-foreground hover:text-accent",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { arrow?: boolean };

/** Link styled as a button. `arrow` adds the signature → that nudges on hover. */
export function ButtonLink({ variant, arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}
