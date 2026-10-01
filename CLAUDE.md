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
accent-foreground, signal, spectrum-start, spectrum-end, destructive, ring`.

- `destructive` is only for form validation / failure messages (AA on `background` and `card`).
- **Light** (editorial, clean): neutral cool off-white, white cards, near-black ink, cool grays, muted gold accent (`#7A6526`, the AA-safe shade of brand gold `#BAA35F`).
- **Dark** (technical, premium): navy-black, `#E6E6E6` text, cool grays, brand gold accent (`#BAA35F`), cyan `signal` used sparingly.
- `spectrum-start` → `spectrum-end` (blue → violet) is the AI/visual-token color (owner's homepage mockup): hero/research
  visuals, generated card covers, small AI emphasis (`.text-spectrum`, e.g. the Path section's last stage). Never for body text, buttons or
  UI states — gold `accent` keeps interactive states (nav indicator, ring, hover). `.text-spectrum` / `.bg-spectrum`
  are registered in `cn`.
- Brand palette: primary gold `#BAA35F`, secondary `#E6E6E6`. The logo kit (§6) keeps its own colors.
- `signal` (cyan) is only for "live"/AI moments (token highlights, status dots). Glow is rare and subtle — the one
  owner-approved exception is the hero canvas (dark theme bloom, per the mockup).

Light is designed on its own — never an inversion of dark.

## 5. Theme system

`next-themes`, `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`
is **off**; instead a fast (150ms) color transition is applied to `body`. Supports Dark / Light / System.
Toggle flips the *visible* theme on every click (light ↔ dark) and shows the resolved mode; when the
chosen theme matches the OS preference it stores `system` instead, so System stays supported without
"dead" clicks (the old light → dark → system cycle often produced no visible change).
Switching uses a View Transitions circular reveal from the toggle (500ms, easeOutExpo) plus a Motion
sun/moon icon swap; instant when the API is unsupported or reduced motion is on. `<html suppressHydrationWarning>`.

## 6. Navigation

Desktop: logo left (links home, `aria-label` with the full name); right: `PORTFOLIO  RESEARCH  SERVICE  SKILL  ABOUT  CONTACT  ◐`.

**Brand mark — "Shared Apex" MA** (`components/navigation/logo.tsx`, inline outlined SVG, theme tokens):
the M's last stroke is also the A's left leg (one unified symbol, not "M" next to "A"). Code reference: the A's
crossbar is a detached underscore cursor `_`. AI reference: the M's stem stands on a square **token patch**
(`signal`; same ink in monochrome) — the hero's IMAGE → PATCHES → TOKENS idea. Geometry: 48-unit grid,
stroke 6, cap 8, baseline 40, filled outline paths (no strokes, no font text). A heavier ≤24px optical variant
joins the crossbar (favicon `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`). Header shows mark +
"Mahabur Alam" (Sora). Brand kit (symbol / primary / horizontal / stacked × light / dark / color, avatars) lives
in `public/brand/`; never redraw the mark ad hoc — reuse those paths. Do not add other symbols to it.
Nav items are 13px mono uppercase (`font-mono` uppercase, tracking 0.12em). Active route shows an animated indicator (Motion `layoutId`). Minimal — do not add items.
Mobile: name + menu button → full-screen Motion overlay with the same links + theme toggle. Esc closes,
focus is trapped while open and returned to the button on close, body scroll locked.
Footer: logo (links home) left · nav links (mono) center · social icons right (GitHub, LinkedIn, X, Google Scholar, ResearchGate;
`null` hrefs in `lib/site.ts` hide an icon); bottom row © year + name · role (right-padded on sm+ to clear Back-to-Top).
Back-to-Top (`components/navigation/back-to-top.tsx`, mounted once in the root layout): 36px round button (44px hit area), small `Bot` icon,
bottom-right, z-30 (under header and mobile menu); fades/slides in after 600px of scroll, thin ring tracks scroll
progress; hover fills it with `accent`, the circle is magnetic (§10) and the robot hops/waves (CSS `animate-bot-wiggle`). Click smooth-scrolls to
top then focus moves to the header logo. Reduced motion → instant scroll, opacity-only, no wiggle.

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

1. Hero 2. Selected Work 3. Research Lab 4. Research Visualization 5. Currently Exploring 6. Services 7. Skills
8. Experience / Proof 9. About preview 10. Contact CTA 11. Signal band 12. Footer.
Homepage sections use `SectionHeader variant="rail"`: a stacked heading column (label, h2, intro, arrow link) left
of the content (owner's mockup). Inner pages keep the default 3|9 `split`. Exception: the Lab notebook
(Research Visualization) keeps the `split` header with the full-width schematic below — owner preferred it.
Homepage is not a resume — details live on dedicated pages.
Signal band (`components/signal/`): decorative prelude to the footer — the hero signature told as a signal. A small
patch-grid image is scanned into visual tokens that converge, fan out into interweaving strands (reasoning;
`signal` → `spectrum-end` gradient) and land on the words of the statement. Visual is `aria-hidden`; the caption is
its text equivalent. No section number.

Visitor timeline: 5s who · 15s what I work on · 30s what I built · 60s what I research · 90s why engineering matters.

### Hero
Name, role, statement, supporting line, CTAs `Explore Portfolio →` (/work) and `Research →` (/research),
labels `COMPUTER VISION · VLMs · MULTIMODAL AI · AI SYSTEMS`, meta "Currently: Senior Software Engineer",
"Research focus: Efficient & Adaptive Vision-Language Systems" (owner kept this text column over the mockup's).
Visual signature: **IMAGE → PATCHES → VISUAL TOKENS → REASONING → OUTPUT**, matched to the owner's mockup: glass
panels turned away from the viewer — a real street photo (`public/hero/street.jpg`, CC0, set in `content/hero.ts`),
token panels *sampled from that photo*, a cyan reasoning panel, a token beam and a violet output point cloud.
Rendered on a 2D canvas (`hero-scene.ts` = pure drawing in a virtual 1000×440 space with per-panel perspective;
`hero-canvas.tsx` = lifecycle). Never a generic sphere, brain, galaxy, robot or neural-net animation. The canvas is
`aria-hidden`; the figcaption (stage labels + sr-only sentence) is the text equivalent and works without JS.
This canvas version is the permanent fallback for a future WebGL version.

### Selected Work / Research Lab / Currently Exploring
Work: 3 boxed tiles (cover, category chip, title, summary, tags, meta, "View case →"). Covers are `next/image` when
`project.cover` exists, else a generated token-grid cover (`project-cover.tsx`). Research Lab: 3 hairline columns
(status badge, tags, "Read notes →" — never "Read paper" until a paper exists) + `research-field.tsx`, a dot-matrix
patch field with crop thumbnails and a 01/03 pager that follow the active line. Currently Exploring: six focus areas
from `content/focus.ts`.

## 9. Component architecture

```
components/
  navigation/   site-header, nav-links, mobile-menu, theme-toggle, back-to-top
  layout/       container, section, section-label, section-header (`split` 3|9: long inner pages · `rail` stacked: homepage), page-header
  hero/         hero (server) · hero-signature (perspective stack) → hero-signature-motion (pause leaf)
  work/         selected-work · project-tile + project-cover (homepage) · project-card (/work rows)
  research/     research-preview (Research Lab) → research-field (client) · focus-row · research-entry (/research)
  services/  about/  contact/
  skills/       skills-preview (homepage teaser) · skills-ecosystem (server, /skills) → skills-graph (client:
                hover/focus state + SVG traces) · skill-category · skill-chip · tech-icon · research-direction ·
                patch-scan (decorative CV motif, xl)
  animations/   reusable Motion wrappers (reveal, stagger, magnetic) — client leaves only
  intro/        first-load intro overlay (server markup) + its inline gating script
  signal/       homepage signal band (server wrapper + client SVG strands)
  three/        ALL Three.js / R3F code, isolated, lazy-loaded
  providers/    theme-provider, motion-provider (MotionConfig reducedMotion="user")
  ui/           shadcn-style primitives (button, tag) using cn + cva; social-icon (inline Simple Icons
                brand SVGs — lucide v1 has no brand icons)
  site-footer.tsx
lib/            utils.ts (cn), site.ts (profile, nav, links), motion.ts (easeOutExpo, durations)
content/        projects/ research/ services/ skills/ experience/ about/ credentials/ (typed data + MDX long-form)
public/brand/   logo kit (SVG lockups with outlined text, PNG avatars) — see §6
public/hero/pipeline/  standalone pipeline visual (owner's mockup: Image → Visual Tokens → Reasoning →
                Intelligent Output), dark + light: static SVG, PNG (1080p + 4K), CSS-animated SVG, Lottie
                (markers `intro` 0–45f once, `loop` 45–225f seamless). Generated — never hand-edit; run
                `pnpm gen:pipeline` (scripts/pipeline-visual/, no npm deps; the image panel is `public/hero/street.jpg`,
                perspective-warped by `warp-photo.py` — needs python3 + Pillow; PNGs via headless Chrome). Brand/marketing
                assets only: NOT used by the hero, whose DOM signature (§8) stays canonical.
```
Content is currently flat typed TS (`content/*.ts`, incl. `research-visualization.ts` for the homepage
schematic); it moves into folders when MDX arrives in Phase 4. Research surfaces use the `.bg-grid`
notebook utility; Work does not.

**Skills (`/skills`).** 8 categories in `content/skills.ts`, laid out AI-first (owner's sketch): AI/ML → Computer
Vision · Multimodal AI · AI Research (+ research-direction strip) → Software Engineering (foundation) → Backend ·
Database & Data · Frontend · Tools (owner's priority order; Backend is the main engineering focus and primary tier).
Cards are numbered in visual order. Hierarchy comes from `tier` (primary / secondary / emerging →
size, frame, the emerging ones get `.bg-grid`) and a visible neutral `stance` label ("Focused on", "Exploring"…) —
never percentages, bars, levels or "expert". `skillLinks` drives both the traces and hover emphasis. The research
direction (CV → Multimodal → VLMs → Embodied AI → World Models) is marked now / next / horizon: a direction, not a
claim. The homepage shows only a compact teaser of the categories.

**About (`/about`).** A narrative, not a resume. Copy in `content/about.ts`, roles in `content/experience.ts`, and
education / certifications / publications in `content/credentials.ts`. Sections live in `components/about/` and
are numbered in visual order on the 3|9 rail (`SectionHeader`). The hero holds the page's only `h1` (label
`About / 05`, nav order) and a trajectory chain (Software Eng → AI Eng → CV → AI Research). Then: 01 Journey (a
scroll-drawn line, the only new client leaf `journey-progress.tsx`) · 02 Experience · 03 Research & AI (`.bg-grid`
notebook: ongoing lines with `StatusBadge`, interests, a status legend and publications only when real) ·
04 Education & learning · 05 Built along the way (evidence, links into /work) · 06 Currently exploring (now / next /
horizon + current status strip) · 07 How I work · 08 `ContactCta` (props: `index`, `intro`, `secondary`). Unknown
facts (employer, dates, degree…) are `null` with `TODO(content)` and simply not rendered — no visible placeholders.
The page emits `ProfilePage` → `Person` JSON-LD from verified fields only.

## 10. Animation architecture (layered — pick the lowest layer that works)

1. **CSS** — hover, focus, color, borders, shadows, simple transforms. Prefer when sufficient.
2. **Motion for React (`motion/react`)** — DEFAULT: page/nav transitions, menu, text reveals, fades, stagger,
   layout animations, card hover, small parallax.
3. **GSAP + ScrollTrigger** — ONLY for pinned sections, multi-stage scroll storytelling, synchronized timelines.
   Not installed yet; add only when a specific section proves Motion insufficient, and note why here.
4. **Three.js + R3F + Drei** — ONLY for the hero visual and possibly research visualization. Not installed until Phase 12.

**Hero canvas.** `components/hero/hero-canvas.tsx`: static panels/photo/tiles render once per size + theme into an
offscreen layer (blur bloom in dark only); a rAF loop adds token twinkles, a scan line, reasoning dots, the beam and
the turning output cloud. Waits for the intro to finish, reveals left → right (1.4s), pauses offscreen, 30 fps and half
the particles under 640px, one still frame under reduced motion. Colours are read from the CSS tokens and re-read
when the theme class changes. Plain canvas 2D — not a Three.js case (§11 stays for a future WebGL version).

**Intro (first load).** `components/intro/`: a typographic overlay — MA mark wipes up, `MAHABUR ALAM` letters
slide up through masks, role line fades in, a hairline draws as quiet progress, then the overlay wipes upward
(~1.6s total). Pure CSS keyframes so it starts at first paint, before hydration. An inline script in `<body>` sets
`html[data-intro="play"]` only when a browser session *starts* on `/` (hard load) and reduced motion is off;
deep links, reloads and client navigations never see it. Any key / pointer / wheel skips it (300ms exit).
No JS → no overlay. Never lengthen it, never add a spinner or percentage counter.

**Magnetic.** `components/animations/magnetic.tsx`: a stable outer span listens, an inner Motion span springs
toward the cursor (≤8px, ≤3° tilt, 1.04 scale) and settles back on leave. Mouse pointers only (touch/pen ignored),
off under reduced motion, motion values only (no re-renders). Used on: hero CTAs, contact CTA, desktop theme
toggle, Back-to-Top. Small intentional targets only — never nav text links or cards.

**Signal band.** `components/signal/signal-waves.tsx`: CSS keyframes (one-time patchify, strand draw-in and word
reveal, a few travelling highlights) plus a small rAF loop that writes attributes directly (no re-renders): strand
drift, the scan cursor, tokens flowing out of the image, and the active output word. Paused offscreen / in hidden tabs; static first frame under reduced motion. Not a GSAP or WebGL case.

**Skills graph.** `components/skills/skills-graph.tsx`: on xl (≥1280px), an `aria-hidden` SVG layer behind the cards draws
chamfered circuit traces between measured card boxes (`offset*`, so transforms don't skew them; re-measured by a
ResizeObserver). CSS only — traces draw in once (reusing `signal-draw`), then faint `signal` pulses loop
(`signal-pulse`), paused offscreen via `data-skills-paused`; no rAF. Hover / focus / tap lifts a card, accents its
traces and chips, dims unrelated cards (xl). Below xl: no SVG — 2 columns on md–lg, a static dashed spine on mobile. Reduced motion / no JS → static.

Timing: UI transitions 200–500ms; easing token `--ease-out-expo` / Motion `[0.16, 1, 0.3, 1]`.
Never animate every element. Every animation respects `prefers-reduced-motion` (use `useReducedMotion` from
`lib/use-reduced-motion.ts` — hydration-safe; never Motion's own hook, which breaks hydration; CSS has a global
reduced-motion override).

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
`next/image` for all images (exception: the hero canvas reads its photo directly — keep it ≤100 KB). No unnecessary deps. Static fallbacks. Never trade performance for effects.

## 15. SEO

Per-page `metadata`, Open Graph, Twitter, canonical (`metadataBase`), `app/sitemap.ts`, `app/robots.ts`,
JSON-LD (Person, WebSite; CreativeWork/ScholarlyArticle only when real). Never fabricate structured data.
AI-native extras (`/llms.txt`, `/api/*`) only after core is stable.

## 16. Content architecture & honesty

Content lives in `content/` as typed TS data (short) and MDX (long-form case studies / research), never
hardcoded inside JSX sections. **Never fabricate** metrics, clients, publications, awards, results, user counts,
technologies or titles. Unknown data → placeholder marked `TODO(content)` and ask the owner. Profile facts
(employers, dates, degrees, credentials) that are unknown stay `null` and the UI omits them; lists with no
verified entries (e.g. `publications`) render nothing. Interests and directions are worded as such
("exploring", "next", "horizon") — never as results or expertise.
Research status must be one of: `idea | concept | experiment | ongoing | preprint | submitted | published`
and must be accurate (all current items: `ongoing` until the owner confirms otherwise).
Case study structure: Overview, Problem, Context, My Role, Approach, Architecture, Technology, Implementation,
Results, Challenges, Learnings, Gallery, GitHub/Demo.

## 17. Coding conventions

- Strict TypeScript; no `any`. Named exports for components; kebab-case filenames.
- Tailwind v4 utilities + tokens; compose classes with `cn()` from `lib/utils.ts`; variants with `cva`.
  Custom utilities that collide with Tailwind prefixes (e.g. `bg-grid`) must be registered in `cn`'s
  `extendTailwindMerge` config, or tailwind-merge silently drops them.
- Next.js 16: read `node_modules/next/dist/docs/` before using an API (e.g. `params` is a Promise).
- Prettier (with tailwind plugin, `tailwindStylesheet` → `app/globals.css`) + ESLint must pass. `pnpm` only.
  `*.md` and `pnpm-lock.yaml` are in `.prettierignore` (Prettier breaks this file's numbered lists).

## 18. Dependency rules

Current: next, react, tailwindcss, next-themes, lucide-react, motion, clsx, tailwind-merge,
class-variance-authority, prettier(+tailwind plugin), zod (contact form validation, Phase 9).
react-hook-form was dropped: React 19 `useActionState` + native constraints cover the contact form.
Contact email goes through Resend's REST API via `fetch` (no SDK); env vars in `.env.example`.
Planned by phase: MDX (Phase 4), gsap (Phase 11, only if justified),
three + @react-three/fiber + @react-three/drei (Phase 12).
Before adding anything: does the stack already solve it? Is it lightweight? Does it duplicate something? Record it here.

## 19. Do-not-do

- No generic AI imagery (brains, robots, galaxies, glowing spheres), no neon/cyberpunk, no heavy glow. The mockup's
  research "orb" is deliberately rendered as a flat dot-matrix patch field, not a sphere. Owner-approved
  exception: the small `Bot` icon on the Back-to-Top button (§6) — UI glyph only, never a visual/illustration.
- No logo walls for skills; organize by capability. Small monochrome Simple Icons (CC0 paths copied from the pinned
  `simple-icons` package into `tech-icon.tsx`, never hand-drawn) are allowed inside capability-grouped skill chips.
- No GSAP for simple animations; no Three.js for cards/buttons/backgrounds.
- No global state library, CMS, database or backend unless a real need appears (contact form excepted).
- No hardcoded colors; no hype copy; no invented facts.

## 20. Roadmap

- [x] 1 Foundation (Next, TS, Tailwind, tokens, fonts, theme, lint/prettier, CLAUDE.md)
- [x] 2 Core UI (nav, theme toggle, layout, typography, buttons, containers)
- [x] 3 Hero (DOM pipeline visual) + Currently
- [x] Homepage: all §8 sections in place (previews for Phases 4–9, research schematic, reveal/stagger)
- [ ] 4 Work (selected work ✓, cards ✓, /work list ✓ — case studies via MDX pending)
- [ ] 5 Research (section ✓, /research list ✓ — detail pages pending)
- [ ] 6 Services
- [ ] 8 About (homepage previews ✓, /about narrative page ✓ — owner facts pending: employers, dates, degree,
  past roles; principles copy review)
- [ ] 7 Skills (homepage teaser ✓, /skills animated ecosystem ✓ — owner review of descriptions pending)
- [x] 9 Contact (form → server action → Resend, honeypot + 3s time-trap anti-spam, channels, agent
  brief, availability; needs RESEND_API_KEY + CONTACT_TO_EMAIL env vars before launch)
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
