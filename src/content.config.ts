import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// 프로그램 하나 = src/content/software/<slug>/index.md 폴더 하나.
// 작성법은 저장소 루트의 ADDING.md 참고.

const asset = z.object({
  type: z.enum(['installer', 'portable', 'msi', 'apk', 'store', 'other']).default('installer'),
  label: z.string().optional(),
  label_en: z.string().optional(),
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
      // 설치 없이 쓰는 웹 버전의 주소(언어 폴더 아래 경로). 예: moagyeol-pdf → /ko/moagyeol-pdf/
      web: z.string().optional(),
      icon: image().optional(),
      cover: image().optional(),
      // fill: 삽화처럼 표지 칸을 꽉 채운다. frame: 스크린샷처럼 잘리지 않게 테두리 안에 넣는다.
      // 표지가 없으면 첫 스크린샷을 frame으로 보여 준다.
      cover_fit: z.enum(['fill', 'frame']).default('fill'),
      screenshots: z.array(image()).default([]),
      // screenshots와 같은 순서의 설명. 없으면 "이름 · 사용 화면 N"으로 표시한다.
      screenshot_titles: z.array(z.string()).default([]),
      screenshot_titles_en: z.array(z.string()).optional(),
      requirements: z.array(z.string()).default([]),
      requirements_en: z.array(z.string()).optional(),
      repo: z.url().optional(),
      order: z.number().default(100),
      draft: z.boolean().default(false),
      releases: z.array(release).default([]),
    }),
})

export const collections = { software }
