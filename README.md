# Portfolio — Marcos

Multi-page personal portfolio. Coastal light theme, motion-driven, fully
data-driven: adding a project, a snippet or a demo means editing a file in
`data/`, never a component.

UI copy is Portuguese (BR). Code, comments and this README are English.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer
Motion 12 · Shiki

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Other scripts: `npm run lint`, `npx tsc --noEmit`.

---

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing — hero, featured projects, recent assets, CTA |
| `/projects` | Full project grid, filterable by category |
| `/projects/[slug]` | Case study (SSG) |
| `/assets` | Curated code snippets, filterable by category |
| `/assets/[slug]` | Snippet detail — highlighted code + notes (SSG) |
| `/about` | Bio, skills, stack rationale |
| `/contact` | Proposal form (email via Resend) + WhatsApp + GitHub/LinkedIn/email |
| `/api/contact` | POST endpoint that sends the form as an email (dynamic) |

All 14 routes are statically generated; the two dynamic segments come from
`generateStaticParams()` over the data files.

The `Navbar` is the only reason any chrome is client-side: it uses
`usePathname()` for the active-route underline and holds the mobile menu state.

---

## Adding content

### `data/site.ts`

Name, role, intro, `bio[]` (paragraphs on `/about`), `stackRationale`, GitHub,
LinkedIn and email. The GitHub avatar is fetched from
`https://github.com/<githubUser>.png`.

### `data/projects.ts` — projects, skills, demos

**Projects** — `featured: true` puts a project in the landing teaser (capped at
three) and sorts it first on `/projects`.

| Field | Effect |
| --- | --- |
| `slug` | URL for the case study — **required** |
| `thumbnail` | Empty renders a "Captura pendente" tile |
| `liveUrl` | Empty renders "Ver online" as a disabled dashed button |
| `status` | `live` (green) · `in-progress` (amber) · `coming-soon` (gray) |
| `category` | Drives the `/projects` filter chips |
| `longDescription` | Case study narrative; blank lines separate paragraphs |
| `highlight` | One sentence — the gold "Parte mais difícil" callout |
| `results` | Concrete outcomes. **Omit rather than invent a number** |
| `images` | Gallery paths; empty shows the placeholder |

**Skills** — grouped by `skillCategories`, rendered on `/about`.

**Demos** — screen recordings, keyed to a project by `projectId` and rendered on
that project's case study page. `type` is `gif`, `video` or `youtube`; an empty
`src` renders "Gravação em breve".

### `data/assets.ts` — code snippets

Each `CodeAsset` carries the snippet plus the reasoning that justifies keeping
it: `code`, `explanation` (markdown), `language` (a Shiki lang id), `category`,
`tags`, `createdAt`. Filter chips are generated only for categories that have
entries.

Seeded snippets are lifted from real project code, lightly trimmed of
app-specific branches. Identifiers are left as originally written; code comments
are English by convention.

### Images

Put screenshots and GIFs in `public/` and reference them as `/shot.png`. Remote
images are restricted to the GitHub avatar hosts in `next.config.ts`.

---

## Contact form

`/contact` posts to `app/api/contact/route.ts`, which sends the message to
`CONTACT_EMAIL` through [Resend](https://resend.com). `replyTo` is set to the
visitor's address, so replying in the inbox goes straight to them.

### Environment

Copy `.env.example` to `.env.local` (and set the same two in Vercel → Settings →
Environment Variables, all environments):

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_EMAIL=you@example.com
```

Both are read **inside the route handler only** — never in a client component,
never in `data/site.ts`. The key is read at request time rather than module
scope, so a clone without env vars still builds and runs; the endpoint returns
`not_configured` instead of crashing.

**From address:** `onboarding@resend.dev` works with no domain verification and
is fine to ship. For production deliverability, verify a domain in Resend and
change `from` in the route. The free tier (~100/day, 3000/mo) is ample.

### Anti-spam

Two silent filters, both answering `ok:true` so a bot learns nothing:

- **Honeypot** — a visually hidden `company` field (`tabIndex={-1}`,
  `aria-hidden`, `autocomplete="off"`) that only a bot fills.
- **Time trap** — submissions faster than 2.5s from mount are dropped.

Server-side validation runs regardless of what the client does: required
fields, email shape, and a 5000-character cap.

### WhatsApp

**Set `contact.whatsappNumber` in `data/site.ts`** — digits only, international
(`55` + DDD + number). While it is empty, both WhatsApp buttons render in a
disabled state rather than producing a broken `wa.me` link.

`wa.me` opens the **visitor's** WhatsApp with a pre-filled message addressed to
Marcos; the visitor taps send. Truly automatic delivery would need the Meta
WhatsApp Cloud API (business account, dedicated number, template approval) and
is out of scope. Email is the automatic channel; WhatsApp is visitor-initiated.

The standing button uses a generic template; the post-send button builds its
text from what the visitor actually typed.

---

## Design system

Tailwind v4 is **CSS-first**: there is no `tailwind.config.ts`. All tokens live
in the `@theme` block at the top of `app/globals.css`, and each generates
utilities automatically (`--color-sea` → `bg-sea`, `text-sea`, …).

| Token | Value | |
| --- | --- | --- |
| `--color-bg` | `#F6F2EA` | page — warm off-white |
| `--color-surface` | `#FBF8F1` | cards |
| `--color-surface-2` | `#EEE7D8` | alternating bands |
| `--color-ink` | `#16293D` | primary text |
| `--color-ink-muted` | `#4C5D6E` | secondary text |
| `--color-navy` | `#1B3A57` | headings |
| `--color-sea` | `#2E6E5F` | links, actions, active nav |
| `--color-gold` | `#B8935A` | **ornament only** |
| `--color-gold-ink` | `#8F6F3E` | large/bold text only |
| `--color-border` | `#E0D6C4` | dividers, card edges |
| `--color-border-strong` | `#8B7E68` | form-control borders (see below) |

### The gold rule

`--color-gold` reaches roughly **2.6:1** on these light surfaces — it cannot pass
AA as body text at any size. It is used strictly as ornament: the 48px page
stroke, card hover borders, the callout rules. Links, CTAs and the active nav
state use `--color-sea` (white-on-sea is 6:1).

**Type:** Fraunces (headings, `font-serif`, variable) · Inter (body,
`font-sans`) · JetBrains Mono (labels, code, `font-mono`). Self-hosted via
`next/font`. Swapping the display face is a one-line change in
`app/layout.tsx` — `Instrument_Serif` or `Newsreader` both drop straight in.

---

## Motion

Primitives in `app/components/MotionWrapper.tsx`: `MotionWrapper`,
`MotionStagger`/`MotionItem`, `staggerParent()`, and the `fadeUp` / `scaleIn`
variants. Entrances fire once and stagger at 0.1s per index; cards lift `-2px`
with a gold border on hover.

### Reduced motion

Two layers, verified on every route:

1. `<MotionConfig reducedMotion="user">` makes Framer Motion skip
   transform/layout animation app-wide.
2. A `prefers-reduced-motion` block in `globals.css` kills CSS transitions and
   smooth scrolling.

Demo videos also stop autoplaying and gain controls. Nothing is left invisible
when animation is suppressed.

---

## Accessibility

Audited against the production build across all 12 public routes at
390 / 834 / 1440 px:

- **WCAG AA contrast on all 2817 visible text nodes.** The audit resolves
  `oklab()`/`oklch()` (Tailwind v4 emits these for any opacity-modified colour)
  and composites translucent layers before measuring.
- Visible focus ring on every tab stop, plus a "Pular para o conteúdo" link
- `lang="pt-BR"`; semantic landmarks; one `h1` per page
- Active nav link carries `aria-current="page"`, verified per route
- Mobile menu button exposes `aria-expanded` / `aria-controls`
- No horizontal overflow; wide code blocks scroll in their own container
- Copy buttons announce via `aria-live` and fall back when the clipboard API is
  blocked
- Form: every input has a real `<label>`; errors are wired via
  `aria-describedby` + `aria-invalid`; submit focuses the first invalid field;
  success moves focus to the `role="status"` confirmation; failures use
  `role="alert"`
- **Non-text contrast (1.4.11):** form borders use `--color-border-strong`
  (3.75:1 on the card surface). `--color-border` is only 1.36:1 there — fine for
  a decorative divider, not for the outline that identifies an input.

**Syntax highlighting:** Shiki runs server-side (zero client JS) with
`github-light-high-contrast`. Plain `github-light` was rejected — its orange
(`#E36209`, 3.3:1) and red (`#D73A49`, 4.3:1) tokens fail AA on this surface.

---

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) — the
defaults are correct and no environment variables are required.
