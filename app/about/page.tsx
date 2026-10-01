import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { CurrentlyExploring } from "@/components/about/currently-exploring";
import { EducationCredentials } from "@/components/about/education-credentials";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { JourneyTimeline } from "@/components/about/journey-timeline";
import { ProjectHighlights } from "@/components/about/project-highlights";
import { ResearchFocus } from "@/components/about/research-focus";
import { WorkingPrinciples } from "@/components/about/working-principles";
import { ContactCta } from "@/components/contact/contact-cta";
import { aboutCta, aboutMeta, researchInterests } from "@/content/about";
import { education } from "@/content/credentials";
import { activeSocialLinks, profile } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: aboutMeta.title },
  description: aboutMeta.description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: aboutMeta.title,
    description: aboutMeta.description,
  },
};

// Verified fields only (CLAUDE.md §15–16).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${profile.url}/about`,
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.current,
    description: aboutMeta.description,
    url: profile.url,
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
    knowsAbout: researchInterests,
    sameAs: activeSocialLinks.map((l) => l.href),
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <AboutHero />
      <JourneyTimeline />
      <ExperienceTimeline />
      <ResearchFocus />
      <EducationCredentials />
      <ProjectHighlights />
      <CurrentlyExploring />
      <WorkingPrinciples />
      <ContactCta intro={aboutCta.intro} secondary={{ href: "/work", label: "View work" }} />
    </>
  );
}
