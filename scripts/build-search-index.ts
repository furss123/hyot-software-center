import fs from 'fs'
import path from 'path'

import { getAllNews } from '../src/lib/content/news'
import { getAllSoftware } from '../src/lib/content/software'

type SearchDocType = 'software' | 'news'

interface SearchDoc {
  id: string
  type: SearchDocType
  slug: string
  name_ko: string
  name_en: string
  description_ko: string
  description_en: string
  tags: string[]
}

const software = getAllSoftware()
const softwareDocs: SearchDoc[] = software.map((app) => ({
  id: `software-${app.slug}`,
  type: 'software',
  slug: app.slug,
  name_ko: app.name.ko,
  name_en: app.name.en,
  description_ko: app.description.ko,
  description_en: app.description.en,
  tags: app.tags,
}))

const news = getAllNews()
const newsDocs: SearchDoc[] = news.map((n) => ({
  id: `news-${n.slug}`,
  type: 'news',
  slug: n.slug,
  name_ko: n.title.ko,
  name_en: n.title.en,
  description_ko: n.summary.ko,
  description_en: n.summary.en,
  tags: n.tags,
}))

const allDocs: SearchDoc[] = [...softwareDocs, ...newsDocs]

const outDir = path.join(process.cwd(), 'public', 'search')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(allDocs, null, 2))

process.stdout.write(`Search index built: ${allDocs.length} documents\n`)
