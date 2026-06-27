import fs from 'fs'
import path from 'path'

import { getSiteConfig } from '../src/lib/content/config'
import { getAllDocs } from '../src/lib/content/docs'
import { getAllNews } from '../src/lib/content/news'
import { getAllSoftware } from '../src/lib/content/software'

const config = getSiteConfig()
const BASE = config.brand.url
const locales = ['ko', 'en']

const staticRoutes = ['', '/software', '/changelog', '/docs', '/news', '/faq', '/about', '/security']

const software = getAllSoftware()
const news = getAllNews()
const docs = getAllDocs()

const urls: string[] = []

for (const locale of locales) {
  for (const route of staticRoutes) {
    urls.push(`${BASE}/${locale}${route}`)
  }
  for (const app of software) {
    urls.push(`${BASE}/${locale}/software/${app.slug}`)
    urls.push(`${BASE}/${locale}/software/${app.slug}/changelog`)
  }
  for (const item of news) {
    urls.push(`${BASE}/${locale}/news/${item.slug}`)
  }
  for (const doc of docs) {
    urls.push(`${BASE}/${locale}/docs/${doc.slug}`)
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml)
process.stdout.write(`Sitemap: ${urls.length} URLs\n`)
