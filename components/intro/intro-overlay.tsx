import type { CSSProperties } from "react";
import { LogoMark } from "@/components/navigation/logo";
import { profile } from "@/lib/site";
import { introScript } from "./intro-script";

/**
 * First-load typographic intro (CLAUDE.md §10). Pure CSS animation, hidden unless the inline script
 * sets `html[data-intro]` — so no-JS visitors, reduced motion and repeat visits never see it.
 * Decorative: the page's real `h1` lives in the hero underneath.
 */
export function IntroOverlay() {
  const letters = Array.from(profile.name);

  return (
    <>
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: introScript }} />
      <div
        aria-hidden
        className="intro fixed inset-0 z-[90] hidden place-items-center bg-background px-5"
      >
        <div className="intro-content flex flex-col items-start">
          <LogoMark className="intro-mark h-9 sm:h-11" />

          <p className="mt-7 flex font-display text-4xl leading-none font-semibold tracking-tight uppercase sm:text-6xl">
            {letters.map((char, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
                <span className="intro-letter inline-block" style={{ "--i": i } as CSSProperties}>
                  {char === " " ? "\u00a0" : char}
                </span>
              </span>
            ))}
          </p>

          <span className="intro-line mt-5 block h-px w-full bg-foreground" />
          <p className="intro-role label-mono mt-4 text-muted-foreground">{profile.role}</p>
        </div>
      </div>
    </>
  );
}
