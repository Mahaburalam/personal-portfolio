import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe `prefers-reduced-motion`. Motion's `useReducedMotion` reads the media query on the
 * client's first render, so markup that depends on it (e.g. `initial={reduce ? false : …}`) no longer
 * matches the server HTML. This returns `false` during SSR and hydration, then the real value.
 * Use this instead of Motion's hook (CLAUDE.md §10).
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(QUERY).matches,
    () => false,
  );
}
