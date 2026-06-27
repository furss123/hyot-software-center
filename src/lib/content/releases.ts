import fs from 'fs'
import path from 'path'
import type { ReleasesData, Release } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data', 'software')

export function getReleasesData(slug: string): ReleasesData | null {
  const filePath = path.join(DATA_DIR, slug, 'releases.json')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as ReleasesData
}

export function getLatestRelease(
  slug: string,
  channel: 'stable' | 'beta' = 'stable',
): Release | null {
  const data = getReleasesData(slug)
  if (!data) return null
  const version = data.latest[channel]
  if (!version) return null
  return data.releases.find((r) => r.version === version) ?? null
}

export function getAllLatestReleases(): Array<{ slug: string; release: Release }> {
  const dataDir = path.join(process.cwd(), 'data', 'software')
  if (!fs.existsSync(dataDir)) return []
  const slugs = fs.readdirSync(dataDir)
  return slugs
    .map((slug) => {
      const release = getLatestRelease(slug)
      return release ? { slug, release } : null
    })
    .filter((r): r is { slug: string; release: Release } => r !== null)
    .sort((a, b) => b.release.releaseDate.localeCompare(a.release.releaseDate))
}
