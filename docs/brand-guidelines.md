# HyoT — Brand & Product Guidelines

This is the source of truth for keeping every utility published on hyot.dev
consistent. Read it before adding a new program.

## Identity

- **Publisher / copyright holder:** `HyoT`. Every product and page shows
  `© <year> HyoT. All rights reserved.` (the site footer renders the year
  automatically — see `src/components/layout/Footer.tsx`).
- **Site positioning:** a focused, simple **utility hub** for Windows and
  Android. Clean and uncluttered over feature-dense.

## Naming

- **Prefix every new product name with `Hyo`.** Examples: `HyoPDF`,
  `HyoImage`, `HyoNote`. Keep it short, PascalCase, no spaces.
  - Korean display names may keep a native name, but the English `name.en`
    should carry the `Hyo` prefix so the family reads as one suite.
- The folder `slug` is lowercase-kebab and **permanent** (it is the public URL
  and SEO identity). Do not rename slugs of already-published apps — only new
  apps adopt the convention. Existing names (e.g. `BidanWin`, `Chaebi`) are
  grandfathered.

## Platforms

- Declare targets in `meta.json` via `"platforms": ["windows"]`,
  `["android"]`, or `["windows", "android"]`.
- Omitting the field defaults to `["windows"]` (legacy behavior).
- Platform badges render automatically on cards, the detail page, and the
  software-list filter via `PlatformBadges` — never hand-roll platform UI.

## Visual unity (per product)

- **Icon:** `data/software/<slug>/icon.webp`, square, 512×512, transparent or
  solid brand background. Single focal glyph, generous padding.
- **Banner:** `data/software/<slug>/banner.webp`, wide (≈1200×480).
- **Accent:** lean on the site tokens (`--hyot-blue #4A9FE0`,
  `--hyot-purple #8B4FCC`, `--hyot-orange #E87820`). Avoid introducing new
  brand hues per app.
- **Category & tags:** pick one `category` from the fixed enum; keep tags
  lowercase, ≤ 10, platform/feature oriented.

## Copy tone

- Korean-first, plain and practical. Short feature bullets, no marketing fluff.
- Each `description` ends with `제작: HyoT · © <year>` (KO) /
  `Author: HyoT · © <year>` (EN).

## Adding a new product (checklist)

1. Create `data/software/<slug>/meta.json` (+ `icon.webp`, `banner.webp`).
2. Set `name.en` with the `Hyo` prefix and the correct `platforms`.
3. Add `releases.json`.
4. Run `npm run validate:schemas` then `npm run build`.
