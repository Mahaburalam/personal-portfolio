"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Pauses the hero signature's looping CSS animations (`[data-paused]`) while it is offscreen. */
export function HeroSignatureMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) delete root.dataset.paused;
      else root.dataset.paused = "";
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
