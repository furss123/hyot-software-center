# HyoT — Program Starter Kit

The things to set up **before writing any feature code** for a new HyoT
program, so every app shares one identity. Copy the templates below.
High-level rationale lives in [`brand-guidelines.md`](./brand-guidelines.md).

---

## 0. The 7 things to decide first

| # | Item | Example |
|---|------|---------|
| 1 | Product name (`Hyo` prefix) | `HyoPDF`, `HyoImage` |
| 2 | slug (lowercase-kebab, permanent) | `hyopdf` |
| 3 | Platform(s) | Windows / Android / both |
| 4 | One-line description (KO + EN) | "탭 기반 PDF 뷰어" |
| 5 | Category | `utility` |
| 6 | App icon (512×512) | brand-tinted glyph |
| 7 | Copyright owner | **HyoT** (always) |

---

## 1. Naming

- **Product name = `Hyo` + short PascalCase noun.** No spaces: `HyoNote`,
  `HyoClip`, `HyoShot`. Korean display name may differ, but `name.en` carries
  the `Hyo` prefix so the suite reads as one family.
- **slug** is lowercase-kebab, becomes the public URL, and is **permanent** —
  pick carefully. Folder: `data/software/<slug>/`.
- **Installer / package id:** `com.hyot.<slug>` (Android) /
  `HyoT.<Name>` (Windows app id).

---

## 2. Identity strings (use verbatim)

- Publisher / copyright holder: **`HyoT`** (never change).
- Copyright line: `© <year> HyoT. All rights reserved.`
- About / footer credit:
  - KO: `제작: HyoT · © <year>`
  - EN: `Author: HyoT · © <year>`
- Support / feedback: route users to `https://hyot.dev` (the program's page
  has a Feedback tab).

---

## 3. Brand colors (copy into the app theme)

```
Primary   HyoT Blue     #4A9FE0   (accent / primary action)
          Blue Dark     #2B7CC7   (hover / pressed)
          Blue Light    #7BBFED
Secondary Purple        #8B4FCC
Accent    Orange        #E87820   (warnings / highlights)
          Teal          #2A9B8A   (success)
Error                   #FF7070 (dark)  /  #C42B1C (light)
```

- **Accent is always HyoT Blue.** Don't invent a new primary hue per app.
- **Dark-first**, but ship both. Dark base `#07090C`, surface `#0D1117`;
  light base `#F6F8FC`, surface `#FFFFFF`.
- Text on dark: `#EEF2FF` / `#8896AA` / `#4A5870` (primary/secondary/tertiary).

---

## 4. Design language

- **Windows Fluent / Mica** feel: tonal elevation, soft depth, subtle blue-
  tinted borders, generous rounding.
- Radii: `4 / 6 / 8 / 12 / 16 px`. Use 8–12 for cards/buttons.
- Motion: fast and quiet — 80ms / 160ms / 260ms, ease `cubic-bezier(.4,0,.2,1)`.
- Type: **Pretendard** (UI), **JetBrains Mono** (versions, code, checksums).
- Keep it **simple**: one focal action per screen, no decorative clutter.

---

## 5. Icon & assets

| Asset | Spec |
|-------|------|
| App icon | 512×512, square, single focal glyph, generous padding, brand-blue accent |
| Site icon | `data/software/<slug>/icon.webp` (512×512) |
| Site banner | `data/software/<slug>/banner.webp` (~1200×480) |
| Screenshot | `data/software/<slug>/screenshots/main.png` |

Style: flat, one accent color over a neutral/dark base. The glyph should read
at 24px (favicon/taskbar).

---

## 6. Publish-to-site template — `data/software/<slug>/meta.json`

```json
{
  "slug": "hyoexample",
  "status": "active",
  "category": "utility",
  "platforms": ["windows"],
  "tags": ["windows", "utility"],
  "featured": false,
  "icon": "/data/software/hyoexample/icon.webp",
  "banner": "/data/software/hyoexample/banner.webp",
  "name": { "ko": "예시", "en": "HyoExample" },
  "shortDescription": { "ko": "한 줄 설명", "en": "One-line description" },
  "description": {
    "ko": "...\n\n제작: HyoT · © 2026",
    "en": "...\n\nAuthor: HyoT · © 2026"
  },
  "requirements": { "os": "Windows 10 / 11 (64-bit)" },
  "links": { "github": "https://github.com/furss123/hyoexample" },
  "githubRepo": "furss123/hyoexample",
  "createdAt": "2026-01-01",
  "updatedAt": "2026-01-01",
  "visible": true
}
```

Also add `data/software/<slug>/releases.json`, then run
`npm run validate:schemas && npm run build`.

For an Android app set `"platforms": ["android"]` and an appropriate
`requirements.os` (e.g. `Android 9.0+`); platform badges/filters update
automatically.

---

## 7. In-app boilerplate checklist

- [ ] Window/app title shows the `Hyo` name.
- [ ] About dialog: name, version (mono font), `제작: HyoT · © <year>`.
- [ ] Accent color = HyoT Blue; dark + light themes.
- [ ] Icon set exported (16/24/32/48/256/512).
- [ ] "More from HyoT" / feedback link → `https://hyot.dev`.
- [ ] License/EULA names **HyoT** as the author.
