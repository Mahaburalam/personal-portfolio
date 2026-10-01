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
  email: "mahaburcse@gmail.com",
  phone: "+88 01783803843",
  phoneHref: "tel:+8801783803843",
  // TODO(content): production domain.
  url: "https://example.com",
} as const;

export type SocialIcon = "github" | "linkedin" | "x" | "scholar";

export type SocialLink = { label: string; href: string | null; icon: SocialIcon };

// `null` links are hidden in the UI.
export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/Mahaburalam", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mahabur-alam/", icon: "linkedin" },
  // TODO(content): X profile URL.
  { label: "X", href: null, icon: "x" },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=fVb4LNoAAAAJ&hl=en",
    icon: "scholar",
  },
];

// TODO(content): Calendly / Cal.com link for a short intro call. `null` hides the button.
export const bookingUrl: string | null = null;

/** Social links with a real URL — the only ones the UI renders. */
export const activeSocialLinks = socialLinks.filter(
  (l): l is SocialLink & { href: string } => !!l.href,
);
