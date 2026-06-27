import { execSync } from 'child_process'
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

function getOutputPath(slug: string, type: UploadType): { abs: string; rel: string } {
  const base = path.join(getSoftwareDir(), slug)
  if (type === 'screenshot') {
    const filename = `${Date.now()}.webp`
    return {
      abs: path.join(base, 'screenshots', filename),
      rel: `data/software/${slug}/screenshots/${filename}`,
    }
  }
  const filename = type === 'icon' ? 'icon.webp' : 'banner.webp'
  return {
    abs: path.join(base, filename),
    rel: `data/software/${slug}/${filename}`,
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const type = searchParams.get('type') as UploadType | null

  if (!slug || !type || !['icon', 'banner', 'screenshot'].includes(type)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const { abs } = getOutputPath(slug, type === 'screenshot' ? 'icon' : type)
  const filePath = type === 'screenshot' ? null : abs

  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)
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

  const buffer = Buffer.from(await file.arrayBuffer())
  const { abs, rel } = getOutputPath(slug, type)
  fs.mkdirSync(path.dirname(abs), { recursive: true })

  try {
    if (type === 'icon') {
      await sharp(buffer).resize(256, 256, { fit: 'cover' }).webp().toFile(abs)
    } else {
      await sharp(buffer).webp().toFile(abs)
    }
  } catch {
    fs.writeFileSync(abs, buffer)
  }

  const meta = readMeta(slug)!
  const url = `/${rel.replace(/\\/g, '/')}`
  const updated = {
    ...meta,
    ...(type === 'icon' ? { icon: url } : {}),
    ...(type === 'banner' ? { banner: url } : {}),
    updatedAt: new Date().toISOString().split('T')[0],
  }
  writeMeta(slug, updated)

  gitCommitAndPush(`feat(software): update ${type} for ${slug}`, [rel, `data/software/${slug}/meta.json`])

  return NextResponse.json({ url })
}
