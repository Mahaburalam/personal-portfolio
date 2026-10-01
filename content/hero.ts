/** Pipeline stages under the hero visual — also the visual's text equivalent. */
export const heroStages = ["Image", "Visual Tokens", "Reasoning", "Intelligent Output"] as const;

/**
 * First panel of the hero visual; the token panels are sampled from it. Portrait crop of
 * "FrankfurterAllee&Fernsehturm.jpg" by Porsche997SBS, Wikimedia Commons, CC0 (no attribution
 * required). Swap for the owner's own photo any time.
 */
export const heroVisual = { image: "/hero/street.jpg" } as const;
