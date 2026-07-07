/**
 * Syncs GitHub Release metadata to /data/software/[slug]/releases.json
 * Env: GITHUB_TOKEN, RELEASE_TAG, RELEASE_SLUG
 */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const token = process.env['GITHUB_TOKEN']
const tag = process.env['RELEASE_TAG']
const slug = process.env['RELEASE_SLUG']

if (!token || !tag || !slug) {
  process.stderr.write('Missing required env vars: GITHUB_TOKEN, RELEASE_TAG, RELEASE_SLUG\n')
  process.exit(1)
}

async function computeSha256(url: string): Promise<string> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const buffer = await res.arrayBuffer()
  return crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex')
}

async function main(): Promise<void> {
  const owner = process.env['GITHUB_REPOSITORY_OWNER'] ?? 'hyot'
  const repo = slug

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } },
  )

  if (!res.ok) {
    process.stderr.write(`GitHub API error: ${res.status}\n`)
    process.exit(1)
  }

  const release = (await res.json()) as {
    tag_name: string
    published_at: string
    body: string
    assets: Array<{
      name: string
      browser_download_url: string
      size: number
      download_count: number
    }>
  }

  const assets = await Promise.all(
    release.assets
      .filter((a) => a.name.endsWith('.exe') || a.name.endsWith('.msi') || a.name.endsWith('.zip'))
      .map(async (a) => ({
        type: a.name.endsWith('.zip') ? ('portable' as const) : ('installer' as const),
        filename: a.name,
        url: a.browser_download_url,
        size: a.size,
        sha256: await computeSha256(a.browser_download_url),
        downloadCount: a.download_count,
      })),
  )

  const version = tag!.replace(/^v/, '')
  const releaseDate =
    release.published_at.split('T')[0] ?? new Date().toISOString().split('T')[0] ?? ''

  const dataPath = path.join(process.cwd(), 'data', 'software', slug!, 'releases.json')

  let existing = {
    slug,
    latest: { stable: null as string | null, beta: null as string | null },
    releases: [] as unknown[],
  }
  if (fs.existsSync(dataPath)) {
    existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as typeof existing
  }

  const channel = version.includes('beta') ? ('beta' as const) : ('stable' as const)

  const newRelease = {
    version,
    channel,
    releaseDate,
    githubTag: tag,
    notes: { ko: release.body, en: release.body },
    assets,
  }

  const filtered = (existing.releases as Array<{ version: string }>).filter(
    (r) => r.version !== version,
  )

  existing.releases = [newRelease, ...filtered]
  existing.latest[channel] = version
  existing.slug = slug

  fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2))
  process.stdout.write(`Synced release ${tag} for ${slug}\n`)
}

main().catch((e: unknown) => {
  process.stderr.write(String(e))
  process.exit(1)
})
