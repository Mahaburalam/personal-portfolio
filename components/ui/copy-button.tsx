"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  /** Accessible name, e.g. "Copy email address". */
  label: string;
  className?: string;
};

/** Copies `text` to the clipboard and confirms for two seconds. */
export function CopyButton({ text, label, className }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const id = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(id);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={cn(
        "label-mono inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-muted-foreground transition-colors duration-200 hover:text-foreground",
        className,
      )}
    >
      {state === "copied" ? (
        <Check aria-hidden className="size-3.5 text-signal" />
      ) : (
        <Copy aria-hidden className="size-3.5" />
      )}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
      </span>
    </button>
  );
}
