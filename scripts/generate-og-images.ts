import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import { getAllSoftware } from '../src/lib/content/software'

const OUT_DIR = path.join(process.cwd(), 'public', 'og')
fs.mkdirSync(OUT_DIR, { recursive: true })

const software = getAllSoftware()

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function hyoimageOgSvg(): string {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1724"/>
      <stop offset="55%" stop-color="#07111B"/>
      <stop offset="100%" stop-color="#062426"/>
    </linearGradient>
    <linearGradient id="iconBg" x1="88" y1="64" x2="424" y2="448" gradientUnits="userSpaceOnUse">
      <stop stop-color="#66AEE5"/>
      <stop offset="1" stop-color="#2C80CA"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#00101F" flood-opacity="0.35"/>
    </filter>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="72"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="330" cy="100" rx="360" ry="300" fill="#4A9FE0" opacity="0.18" filter="url(#soft)"/>
  <ellipse cx="1000" cy="590" rx="300" ry="240" fill="#008684" opacity="0.12" filter="url(#soft)"/>
  <g filter="url(#shadow)">
    <rect x="88" y="104" width="210" height="210" rx="43" fill="url(#iconBg)"/>
    <rect x="132" y="158" width="100" height="78" rx="10" fill="none" stroke="#fff" stroke-width="10"/>
    <circle cx="156" cy="181" r="9" fill="#fff"/>
    <path d="M138 224l34-31 21 23 32-43 35 51z" fill="#fff"/>
    <path d="M139 249l143-143" stroke="#fff" stroke-width="14" stroke-linecap="square"/>
    <path d="M172 249l92 92" stroke="#fff" stroke-width="14" stroke-linecap="square"/>
    <circle cx="146" cy="260" r="14" fill="none" stroke="#fff" stroke-width="10"/>
    <circle cx="263" cy="265" r="14" fill="none" stroke="#fff" stroke-width="10"/>
    <circle cx="212" cy="221" r="8" fill="#fff"/>
    <rect x="136" y="268" width="11" height="11" rx="3" fill="#8429D3"/>
    <rect x="152" y="268" width="11" height="11" rx="3" fill="#FF6000"/>
    <rect x="168" y="268" width="11" height="11" rx="3" fill="#008684"/>
  </g>
  <text x="356" y="242" font-family="Segoe UI, Arial, sans-serif" font-size="88" font-weight="700" fill="#F1FAFF">HyoImage</text>
  <text x="358" y="298" font-family="Segoe UI, Arial, sans-serif" font-size="38" fill="#A9C2DA">Batch Image Editing Tools</text>
  <rect x="88" y="370" width="296" height="18" rx="9" fill="#008684"/>
  <rect x="88" y="406" width="214" height="18" rx="9" fill="#FF6000"/>
  <rect x="318" y="406" width="64" height="18" rx="9" fill="#8429D3"/>
  <text x="356" y="540" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#63829F">HyoT Software Center</text>
</svg>`
}

function defaultSoftwareOgSvg(app: (typeof software)[number]): string {
  const name = escapeXml(app.name.en)
  const description = escapeXml(app.shortDescription.en)
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
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
  <text x="80" y="320" font-family="system-ui" font-size="64" font-weight="700" fill="#F0F0F0">${name}</text>
  <text x="80" y="390" font-family="system-ui" font-size="32" fill="#A0A0A0">${description}</text>
  <text x="80" y="560" font-family="system-ui" font-size="28" fill="#686868">HyoT Software Center</text>
</svg>`
}

async function writePng(filename: string, svg: string): Promise<void> {
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT_DIR, filename))
}

async function main(): Promise<void> {
  for (const app of software) {
    const svg = app.slug === 'hyoimage' ? hyoimageOgSvg() : defaultSoftwareOgSvg(app)
    await writePng(`${app.slug}.png`, svg)
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
  await writePng('default.png', defaultSvg)
  process.stdout.write('OG: default\n')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
