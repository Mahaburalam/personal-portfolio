import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom utilities from globals.css. `bg-grid` is a background *image*; unregistered, tailwind-merge
// treats it as a background color and drops it next to `bg-card` (or drops `bg-card` instead).
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "bg-image": ["bg-grid"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
