import fs from 'fs'
import path from 'path'

import { getSiteConfig } from '../src/lib/content/config'
import { getAllLatestReleases } from '../src/lib/content/releases'

const config = getSiteConfig()
const BASE = config.brand.url
const now = new Date().toUTCString()

const releases = getAllLatestReleases()
const releaseItems = releases
  .map(
    ({ slug, release }) => `
  <item>
    <title><![CDATA[${slug} v${release.version} (${release.channel})]]></title>
    <link>${BASE}/en/software/${slug}</link>
    <guid>${BASE}/en/software/${slug}/releases/${release.version}</guid>
    <pubDate>${new Date(release.releaseDate).toUTCString()}</pubDate>
    <description><![CDATA[${release.notes?.en ?? ''}]]></description>
  </item>`,
  )
  .join('')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.brand.name}</title>
    <link>${BASE}</link>
    <description>Releases from ${config.brand.name}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    ${releaseItems}
  </channel>
</rss>`

fs.writeFileSync(path.join(process.cwd(), 'public', 'feed.xml'), rss)
process.stdout.write(`RSS: ${releases.length} items\n`)
