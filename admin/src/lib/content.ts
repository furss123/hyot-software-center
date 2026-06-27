import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { getDataDir } from './data'

export interface NewsItemAdmin {
  slug: string
  title: { ko: string; en: string }
  summary: { ko: string; en: string }
  date: string
  published: boolean
  tags: string[]
  content: string
  filename: string
}

export interface FaqItemAdmin {
  id: string
  order: number
  question: { ko: string; en: string }
  answer: { ko: string; en: string }
  category: string
}

function getNewsDir(): string {
  return path.join(getDataDir(), 'content', 'news')
}

function parseNewsFile(filename: string): NewsItemAdmin {
  const raw = fs.readFileSync(path.join(getNewsDir(), filename), 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug: data.slug as string,
    title: data.title as { ko: string; en: string },
    summary: data.summary as { ko: string; en: string },
    date: data.date as string,
    published: data.published as boolean,
    tags: (data.tags as string[]) ?? [],
    content,
    filename,
  }
}

export function getAllNewsAdmin(): NewsItemAdmin[] {
  const dir = getNewsDir()
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map(parseNewsFile)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNewsItemAdmin(slug: string): NewsItemAdmin | null {
  const dir = getNewsDir()
  if (!fs.existsSync(dir)) return null
  for (const filename of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const item = parseNewsFile(filename)
    if (item.slug === slug) return item
  }
  return null
}

export function writeNewsItem(
  data: Omit<NewsItemAdmin, 'filename'>,
  existingFilename?: string,
): string {
  const dir = getNewsDir()
  fs.mkdirSync(dir, { recursive: true })

  const filename = existingFilename ?? `${data.date}-${data.slug}.md`
  const frontmatter = {
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    date: data.date,
    published: data.published,
    tags: data.tags,
  }
  const fileContent = matter.stringify(data.content, frontmatter)
  fs.writeFileSync(path.join(dir, filename), fileContent)
  return `data/content/news/${filename}`
}

export function getFaqPath(): string {
  return path.join(getDataDir(), 'content', 'faq', 'items.json')
}

export function readFaqItems(): FaqItemAdmin[] {
  const p = getFaqPath()
  if (!fs.existsSync(p)) return []
  const raw = JSON.parse(fs.readFileSync(p, 'utf-8')) as FaqItemAdmin[]
  return raw.sort((a, b) => a.order - b.order)
}

export function writeFaqItems(items: FaqItemAdmin[]): string {
  const p = getFaqPath()
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(items, null, 2))
  return 'data/content/faq/items.json'
}
