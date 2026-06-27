# HyoT Software Center — Architecture

Windows utility software distribution platform.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Static Export) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4, shadcn/ui |
| i18n | next-intl |
| Theming | next-themes |
| Deploy | GitHub Pages via GitHub Actions |
| Admin | Local-only Next.js app (never deployed) |

## Directory Tree

```
/
├── .github/
│   └── workflows/
│       ├── ci.yml              # PR checks
│       ├── pages.yml           # main → deploy
│       └── release.yml         # release → sync + deploy
├── admin/                      # Local CMS (separate Next.js app)
│   └── src/
├── data/
│   ├── config/
│   │   ├── site.config.json
│   │   └── features.json
│   ├── i18n/
│   │   ├── ko.json
│   │   └── en.json
│   └── software/
│       └── [slug]/
│           ├── meta.json
│           └── releases.json
├── docs/
│   └── architecture.md         # This file
├── schemas/
│   ├── site-config.schema.json
│   ├── features.schema.json
│   ├── software-meta.schema.json
│   ├── software-releases.schema.json
│   └── i18n.schema.json
├── scripts/
│   ├── validate-schemas.ts
│   ├── broken-links.ts
│   └── a11y.ts
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── software/
│   │           └── [slug]/
│   │               └── page.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── layout/
│   │   └── software/
│   ├── i18n/
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── lib/
│   │   ├── auth/               # AuthAdapter interface
│   │   ├── search/             # SearchAdapter interface
│   │   ├── analytics/          # AnalyticsAdapter interface
│   │   ├── github/             # GitHubAdapter interface
│   │   ├── data/               # Data loaders + Zod validation
│   │   ├── features.ts
│   │   └── utils.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   └── globals.css
│   └── types/
│       ├── i18n.ts
│       ├── software.ts
│       └── config.ts
├── .env.local.example
├── commitlint.config.js
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Rendering Strategy

| Surface | Strategy |
|---------|----------|
| Public pages | SSG (`generateStaticParams`) |
| Search | CSR (Fuse.js, index on demand) |
| Download counts | CSR (GitHub API) |
| Admin | CSR (local dev server only) |

## Adapter Pattern

All external integrations use swappable adapter interfaces under `/src/lib/`:

- **auth/** — `AuthAdapter`, v1: `PATAuthAdapter`
- **search/** — `SearchAdapter`, v1: `FuseAdapter`
- **analytics/** — `AnalyticsAdapter`, v1: `GitHubAnalyticsAdapter`
- **github/** — `GitHubAdapter`

Never import concrete implementations directly in UI code — always use the interface.

## Data Flow

1. Content authored as JSON/Markdown in `/data/`
2. Build-time validation against `/schemas/*.schema.json`
3. Runtime Zod validation before use
4. TypeScript types in `/src/types/` mirror schemas exactly

## i18n

- Route segment: `[locale]` (default: `ko`, supported: `ko`, `en`)
- UI strings: `/data/i18n/[locale].json`
- Per-software content: `I18nString` type `{ ko: string; en: string }`
- Fallback: `en` if `ko` is empty

## Design System

- Tokens: `/src/styles/tokens.css` (CSS variables)
- Tailwind extends tokens only — no hardcoded colors/radius/shadow
- Windows 11 Fluent: Mica, Acrylic, Glass via `backdrop-blur` + `bg-bg-mica/acrylic`
- Animations: `--ease-fluent` cubic-bezier(0.4, 0, 0.2, 1)
- Theme: `[data-theme]` on `<html>`
- Accent: `--accent` CSS variable

## CI/CD

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci.yml` | PR | typecheck → lint → validate:schemas → build → broken-links → a11y → lighthouse |
| `pages.yml` | push to `main` | build → deploy |
| `release.yml` | GitHub Release | sync metadata → validate → build → deploy |

## Branch Strategy

- `main` — production, auto-deploys
- `feature/*` — new features, PR required
- `fix/*` — bug fixes, PR required
- `release/*` — release preparation

## Versioning

Format: `MAJOR.MINOR.PATCH[-channel.N]` (e.g. `1.0.0`, `1.1.0-beta.1`)

Channels: `stable` | `beta` | `legacy`

Tags: `v1.0.0`, `v1.1.0-beta.1`
