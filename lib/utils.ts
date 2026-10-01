import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom utilities from globals.css. `bg-grid` / `bg-spectrum` are background *images*; unregistered,
// tailwind-merge treats them as background colors and drops them next to `bg-card` (or drops `bg-card`).
// `text-spectrum` is a gradient text color, so it must replace (not sit beside) other text colors.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: { "bg-image": ["bg-grid", "bg-spectrum"], "text-color": ["text-spectrum"] },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
