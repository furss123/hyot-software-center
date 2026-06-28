import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

import { gitCommitAndPush } from '@/lib/git'
import { getSoftwareDir, readMeta, writeMeta } from '@/lib/data'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
])

type UploadType = 'icon' | 'banner' | 'screenshot'

function getOutputPath(slug: string, type: UploadType): { abs: string; rel: string; url: string } {
  const base = path.join(getSoftwareDir(), slug)
  if (type === 'screenshot') {
    const filename = `${Date.now()}.webp`
    const rel = `data/software/${slug}/screenshots/${filename}`
    return {
      abs: path.join(base, 'screenshots', filename),
      rel,
      url: `/${rel}`,
    }
  }
  const filename = type === 'icon' ? 'icon.webp' : 'banner.webp'
  const rel = `data/software/${slug}/${filename}`
  return {
    abs: path.join(base, filename),
    rel,
    url: `/${rel}`,
  }
}

async function processImage(buf: Buffer, type: UploadType): Promise<Buffer> {
  if (type === 'icon') {
    return sharp(buf).resize(256, 256, { fit: 'cover' }).webp().toBuffer()
  }
  if (type === 'banner') {
    return sharp(buf).resize(1200, 340, { fit: 'cover' }).webp().toBuffer()
  }
  return sharp(buf)
    .resize(1920, undefined, { fit: 'inside', withoutEnlargement: true })
    .webp()
    .toBuffer()
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const type = searchParams.get('type') as 'icon' | 'banner' | null

  if (!slug || !type || !['icon', 'banner'].includes(type)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const { abs } = getOutputPath(slug, type)
  if (!fs.existsSync(abs)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const buffer = fs.readFileSync(abs)
  return new NextResponse(buffer, {
    headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData()
  const file = form.get('file')
  const slug = String(form.get('slug') ?? '')
  const type = String(form.get('type') ?? '') as UploadType

  if (!(file instanceof File) || !slug || !['icon', 'banner', 'screenshot'].includes(type)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!readMeta(slug)) {
    return NextResponse.json({ error: 'Software not found' }, { status: 404 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const { abs, rel, url } = getOutputPath(slug, type)
  fs.mkdirSync(path.dirname(abs), { recursive: true })

  const processed = await processImage(buf, type)
  fs.writeFileSync(abs, processed)

  if (type === 'icon' || type === 'banner') {
    const meta = readMeta(slug)!
    const assetPath =
      type === 'icon'
        ? `/data/software/${slug}/icon.webp`
        : `/data/software/${slug}/banner.webp`
    writeMeta(slug, {
      ...meta,
      ...(type === 'icon' ? { icon: assetPath } : { banner: assetPath }),
      updatedAt: new Date().toISOString().split('T')[0],
    })
    gitCommitAndPush(`feat(software): update ${type} for ${slug}`, [
      rel,
      `data/software/${slug}/meta.json`,
    ])
  } else {
    gitCommitAndPush(`feat(software): update ${type} for ${slug}`, [rel])
  }

  return NextResponse.json({ success: true, url })
}
