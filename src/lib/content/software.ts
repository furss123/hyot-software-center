import fs from 'fs'
import path from 'path'
import type { Platform, SoftwareMeta } from '@/types'

/** Platforms a piece of software targets; defaults to Windows for legacy meta. */
export function softwarePlatforms(meta: Pick<SoftwareMeta, 'platforms'>): Platform[] {
  return meta.platforms && meta.platforms.length > 0 ? meta.platforms : ['windows']
}

const DATA_DIR = path.join(process.cwd(), 'data', 'software')

export function getAllSoftwareSlugs(): string[] {
  if (!fs.existsSync(DATA_DIR)) return []
  return fs.readdirSync(DATA_DIR).filter((name) => {
    const stat = fs.statSync(path.join(DATA_DIR, name))
    return stat.isDirectory()
  })
}

export function getSoftwareMeta(slug: string): SoftwareMeta | null {
  const filePath = path.join(DATA_DIR, slug, 'meta.json')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as SoftwareMeta
}

export function isSoftwareVisible(meta: SoftwareMeta): boolean {
  return meta.visible !== false
}

export function getAllSoftware(): SoftwareMeta[] {
  return getAllSoftwareSlugs()
    .map((slug) => getSoftwareMeta(slug))
    .filter((s): s is SoftwareMeta => s !== null)
    .filter((s) => s.status !== 'archived')
    .filter(isSoftwareVisible)
}

/** Slugs included in public listings, search, sitemap, and static routes */
export function getPublicSoftwareSlugs(): string[] {
  return getAllSoftware().map((s) => s.slug)
}

export function getFeaturedSoftware(): SoftwareMeta[] {
  return getAllSoftware().filter((s) => s.featured)
}
