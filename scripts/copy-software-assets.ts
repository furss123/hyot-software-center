import fs from 'fs'
import path from 'path'

const softwareDir = path.join(process.cwd(), 'data', 'software')
const publicDir = path.join(process.cwd(), 'public', 'data', 'software')

if (!fs.existsSync(softwareDir)) {
  console.log('No software data directory — skipping asset copy')
  process.exit(0)
}

let copied = 0

const topLevelAssetCandidates = [
  'icon.webp',
  'icon.png',
  'icon.svg',
  'banner.webp',
  'banner.png',
  'banner.svg',
]

for (const slug of fs.readdirSync(softwareDir)) {
  const slugDir = path.join(softwareDir, slug)
  if (!fs.statSync(slugDir).isDirectory()) continue

  const destSlugDir = path.join(publicDir, slug)

  for (const file of topLevelAssetCandidates) {
    const src = path.join(slugDir, file)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(destSlugDir, { recursive: true })
    fs.copyFileSync(src, path.join(destSlugDir, file))
    copied++
  }

  const screenshotsDir = path.join(slugDir, 'screenshots')
  if (!fs.existsSync(screenshotsDir)) continue

  const destScreenshots = path.join(destSlugDir, 'screenshots')
  fs.mkdirSync(destScreenshots, { recursive: true })

  for (const file of fs.readdirSync(screenshotsDir)) {
    const src = path.join(screenshotsDir, file)
    if (!fs.statSync(src).isFile()) continue
    fs.copyFileSync(src, path.join(destScreenshots, file))
    copied++
  }
}

console.log(`Copied ${copied} software asset(s) to public/data/software`)
