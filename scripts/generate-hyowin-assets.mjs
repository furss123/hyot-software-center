import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const homepage = 'C:/Users/HyoT/Desktop/HyoT Homepage'
const outDir = join(homepage, 'data/software/bidanwin')
const appPublic = 'C:/Users/HyoT/Desktop/work/윈도우 원클릭/src/renderer/public'
const siteMirror = 'C:/Users/HyoT/Desktop/work/비단윈'

function glyph(scale = 1) {
  return `
    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" transform="scale(${scale})">
      <rect x="122" y="114" width="268" height="204" rx="34" stroke-width="34"/>
      <path d="M122 184h268" stroke-width="30" opacity=".92"/>
      <path d="M196 286c52-72 106-108 170-114" stroke-width="42"/>
      <path d="M320 246l66 66" stroke-width="34" opacity=".95"/>
      <path d="M168 348c56-14 112-23 168-26" stroke-width="28" opacity=".82"/>
      <path d="M384 88l15-36 15 36 36 15-36 15-15 36-15-36-36-15 36-15z" fill="#fff" stroke-width="0" opacity=".96"/>
    </g>`
}

function iconSvg(size = 512) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4A9FE0"/>
        <stop offset="1" stop-color="#2B7CC7"/>
      </linearGradient>
      <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#tile)"/>
    <path d="M84 54h344L58 424V108c0-30 24-54 54-54z" fill="url(#shine)" opacity=".55"/>
    ${glyph(1)}
  </svg>`
}

function bannerSvg() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#06080B"/>
        <stop offset="1" stop-color="#0D1117"/>
      </linearGradient>
      <radialGradient id="glow" cx="78%" cy="13%" r="47%">
        <stop offset="0" stop-color="#4A9FE0" stop-opacity=".42"/>
        <stop offset="1" stop-color="#4A9FE0" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4A9FE0"/>
        <stop offset="1" stop-color="#2B7CC7"/>
      </linearGradient>
      <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity=".15"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000" flood-opacity=".28"/>
      </filter>
    </defs>
    <rect width="1200" height="480" fill="url(#bg)"/>
    <rect width="1200" height="480" fill="url(#glow)"/>
    <g transform="translate(90 144)" filter="url(#shadow)">
      <rect width="192" height="192" rx="44" fill="url(#tile)"/>
      <path d="M32 15h138L16 170V45c0-17 14-30 30-30z" fill="url(#shine)"/>
      <g transform="translate(0 0) scale(.375)">${glyph(1)}</g>
    </g>
    <text x="330" y="226" font-family="Pretendard, Segoe UI, Arial, sans-serif" font-size="74" font-weight="800" fill="#EEF2FF">HyoWin</text>
    <text x="330" y="276" font-family="Pretendard, Segoe UI, Arial, sans-serif" font-size="26" font-weight="500" fill="#A8B3C4">비단윈 · Windows 기본 앱 정리 도구</text>
    <g font-family="Pretendard, Segoe UI, Arial, sans-serif" font-size="22" font-weight="700">
      <rect x="330" y="302" width="172" height="48" rx="24" fill="none" stroke="#4A9FE0" stroke-width="2" opacity=".9"/>
      <text x="354" y="334" fill="#9ED0F6">기본 앱 정리</text>
      <rect x="518" y="302" width="184" height="48" rx="24" fill="none" stroke="#2A9B8A" stroke-width="2" opacity=".9"/>
      <text x="542" y="334" fill="#7ED7C8">복원 지점 안내</text>
      <rect x="718" y="302" width="148" height="48" rx="24" fill="none" stroke="#8B4FCC" stroke-width="2" opacity=".9"/>
      <text x="742" y="334" fill="#C9A7F4">라이트 · 다크</text>
    </g>
    <text x="330" y="402" font-family="Pretendard, Segoe UI, Arial, sans-serif" font-size="19" font-weight="500" fill="#5D6878">제작: HyoT · © 2026 · hyot.dev</text>
  </svg>`
}

await mkdir(outDir, { recursive: true })
await mkdir(appPublic, { recursive: true })
await mkdir(siteMirror, { recursive: true })

const icon = await sharp(Buffer.from(iconSvg())).webp({ quality: 94 }).toBuffer()
await sharp(icon).toFile(join(outDir, 'icon.webp'))
await sharp(icon).toFile(join(siteMirror, 'icon.webp'))
await sharp(Buffer.from(iconSvg(1024))).png().toFile(join(appPublic, 'icon.png'))

const banner = await sharp(Buffer.from(bannerSvg())).webp({ quality: 94 }).toBuffer()
await sharp(banner).toFile(join(outDir, 'banner.webp'))
await sharp(banner).toFile(join(siteMirror, 'banner.webp'))

console.log('HyoWin homepage assets regenerated.')
console.log(join(outDir, 'icon.webp'))
console.log(join(outDir, 'banner.webp'))
