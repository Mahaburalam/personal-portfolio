@AGENTS.md

# CLAUDE.md — Mahabur Alam Portfolio (Source of Truth)

Every implementation decision follows this file. If a change conflicts with it, decide whether this file
should be updated **first**, then implement. Do not invent new design directions.

---

## 1. Brand identity & positioning

- **Name:** MAHABUR ALAM
- **Primary identity:** AI RESEARCHER & ENGINEER
- **Specialization:** Computer Vision · Vision-Language Models · Multimodal AI · AI Systems
- **Background:** Senior Software Engineer (currently)
- **Research focus:** Efficient & Adaptive Vision-Language Systems
- **Statement:** "From ideas to intelligent systems."
- **Supporting:** "Building intelligent systems at the intersection of Computer Vision, Multimodal AI and software engineering."

Communicate: *an AI researcher and engineer with a strong software engineering foundation.*
Never communicate: *a software engineer who is interested in AI.*

Identity hierarchy (top = primary): AI Researcher & Engineer → Computer Vision → VLMs → Multimodal AI →
AI Systems → Software Engineering (foundation).

Story arc across the site: 01 Engineering → 02 AI Engineering → 03 Computer Vision → 04 Research →
05 Future (VLMs, Multimodal, Efficient AI, Embodied AI, World Models).

Final impression: **"An AI researcher who can actually build production systems."**

## 2. Design philosophy

**EDITORIAL × TECHNICAL × RESEARCH LAB** — 70% clean editorial, 20% technical/developer, 10% experimental AI.

Feels like: AI research lab, research notebook, premium engineering portfolio.
Never: generic dev portfolio, SaaS landing, agency template, cyberpunk, gaming, crypto, generic AI startup, resume.

Optimize for **identity + clarity + proof + interaction + research credibility**, not "looking impressive".
**PROOF > ADJECTIVES.** No "revolutionary / world-class / cutting-edge" without evidence.

References (inspiration only — never copy code, text, assets, layouts): rubenmarcus.dev (contact, AI-native),
breedlove.xyz (theme system), codedgar.com (interaction quality), surinder.design, mauriciojuba.com,
miromannino.com (project metadata), laugon.com (visual ambition only).

## 3. Typography

Loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS vars.

| Role | Font | Var / class | Use |
|---|---|---|---|
| Display | Sora | `--font-display` / `font-display` | hero, section headings, major titles |
| Body | Manrope | `--font-sans` / `font-sans` | body, descriptions, navigation |
| Technical | JetBrains Mono | `--font-mono` / `font-mono` | metadata, numbers, categories, dates, labels |

Mono labels are uppercase with wide tracking, e.g. `RESEARCH / 01`, `COMPUTER VISION`, `2026`
(use `<SectionLabel>` / `.label-mono`). Display headings use tight tracking (`tracking-tight`).

## 4. Color system & tokens

All colors are CSS variables in `app/globals.css`, mapped to Tailwind v4 via `@theme inline`.
**Never hardcode hex colors in components** — use `bg-background`, `text-muted-foreground`, `border-border`, etc.

Tokens: `background, foreground, muted, muted-foreground, border, card, card-foreground, accent,
accent-foreground, signal, ring`.

- **Light** (editorial, warm): warm off-white paper, near-black ink, warm grays, restrained blue accent.
- **Dark** (technical, premium): near-black, off-white text, cool grays, restrained blue accent, cyan `signal` used sparingly.
- `signal` (cyan) is only for "live"/AI moments (token highlights, status dots). Glow is rare and subtle.

Light is designed on its own — never an inversion of dark.

## 5. Theme system

`next-themes`, `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`
is **off**; instead a fast (150ms) color transition is applied to `body`. Supports Dark / Light / System.
Toggle cycles light → dark → system and shows the current mode. `<html suppressHydrationWarning>`.

## 6. Navigation

Desktop: `MAHABUR ALAM` left; right: `WORK  RESEARCH  SERVICE  SKILL  ABOUT  CONTACT  ◐`.
Active route shows an animated indicator (Motion `layoutId`). Minimal — do not add items.
Mobile: name + menu button → full-screen Motion overlay with the same links + theme toggle. Esc closes,
focus is trapped while open and returned to the button on close, body scroll locked.

## 7. Routes / page architecture

```
/                 home
/work             all projects        /work/[slug]      case study
/research         research lab        /research/[slug]  research detail
/services  /skills  /about  /contact
future: /lab (experiments)  /writing (notes)  /llms.txt  /api/profile|projects|research  /cv.pdf
```
Concepts stay distinct: Work = what I built · Research = what I investigate · Lab = what I experiment with ·
Writing = what I think about. Research pages must look visually different (lab/notebook feel) from Work.

## 8. Homepage structure (in order)

1. Hero 2. Currently 3. Selected Work 4. Research 5. Research Visualization 6. Services 7. Skills
8. Experience / Proof 9. About preview 10. Contact CTA 11. Footer.
Homepage is not a resume — details live on dedicated pages.

Visitor timeline: 5s who · 15s what I work on · 30s what I built · 60s what I research · 90s why engineering matters.

### Hero
Name, role, statement, supporting line, CTAs `Explore Work →` (/work) and `Research →` (/research),
labels `COMPUTER VISION · VLMs · MULTIMODAL AI · AI SYSTEMS`, meta "Currently: Senior Software Engineer",
"Research focus: Efficient & Adaptive Vision-Language Systems".
Visual signature: **IMAGE → PATCHES → VISUAL TOKENS → REASONING → OUTPUT**. Never a generic sphere, brain,
galaxy, robot or neural-net animation. Desktop: text | visual. Mobile: text, then simplified visual.
The DOM/SVG version (`components/hero/hero-pipeline.tsx`) is permanent and is the fallback for the WebGL version.

## 9. Component architecture

```
components/
  navigation/   site-header, nav-links, mobile-menu, theme-toggle
  layout/       container, section, section-label
  hero/  work/  research/  services/  skills/  about/  contact/
  animations/   reusable Motion wrappers (reveal, stagger) — client leaves only
  three/        ALL Three.js / R3F code, isolated, lazy-loaded
  providers/    theme-provider
  ui/           shadcn-style primitives (button, tag) using cn + cva
  site-footer.tsx
lib/            utils.ts (cn), site.ts (profile, nav, links)
content/        projects/ research/ services/ skills/ experience/ (typed data + MDX long-form)
```

## 10. Animation architecture (layered — pick the lowest layer that works)

1. **CSS** — hover, focus, color, borders, shadows, simple transforms. Prefer when sufficient.
2. **Motion for React (`motion/react`)** — DEFAULT: page/nav transitions, menu, text reveals, fades, stagger,
   layout animations, card hover, small parallax.
3. **GSAP + ScrollTrigger** — ONLY for pinned sections, multi-stage scroll storytelling, synchronized timelines.
   Not installed yet; add only when a specific section proves Motion insufficient, and note why here.
4. **Three.js + R3F + Drei** — ONLY for the hero visual and possibly research visualization. Not installed until Phase 12.

Timing: UI transitions 200–500ms; easing token `--ease-out-expo` / Motion `[0.16, 1, 0.3, 1]`.
Never animate every element. Every animation respects `prefers-reduced-motion` (use `useReducedMotion`;
CSS has a global reduced-motion override).

## 11. Three.js rules

Lazy-loaded (`next/dynamic`, `ssr:false`), isolated in `components/three/`, progressive enhancement over the DOM
pipeline. Mobile: fewer particles, simpler shaders, lower frame rate or DOM fallback. Low-power / no WebGL /
reduced motion → DOM version. Pause rendering when offscreen. Site must be understandable without WebGL.

## 12. Layout & responsive

Container: `max-w-[1400px]`, gutter `px-5 sm:px-8 lg:px-12`. Editorial grid (12-col on lg), generous
whitespace, asymmetric compositions allowed. Mobile: stacked, 16px+ body, touch targets ≥ 44px.
Design each breakpoint intentionally (mobile, tablet, laptop, desktop) — don't just shrink.

## 13. Accessibility

Semantic landmarks, one `h1` per page, ordered headings, visible focus (`focus-visible` ring using `--ring`),
skip link, keyboard-accessible menus, accessible labelled forms, AA contrast in both themes, meaningful alt text,
reduced motion support. Decorative visuals are `aria-hidden` with a text equivalent available.

## 14. Performance

Server Components by default; `"use client"` only at leaf components. Lazy-load WebGL and heavy animation.
`next/image` for all images. No unnecessary deps. Static fallbacks. Never trade performance for effects.

## 15. SEO

Per-page `metadata`, Open Graph, Twitter, canonical (`metadataBase`), `app/sitemap.ts`, `app/robots.ts`,
JSON-LD (Person, WebSite; CreativeWork/ScholarlyArticle only when real). Never fabricate structured data.
AI-native extras (`/llms.txt`, `/api/*`) only after core is stable.

## 16. Content architecture & honesty

Content lives in `content/` as typed TS data (short) and MDX (long-form case studies / research), never
hardcoded inside JSX sections. **Never fabricate** metrics, clients, publications, awards, results, user counts,
technologies or titles. Unknown data → placeholder marked `TODO(content)` and ask the owner.
Research status must be one of: `idea | concept | experiment | ongoing | preprint | submitted | published`
and must be accurate (all current items: `ongoing` until the owner confirms otherwise).
Case study structure: Overview, Problem, Context, My Role, Approach, Architecture, Technology, Implementation,
Results, Challenges, Learnings, Gallery, GitHub/Demo.

## 17. Coding conventions

- Strict TypeScript; no `any`. Named exports for components; kebab-case filenames.
- Tailwind v4 utilities + tokens; compose classes with `cn()` from `lib/utils.ts`; variants with `cva`.
- Next.js 16: read `node_modules/next/dist/docs/` before using an API (e.g. `params` is a Promise).
- Prettier (with tailwind plugin) + ESLint must pass. `pnpm` only.

## 18. Dependency rules

Current: next, react, tailwindcss, next-themes, lucide-react, motion, clsx, tailwind-merge,
class-variance-authority, prettier(+tailwind plugin).
Planned by phase: MDX (Phase 4), zod + react-hook-form (Phase 9), gsap (Phase 11, only if justified),
three + @react-three/fiber + @react-three/drei (Phase 12).
Before adding anything: does the stack already solve it? Is it lightweight? Does it duplicate something? Record it here.

## 19. Do-not-do

- No generic AI imagery (brains, robots, galaxies, glowing spheres), no neon/cyberpunk, no heavy glow.
- No logo walls for skills; organize by capability.
- No GSAP for simple animations; no Three.js for cards/buttons/backgrounds.
- No global state library, CMS, database or backend unless a real need appears (contact form excepted).
- No hardcoded colors; no hype copy; no invented facts.

## 20. Roadmap

- [x] 1 Foundation (Next, TS, Tailwind, tokens, fonts, theme, lint/prettier, CLAUDE.md)
- [x] 2 Core UI (nav, theme toggle, layout, typography, buttons, containers)
- [x] 3 Hero (DOM pipeline visual) + Currently
- [ ] 4 Work (selected work, cards, /work, case studies via MDX)
- [ ] 5 Research (section, /research, detail pages)
- [ ] 6 Services  - [ ] 7 Skills  - [ ] 8 About  - [ ] 9 Contact
- [ ] 10 Motion system (page transitions, reveals, micro-interactions)
- [ ] 11 Advanced scroll (GSAP, only if needed)
- [ ] 12 Three.js hero visual (+ research viz if it improves the concept)
- [ ] 13 Performance  - [ ] 14 Accessibility  - [ ] 15 SEO  - [ ] 16 Final QA

## 21. Definition of done

Brand: AI-researcher identity and CV/VLM specialization obvious; engineering supports the narrative.
Design: editorial, technical, premium, consistent, distinctive in both themes.
Animation: Motion for UI, GSAP only when justified, Three.js only for meaningful AI visualization, reduced motion.
Performance: fast initial load, optimized images, lazy WebGL, mobile optimized.
Accessibility: keyboard, semantic, contrast, reduced motion.
Engineering: clean TS, reusable components, no unnecessary deps.
SEO: metadata, sitemap, structured data, crawlable content.
