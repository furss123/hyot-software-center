import fs from 'fs'
import path from 'path'

import type { FeatureFlags, ReleasesData, SoftwareMeta } from '@/types'

const DATA_DIR = path.resolve(process.env.DATA_DIR ?? path.join(process.cwd(), '..', 'data'))

export function getDataDir(): string {
  return DATA_DIR
}

export function getSoftwareDir(): string {
  return path.join(DATA_DIR, 'software')
}

export function getAllSlugs(): string[] {
  const dir = getSoftwareDir()
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((n) => fs.statSync(path.join(dir, n)).isDirectory())
}

export function readMeta(slug: string): SoftwareMeta | null {
  const p = path.join(getSoftwareDir(), slug, 'meta.json')
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as SoftwareMeta
}

export function writeMeta(slug: string, meta: SoftwareMeta): void {
  const dir = path.join(getSoftwareDir(), slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2))
}

export function readReleases(slug: string): ReleasesData | null {
  const p = path.join(getSoftwareDir(), slug, 'releases.json')
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as ReleasesData
}

export function writeReleases(slug: string, data: ReleasesData): void {
  const dir = path.join(getSoftwareDir(), slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'releases.json'), JSON.stringify(data, null, 2))
}

export function deleteSoftware(slug: string): void {
  const dir = path.join(getSoftwareDir(), slug)
  if (!fs.existsSync(dir)) {
    throw new Error('Not found')
  }
  fs.rmSync(dir, { recursive: true })
}

export function readFeatureFlags(): FeatureFlags {
  const p = path.join(DATA_DIR, 'config', 'features.json')
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as FeatureFlags
}

export function writeFeatureFlags(flags: FeatureFlags): void {
  const p = path.join(DATA_DIR, 'config', 'features.json')
  fs.writeFileSync(p, JSON.stringify(flags, null, 2))
}

export function readSiteConfig(): Record<string, unknown> {
  const p = path.join(DATA_DIR, 'config', 'site.config.json')
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as Record<string, unknown>
}

export function writeSiteConfig(config: Record<string, unknown>): void {
  const p = path.join(DATA_DIR, 'config', 'site.config.json')
  fs.writeFileSync(p, JSON.stringify(config, null, 2))
}

export function countNewsItems(): number {
  const dir = path.join(DATA_DIR, 'content', 'news')
  if (!fs.existsSync(dir)) return 0
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).length
}
