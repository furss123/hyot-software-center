'use server'

import fs from 'fs'
import path from 'path'

import { DATA_DIR } from '@/lib/data'
import { gitCommitAndPush } from '@/lib/git'
import { writeJson } from '@/lib/content'

export type SoftwareFormState = {
  ok: boolean
  message: string
}

export async function saveSoftwareMeta(
  _prev: SoftwareFormState,
  formData: FormData,
): Promise<SoftwareFormState> {
  const slug = String(formData.get('slug') ?? '').trim()
  const isNew = formData.get('isNew') === 'true'

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, message: 'Invalid slug format' }
  }

  const meta = {
    slug,
    status: String(formData.get('status') ?? 'active'),
    category: String(formData.get('category') ?? 'utility'),
    tags: String(formData.get('tags') ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    featured: formData.get('featured') === 'on',
    icon: `/icons/${slug}.svg`,
    banner: `/icons/${slug}.svg`,
    screenshots: [] as [],
    name: {
      ko: String(formData.get('name_ko') ?? ''),
      en: String(formData.get('name_en') ?? ''),
    },
    description: {
      ko: String(formData.get('description_ko') ?? ''),
      en: String(formData.get('description_en') ?? ''),
    },
    shortDescription: {
      ko: String(formData.get('shortDescription_ko') ?? ''),
      en: String(formData.get('shortDescription_en') ?? ''),
    },
    requirements: {
      os: String(formData.get('requirements_os') ?? ''),
      arch: ['x64'] as string[],
      ram: '4GB',
      disk: '100MB',
    },
    links: {
      github: `https://github.com/hyot/${slug}`,
    },
    createdAt: String(formData.get('createdAt') ?? new Date().toISOString().split('T')[0]),
    updatedAt: new Date().toISOString().split('T')[0],
  }

  const dir = path.join(DATA_DIR, 'software', slug)
  fs.mkdirSync(dir, { recursive: true })
  const metaPath = path.join(dir, 'meta.json')
  writeJson(metaPath, meta)

  if (isNew) {
    const releasesPath = path.join(dir, 'releases.json')
    if (!fs.existsSync(releasesPath)) {
      writeJson(releasesPath, {
        slug,
        latest: { stable: null, beta: null },
        releases: [],
      })
    }
  }

  const relPath = `data/software/${slug}/meta.json`
  gitCommitAndPush(`feat(software): update ${slug} meta`, [relPath])

  return { ok: true, message: 'Saved successfully' }
}

export async function saveSiteConfig(
  _prev: SoftwareFormState,
  formData: FormData,
): Promise<SoftwareFormState> {
  const configPath = path.join(DATA_DIR, 'config', 'site.config.json')
  const existing = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, unknown>

  existing.brand = {
    ...(existing.brand as object),
    name: String(formData.get('brand_name') ?? ''),
    url: String(formData.get('brand_url') ?? ''),
    github: String(formData.get('brand_github') ?? ''),
    tagline: {
      ko: String(formData.get('tagline_ko') ?? ''),
      en: String(formData.get('tagline_en') ?? ''),
    },
  }

  writeJson(configPath, existing)
  gitCommitAndPush('chore(config): update site config', ['data/config/site.config.json'])

  return { ok: true, message: 'Config saved' }
}

export async function saveFeatureFlags(
  _prev: SoftwareFormState,
  formData: FormData,
): Promise<SoftwareFormState> {
  const configPath = path.join(DATA_DIR, 'config', 'features.json')
  const existing = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<
    string,
    { status: string; description?: string }
  >

  for (const key of Object.keys(existing)) {
    const status = formData.get(`flag_${key}`)
    if (typeof status === 'string') {
      existing[key] = { ...existing[key], status }
    }
  }

  writeJson(configPath, existing)
  gitCommitAndPush('chore(features): update flags', ['data/config/features.json'])

  return { ok: true, message: 'Features saved' }
}

export async function updateReleaseChannel(
  slug: string,
  version: string,
  channel: string,
): Promise<SoftwareFormState> {
  const releasesPath = path.join(DATA_DIR, 'software', slug, 'releases.json')
  const data = JSON.parse(fs.readFileSync(releasesPath, 'utf-8')) as {
    slug: string
    latest: { stable: string | null; beta: string | null }
    releases: Array<{ version: string; channel: string }>
  }

  const release = data.releases.find((r) => r.version === version)
  if (!release) {
    return { ok: false, message: 'Release not found' }
  }
  release.channel = channel
  writeJson(releasesPath, data)
  gitCommitAndPush(`chore(release): update ${slug} ${version} channel`, [
    `data/software/${slug}/releases.json`,
  ])

  return { ok: true, message: 'Release updated' }
}
