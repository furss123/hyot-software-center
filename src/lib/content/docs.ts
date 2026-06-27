import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import type { DocItem } from '@/types'

const DOCS_DIR = path.join(process.cwd(), 'data', 'content', 'docs')

export function getAllDocs(): DocItem[] {
  if (!fs.existsSync(DOCS_DIR)) return []
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(DOCS_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug: data.slug as string,
        title: data.title as { ko: string; en: string },
        order: (data.order as number) ?? 99,
        content,
      }
    })
    .sort((a, b) => a.order - b.order)
}

export function getDocItem(slug: string): DocItem | null {
  return getAllDocs().find((d) => d.slug === slug) ?? null
}
