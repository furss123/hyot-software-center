import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i] ?? 'B'}`
}

export function formatDate(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function slugToColor(slug: string): string {
  const colors = [
    'linear-gradient(135deg, #2B7CC7, #4A9FE0)',
    'linear-gradient(135deg, #6B35A8, #8B4FCC)',
    'linear-gradient(135deg, #C85A00, #E87820)',
    'linear-gradient(135deg, #1A7A6A, #2A9B8A)',
  ]
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length] ?? colors[0]!
}

export function slugToHue(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

export function sumDownloadCounts(
  releases: Array<{ assets: Array<{ downloadCount?: number }> }> | undefined,
): number {
  if (!releases) return 0
  return releases.reduce(
    (sum, r) => sum + r.assets.reduce((s, a) => s + (a.downloadCount ?? 0), 0),
    0,
  )
}
