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

## Visual language — the HyoT app standard

Reference implementation: **Chaebi (채비)**. Every HyoT desktop/app UI should
feel like it came from the same studio. The DNA:

### Layout
- **Modular widget/panel layout.** A side rail of self-contained cards
  (clock, to-do, memo, D-Day…) beside a larger primary surface (calendar,
  editor, viewer). Panels are reorderable and toggleable by the user.
- **Rounded everything.** Cards & cells `12–16px`; chips, buttons, inputs are
  pill/`8px`. Generous padding and whitespace — airy, never dense.
- **Glass / Mica depth.** Surfaces sit over the OS wallpaper with an adjustable
  *glass opacity* slider; soft tonal elevation, subtle blue-tinted borders.

### Color & themes
- **Light:** airy blue-grey base (`#F6F8FC`), white cards, soft shadows.
- **Dark:** near-black base (`#07090C`), dark cards, low-glow borders.
- **Accent = HyoT Blue `#4A9FE0`** for primary buttons, sliders, selected
  radios/checks. **Green/Teal `#2A9B8A`** for success/done states.
- **Category chips** are multi-color pills with an `×` dismiss, e.g.
  brown/tan, purple, green — used to tag/label items. Keep the chip set small
  and consistent across the app.
- Weekday/semantic accents: Sunday red, Saturday blue (locale-aware).

### Controls & settings
- **Settings = centered modal** titled `설정`, with a `✕ 닫기` button, split into
  **grouped section cards**: Language · Theme (라이트/다크/자동), Panel layout
  (left/right + drag-handle reordering + show/hide), Font (family + title/body/
  time size sliders + reset), Glass opacity, Data backup (JSON/ICS export +
  import).
- **Customization-forward:** let users tune font, sizes, opacity, panel order,
  theme, and language. Persist locally; offer JSON export/import for migration.
- Small confirmation **toast** for state changes (e.g. "테마 설정이 변경되었습니다").

### Typography
- **Pretendard** for UI; allow a user-selectable display font. Large bold
  numerals for clocks/timers. **JetBrains Mono** for version strings.

### App footer / about (use verbatim format)
```
AppName (한글명) vX.Y.Z | © <year> HyoT. All rights reserved.
```
Example: `Chaebi (채비) v1.2.1 | © 2026 HyoT. All rights reserved.`

## Adding a new product (checklist)

1. Create `data/software/<slug>/meta.json` (+ `icon.webp`, `banner.webp`).
2. Set `name.en` with the `Hyo` prefix and the correct `platforms`.
3. Add `releases.json`.
4. Run `npm run validate:schemas` then `npm run build`.
