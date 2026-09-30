import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export function Section({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section className={cn("border-t py-20 md:py-28", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
