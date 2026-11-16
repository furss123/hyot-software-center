import { getCollection, type CollectionEntry } from 'astro:content'
import type { Locale } from './i18n'

export type Software = CollectionEntry<'software'>
export type Release = Software['data']['releases'][number]

const byDateDesc = (a: Release, b: Release) => b.date.getTime() - a.date.getTime()

export async function getSoftware(): Promise<Software[]> {
  const all = await getCollection('software', ({ data }) => !data.draft)
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name))
}

export const sortedReleases = (s: Software): Release[] => [...s.data.releases].sort(byDateDesc)

export const latestRelease = (s: Software, channel: 'stable' | 'beta' = 'stable') =>
  sortedReleases(s).find((r) => r.channel === channel)

export const latestAny = (s: Software) => latestRelease(s) ?? sortedReleases(s)[0]

export async function getAllReleases() {
  const list = await getSoftware()
  return list
    .flatMap((software) => software.data.releases.map((release) => ({ software, release })))
    .sort((a, b) => byDateDesc(a.release, b.release))
}

export const displayName = (s: Software, locale: Locale) =>
  locale === 'ko' && s.data.name_ko ? s.data.name_ko : s.data.name

export const tagline = (s: Software, locale: Locale) =>
  locale === 'en' && s.data.tagline_en ? s.data.tagline_en : s.data.tagline

export const notes = (r: Release, locale: Locale) =>
  locale === 'en' && r.notes_en?.length ? r.notes_en : r.notes
