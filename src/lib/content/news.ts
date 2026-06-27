import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import type { I18nString, NewsItem } from '@/types'

const NEWS_DIR = path.join(process.cwd(), 'data', 'content', 'news')

export function getAllNews(): NewsItem[] {
  if (!fs.existsSync(NEWS_DIR)) return []
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(NEWS_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug: data.slug as string,
        title: data.title as I18nString,
        summary: data.summary as I18nString,
        date: data.date as string,
        published: data.published as boolean,
        tags: (data.tags as string[]) ?? [],
        content,
      }
    })
    .filter((n) => n.published)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNewsItem(slug: string): NewsItem | null {
  const all = getAllNews()
  return all.find((n) => n.slug === slug) ?? null
}
