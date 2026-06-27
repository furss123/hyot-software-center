import fs from 'fs'
import path from 'path'

import { getAllSoftware } from '../src/lib/content/software'

type SearchDocType = 'software'

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

const allDocs: SearchDoc[] = getAllSoftware().map((app) => ({
  id: `software-${app.slug}`,
  type: 'software',
  slug: app.slug,
  name_ko: app.name.ko,
  name_en: app.name.en,
  description_ko: app.description.ko,
  description_en: app.description.en,
  tags: app.tags,
}))

const outDir = path.join(process.cwd(), 'public', 'search')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(allDocs, null, 2))

process.stdout.write(`Search index built: ${allDocs.length} documents\n`)
