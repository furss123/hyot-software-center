import fs from 'fs'
import path from 'path'

import { getSiteConfig } from '../src/lib/content/config'
import { getAllSoftware } from '../src/lib/content/software'

const config = getSiteConfig()
const BASE = config.brand.url
const locales = ['ko', 'en']

const staticRoutes = ['', '/software', '/changelog', '/security']

const software = getAllSoftware()

const urls: string[] = []

for (const locale of locales) {
  for (const route of staticRoutes) {
    urls.push(`${BASE}/${locale}${route}`)
  }
  for (const app of software) {
    urls.push(`${BASE}/${locale}/software/${app.slug}`)
    urls.push(`${BASE}/${locale}/software/${app.slug}/changelog`)
    urls.push(`${BASE}/${locale}/software/${app.slug}/feedback`)
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml)
process.stdout.write(`Sitemap: ${urls.length} URLs\n`)
