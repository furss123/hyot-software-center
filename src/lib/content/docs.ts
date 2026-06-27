import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { I18nString } from '@/types'

const DOCS_DIR = path.join(process.cwd(), 'data', 'content', 'docs')

export type DocFrontmatter = {
  title: I18nString
  order: number
}

export type DocEntry = {
  slug: string
  frontmatter: DocFrontmatter
  content: string
}

export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return []
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getDocBySlug(slug: string): DocEntry | null {
  const filePath = path.join(DOCS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    frontmatter: data as DocFrontmatter,
    content,
  }
}

export function getAllDocs(): DocEntry[] {
  return getAllDocSlugs()
    .map((slug) => getDocBySlug(slug))
    .filter((d): d is DocEntry => d !== null)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order)
}
