import { Section } from "@/components/layout/section";
import { signalStages, signalWords } from "@/content/signal";
import { SignalWaves } from "./signal-waves";

/** Decorative prelude to the footer: an image read into tokens, reasoned over, decoded to words (CLAUDE.md §8). */
export function SignalBand() {
  return (
    <Section aria-labelledby="signal-caption" className="overflow-hidden py-12 md:py-20">
      <figure>
        <SignalWaves words={signalWords} stages={signalStages} />
        <figcaption
          id="signal-caption"
          className="label-mono mt-6 flex flex-wrap gap-x-3 text-muted-foreground"
        >
          <span className="text-foreground/40">Image → tokens → reasoning →</span>
          <span className="tracking-normal normal-case">“{signalWords.join(" ")}”</span>
        </figcaption>
      </figure>
    </Section>
  );
}
