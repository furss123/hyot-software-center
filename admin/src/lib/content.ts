import fs from 'fs'
import path from 'path'

import { DATA_DIR } from '@/lib/data'

export function listSoftwareSlugs(): string[] {
  const dir = path.join(DATA_DIR, 'software')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((name) => {
    return fs.statSync(path.join(dir, name)).isDirectory()
  })
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
}

export function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8')
}

export function countReleases(): number {
  let total = 0
  for (const slug of listSoftwareSlugs()) {
    const file = path.join(DATA_DIR, 'software', slug, 'releases.json')
    if (!fs.existsSync(file)) continue
    const data = readJson<{ releases: unknown[] }>(file)
    total += data.releases.length
  }
  return total
}
