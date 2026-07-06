import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const pngSizes = [192, 512]
const faviconSizes = [16, 32, 48]
const OUT = path.join(process.cwd(), 'public', 'assets')
const PUBLIC = path.join(process.cwd(), 'public')
fs.mkdirSync(OUT, { recursive: true })

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="88" y1="64" x2="424" y2="448" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4A9FE0"/>
      <stop offset="0.58" stop-color="#2F70C8"/>
      <stop offset="1" stop-color="#8B4FCC"/>
    </linearGradient>
    <linearGradient id="bar" x1="160" y1="128" x2="352" y2="384" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#DCEFFF"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#00101F" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="#07111F"/>
  <path d="M256 46C372 46 466 140 466 256S372 466 256 466 46 372 46 256 140 46 256 46Zm0 58C172 104 104 172 104 256s68 152 152 152 152-68 152-152-68-152-152-152Z" fill="url(#bg)"/>
  <g filter="url(#shadow)">
    <rect x="152" y="144" width="68" height="224" rx="30" fill="url(#bar)"/>
    <rect x="292" y="144" width="68" height="224" rx="30" fill="url(#bar)"/>
    <rect x="196" y="222" width="120" height="68" rx="30" fill="#4A9FE0"/>
    <circle cx="356" cy="158" r="24" fill="#E87820"/>
  </g>
</svg>`

function makeIco(images: Array<{ size: number; buffer: Buffer }>): Buffer {
  const headerSize = 6 + images.length * 16
  const totalSize = headerSize + images.reduce((sum, image) => sum + image.buffer.length, 0)
  const ico = Buffer.alloc(totalSize)
  ico.writeUInt16LE(0, 0)
  ico.writeUInt16LE(1, 2)
  ico.writeUInt16LE(images.length, 4)

  let imageOffset = headerSize
  images.forEach((image, index) => {
    const entryOffset = 6 + index * 16
    ico.writeUInt8(image.size === 256 ? 0 : image.size, entryOffset)
    ico.writeUInt8(image.size === 256 ? 0 : image.size, entryOffset + 1)
    ico.writeUInt8(0, entryOffset + 2)
    ico.writeUInt8(0, entryOffset + 3)
    ico.writeUInt16LE(1, entryOffset + 4)
    ico.writeUInt16LE(32, entryOffset + 6)
    ico.writeUInt32LE(image.buffer.length, entryOffset + 8)
    ico.writeUInt32LE(imageOffset, entryOffset + 12)
    image.buffer.copy(ico, imageOffset)
    imageOffset += image.buffer.length
  })

  return ico
}

async function main(): Promise<void> {
  fs.writeFileSync(path.join(OUT, 'icon.svg'), svg)
  fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), svg)

  for (const size of pngSizes) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(OUT, `icon-${size}.png`))
  }

  const faviconImages = await Promise.all(
    faviconSizes.map(async (size) => ({
      size,
      buffer: await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer(),
    })),
  )
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), makeIco(faviconImages))
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), makeIco(faviconImages))

  console.log('Icons generated')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
