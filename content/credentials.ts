/**
 * Verifiable profile facts (CLAUDE.md §16). Unknown values stay `null` and are not rendered;
 * empty lists render nothing. Reusable later by /llms.txt and JSON-LD.
 */

export type Education = {
  institution: string;
  degree: string | null;
  field: string | null;
  period: string | null;
};

export const education: Education[] = [
  {
    institution: "Daffodil International University",
    // TODO(content): degree, field and years — add only real values.
    degree: null,
    field: null,
    period: null,
  },
];

export type Certification = {
  name: string;
  provider: string;
  /** Content partner when it differs from the platform. */
  partner?: string;
  issued: string;
  /** ISO date for `<time dateTime>`. */
  issuedIso: string;
  credentialId?: string;
  url?: string;
};

export const certifications: Certification[] = [
  {
    name: "Fundamentals of NestJS",
    provider: "Coursera",
    partner: "Board Infinity",
    issued: "Nov 2024",
    issuedIso: "2024-11-28",
    credentialId: "HS002PTYCOEF",
    url: "https://www.coursera.org/account/accomplishments/verify/HS002PTYCOEF",
  },
];

export type Publication = {
  title: string;
  /** `self` marks the owner, shown in bold. */
  authors: { name: string; self?: boolean }[];
  venue: string;
  year: string;
  url?: string;
  summary?: string;
};

// Owner decision: no publications listed for now. Add only peer-reviewed / public work.
export const publications: Publication[] = [];
