import fs from 'fs'
import path from 'path'

import { getSiteConfig } from '../src/lib/content/config'
import { getAllNews } from '../src/lib/content/news'
import { getAllLatestReleases } from '../src/lib/content/releases'

const config = getSiteConfig()
const BASE = config.brand.url
const now = new Date().toUTCString()

const news = getAllNews()
const newsItems = news
  .map(
    (n) => `
  <item>
    <title><![CDATA[${n.title.en}]]></title>
    <link>${BASE}/en/news/${n.slug}</link>
    <guid>${BASE}/en/news/${n.slug}</guid>
    <pubDate>${new Date(n.date).toUTCString()}</pubDate>
    <description><![CDATA[${n.summary.en}]]></description>
  </item>`,
  )
  .join('')

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
    <description>News and releases from ${config.brand.name}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    ${newsItems}
    ${releaseItems}
  </channel>
</rss>`

fs.writeFileSync(path.join(process.cwd(), 'public', 'feed.xml'), rss)
console.log(`RSS: ${news.length + releases.length} items`)
