import fs from 'fs'
import path from 'path'

import { getAllSoftware } from '../src/lib/content/software'

const OUT_DIR = path.join(process.cwd(), 'public', 'og')
fs.mkdirSync(OUT_DIR, { recursive: true })

const software = getAllSoftware()

for (const app of software) {
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0A0A0A"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#grad)"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0078D4;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#0A0A0A;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect x="80" y="80" width="80" height="80" rx="20" fill="#0078D4"/>
  <text x="120" y="138" font-family="system-ui" font-size="48" fill="white" text-anchor="middle">H</text>
  <text x="80" y="320" font-family="system-ui" font-size="64" font-weight="700" fill="#F0F0F0">${app.name.en}</text>
  <text x="80" y="390" font-family="system-ui" font-size="32" fill="#A0A0A0">${app.shortDescription.en}</text>
  <text x="80" y="560" font-family="system-ui" font-size="28" fill="#686868">HyoT Software Center</text>
</svg>`
  fs.writeFileSync(path.join(OUT_DIR, `${app.slug}.png`), svg)
  process.stdout.write(`OG: ${app.slug}\n`)
}

const defaultSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0A0A0A"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#grad)"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0078D4;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#0A0A0A;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect x="80" y="80" width="80" height="80" rx="20" fill="#0078D4"/>
  <text x="120" y="138" font-family="system-ui" font-size="48" fill="white" text-anchor="middle">H</text>
  <text x="80" y="320" font-family="system-ui" font-size="72" font-weight="700" fill="#F0F0F0">HyoT Software Center</text>
  <text x="80" y="400" font-family="system-ui" font-size="36" fill="#A0A0A0">Free Windows Utility Software</text>
</svg>`
fs.writeFileSync(path.join(OUT_DIR, 'default.png'), defaultSvg)
process.stdout.write('OG: default\n')
