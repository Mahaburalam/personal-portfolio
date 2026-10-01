export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Research", href: "/research" },
  { label: "Service", href: "/services" },
  { label: "Skill", href: "/skills" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const profile = {
  name: "Mahabur Alam",
  role: "AI Researcher & Engineer",
  statement: "From ideas to intelligent systems.",
  summary:
    "Building intelligent systems at the intersection of Computer Vision, Multimodal AI and software engineering.",
  labels: ["Computer Vision", "VLMs", "Multimodal AI", "AI Systems"],
  current: "Senior Software Engineer",
  researchFocus: "Efficient & Adaptive Vision-Language Systems",
  // TODO(content): replace with the real public contact email before launch.
  email: "hello@example.com",
  // TODO(content): production domain.
  url: "https://example.com",
} as const;

export type SocialLink = { label: string; href: string | null };

// TODO(content): fill in real profile URLs. `null` links are hidden in the UI.
export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: null },
  { label: "LinkedIn", href: null },
  { label: "Google Scholar", href: null },
];

// TODO(content): Calendly / Cal.com link for a short intro call. `null` hides the button.
export const bookingUrl: string | null = null;

/** Social links with a real URL — the only ones the UI renders. */
export const activeSocialLinks = socialLinks.filter(
  (l): l is { label: string; href: string } => !!l.href,
);
