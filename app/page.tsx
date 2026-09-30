import { Currently } from "@/components/hero/currently";
import { Hero } from "@/components/hero/hero";

// Remaining homepage sections land in Phases 4–9 (CLAUDE.md §8).
export default function HomePage() {
  return (
    <>
      <Hero />
      <Currently />
    </>
  );
}
