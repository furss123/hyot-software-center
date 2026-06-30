# HyoT — Reusable Image Prompts (icons / banners / OG)

AI-generation prompts that produce **consistent, on-brand** artwork for every
HyoT program. Only swap the `{ }` fields. Backgrounds are **transparent (PNG
alpha)**. Brand rules: see [`brand-guidelines.md`](./brand-guidelines.md).

Constants (do not change):
- Gradient: **#4A9FE0 (top-left) → #2B7CC7 (bottom-right)**, ~135°
- Glyph color: **white** (`#FFFFFF`), or very light blue tint
- Shape: rounded square, corner radius ≈ 22% of size, ~18% safe padding
- Style: flat, minimal, single glyph, no text

---

## 1. App icon (master prompt) — transparent

```
A clean, modern, flat app icon for "{APP_NAME}", a {ONE_LINE_CONCEPT}.
A single centered {GLYPH} symbol in white, on a rounded-square tile with a
smooth diagonal gradient from #4A9FE0 (top-left) to #2B7CC7 (bottom-right),
corner radius about 22%, generous padding (~18% safe margin). Minimalist
solid/line icon style, soft subtle depth, crisp clean geometry, perfectly
centered, no text, no letters. Transparent background outside the rounded
square (PNG alpha). 1024x1024, vector-like, high detail, part of one unified
app suite.
```

**Negative prompt:**
```
photorealistic, 3D bevel, heavy drop shadow, glossy reflections, gradient
mesh noise, busy background, multiple objects, text, letters, watermark,
outer border frame, opaque or colored canvas background, clutter
```

**Export:** master 1024×1024 transparent PNG → resize to
512 / 256 / 128 / 48 / 32 / 24 / 16.

### Glyph-only variant (no tile, fully transparent)
Replace the tile sentence with:
```
A single {GLYPH} symbol filled with a diagonal gradient from #4A9FE0 to
#2B7CC7, no background tile, fully transparent background, generous padding.
```

---

## 2. Per-program examples (drop-in `{GLYPH}` / concept)

| App | `{ONE_LINE_CONCEPT}` | `{GLYPH}` |
|-----|----------------------|-----------|
| Chaebi (채비) | desktop wallpaper calendar | a calendar grid with a clock accent |
| HyoPDF | tabbed PDF viewer & tools | a document page with a folded corner |
| HyoImage | image conversion & editing tools | overlapping picture/mountains frame |
| HyoNote | quick note & memo app | a sticky note with a pin |
| HyoClip | clipboard manager | stacked layered cards |
| HyoShot | screenshot & capture tool | a viewfinder / crop corners |

> Keep the glyph to **one idea**. It must still read at 24px.

---

## 3. Banner (1200×480, transparent or dark)

```
A wide brand banner (1200x480) for "{APP_NAME}". On the left, the app's white
{GLYPH} on a rounded-square #4A9FE0→#2B7CC7 gradient tile; ample empty space on
the right reserved for the product name. Flat minimal style, soft depth,
transparent background, clean modern tech aesthetic, consistent HyoT brand.
No text.
```
(Add the product name + one-line tagline as real text afterward — don't let
the model render type.)

---

## 4. Social / OG image (1200×630)

```
A 1200x630 promotional image for "{APP_NAME}" by HyoT. Centered white {GLYPH}
on a deep dark base (#07090C) with a soft #4A9FE0 radial glow, rounded-square
motif, flat minimal, lots of negative space for an overlaid title. Clean,
premium, unified brand look. No text.
```

---

## 5. Tips for consistency

- **Reuse the exact same master prompt** for every app — only change `{GLYPH}`
  and `{ONE_LINE_CONCEPT}`. That's what makes the suite look unified.
- Generate at 1024px, then downscale (don't upscale).
- Verify legibility at 16/24px before shipping.
- Final files: app `icon.png` set + site `data/software/<slug>/icon.webp`
  (512), `banner.webp` (1200×480).
