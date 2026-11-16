import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// 프로그램 하나 = src/content/software/<slug>/index.md 폴더 하나.
// 작성법은 저장소 루트의 ADDING.md 참고.

const asset = z.object({
  type: z.enum(['installer', 'portable', 'msi', 'apk', 'store', 'other']).default('installer'),
  label: z.string().optional(),
  filename: z.string().optional(),
  url: z.string(),
  size: z.union([z.number(), z.string()]).optional(),
  sha256: z.string().optional(),
  arch: z.string().optional(),
})

const release = z.object({
  version: z.string(),
  date: z.coerce.date(),
  channel: z.enum(['stable', 'beta']).default('stable'),
  tag: z.string().optional(),
  notes: z.array(z.string()).default([]),
  notes_en: z.array(z.string()).optional(),
  downloads: z.array(asset).default([]),
})

const software = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/software',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      name_ko: z.string().optional(),
      tagline: z.string(),
      tagline_en: z.string().optional(),
      description_en: z.string().optional(),
      category: z
        .enum(['classroom', 'system', 'media', 'document', 'image', 'etc'])
        .default('etc'),
      platforms: z.array(z.enum(['windows', 'android', 'web'])).default(['windows']),
      icon: image().optional(),
      screenshots: z.array(image()).default([]),
      requirements: z.array(z.string()).default([]),
      repo: z.string().url().optional(),
      order: z.number().default(100),
      draft: z.boolean().default(false),
      releases: z.array(release).default([]),
    }),
})

export const collections = { software }
