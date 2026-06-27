import { NextResponse } from 'next/server'

import { gitCommitAndPush } from '@/lib/git'
import { readMeta, readReleases, writeReleases } from '@/lib/data'
import type { Release, ReleaseAsset, ReleaseChannel, ReleasesData } from '@/types'

type GitHubRelease = {
  tag_name: string
  published_at: string
  assets: Array<{
    name: string
    browser_download_url: string
    size: number
    download_count: number
  }>
}

function inferChannel(tag: string): ReleaseChannel {
  const normalized = tag.replace(/^v/, '').toLowerCase()
  if (normalized.includes('beta')) return 'beta'
  if (normalized.includes('legacy')) return 'legacy'
  return 'stable'
}

function inferAssetType(filename: string): ReleaseAsset['type'] {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.exe') || lower.endsWith('.msi')) return 'installer'
  if (lower.endsWith('.zip') || lower.endsWith('.7z')) return 'portable'
  return 'checksum'
}

function parseVersion(tag: string): string {
  return tag.replace(/^v/, '')
}

function findExistingSha256(
  existing: ReleasesData | null,
  version: string,
  filename: string,
): string {
  const release = existing?.releases.find((r) => r.version === version)
  const asset = release?.assets.find((a) => a.filename === filename)
  return asset?.sha256 ?? '0'.repeat(64)
}

function computeLatest(releases: Release[]): { stable: string | null; beta: string | null } {
  const stable = releases
    .filter((r) => r.channel === 'stable')
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0]
  const beta = releases
    .filter((r) => r.channel === 'beta')
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0]
  return {
    stable: stable?.version ?? null,
    beta: beta?.version ?? null,
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as { slug?: string }
  const slug = body.slug

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER ?? 'furss123'

  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }

  const meta = readMeta(slug)
  const repoPath = meta?.githubRepo?.includes('/')
    ? meta.githubRepo
    : `${owner}/${slug}`

  const res = await fetch(`https://api.github.com/repos/${repoPath}/releases`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: `GitHub API error: ${res.status}` }, { status: 502 })
  }

  const ghReleases = (await res.json()) as GitHubRelease[]
  const existing = readReleases(slug) ?? {
    slug,
    latest: { stable: null, beta: null },
    releases: [],
  }

  const merged = new Map<string, Release>()
  for (const r of existing.releases) {
    merged.set(r.version, r)
  }

  for (const gh of ghReleases) {
    const version = parseVersion(gh.tag_name)
    const channel = inferChannel(gh.tag_name)
    const prev = merged.get(version)

    const assets: ReleaseAsset[] = gh.assets.map((a) => ({
      type: inferAssetType(a.name),
      filename: a.name,
      url: a.browser_download_url,
      size: a.size,
      sha256: findExistingSha256(existing, version, a.name),
      downloadCount: a.download_count,
    }))

    merged.set(version, {
      version,
      channel: prev?.channel ?? channel,
      releaseDate: gh.published_at.split('T')[0],
      githubTag: gh.tag_name,
      notes: prev?.notes,
      assets: assets.length > 0 ? assets : (prev?.assets ?? []),
    })
  }

  const releases = [...merged.values()].sort((a, b) =>
    b.releaseDate.localeCompare(a.releaseDate),
  )

  const updated: ReleasesData = {
    slug,
    latest: computeLatest(releases),
    releases,
  }

  writeReleases(slug, updated)
  gitCommitAndPush(`chore(release): sync ${slug} from GitHub`, [
    `data/software/${slug}/releases.json`,
  ])
  return NextResponse.json(updated)
}
