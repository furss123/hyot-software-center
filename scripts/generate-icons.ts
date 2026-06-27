import fs from 'fs'
import path from 'path'

const sizes = [192, 512]
const OUT = path.join(process.cwd(), 'public', 'assets')
fs.mkdirSync(OUT, { recursive: true })

for (const size of sizes) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#0078D4"/>
  <text x="50%" y="55%" font-family="system-ui" font-size="${size * 0.5}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">H</text>
</svg>`
  fs.writeFileSync(path.join(OUT, `icon-${size}.png`), svg)
}
console.log('Icons generated')
