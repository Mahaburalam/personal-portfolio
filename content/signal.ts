import { profile } from "@/lib/site";

/** Output tokens of the homepage signal band (CLAUDE.md §8): the brand statement, word by word. */
export const signalWords = profile.statement.split(" ");

/** Stage labels under the band — the hero signature, shortened. */
export const signalStages = ["Image → Patches", "Visual tokens", "Reasoning", "Output"];
