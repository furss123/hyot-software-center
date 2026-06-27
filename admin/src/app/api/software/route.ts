import { NextResponse } from 'next/server'

import { gitCommitAndPush } from '@/lib/git'
import { getAllSlugs, readMeta, writeMeta, writeReleases } from '@/lib/data'
import type { SoftwareMeta } from '@/types'

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const meta = readMeta(slug)
    if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(meta)
  }

  const items = getAllSlugs()
    .map((s) => readMeta(s))
    .filter((m): m is SoftwareMeta => m !== null)

  return NextResponse.json(items)
}

export async function POST(request: Request): Promise<NextResponse> {
  const meta = (await request.json()) as SoftwareMeta

  if (!meta.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  if (readMeta(meta.slug)) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const today = new Date().toISOString().split('T')[0]
  const full: SoftwareMeta = {
    ...meta,
    createdAt: meta.createdAt || today,
    updatedAt: today,
  }

  writeMeta(meta.slug, full)
  writeReleases(meta.slug, {
    slug: meta.slug,
    latest: { stable: null, beta: null },
    releases: [],
  })

  const files = [
    `data/software/${meta.slug}/meta.json`,
    `data/software/${meta.slug}/releases.json`,
  ]
  gitCommitAndPush(`feat(software): add ${meta.slug}`, files)

  return NextResponse.json(full)
}

export async function PUT(request: Request): Promise<NextResponse> {
  const meta = (await request.json()) as SoftwareMeta

  if (!readMeta(meta.slug)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated: SoftwareMeta = {
    ...meta,
    updatedAt: new Date().toISOString().split('T')[0],
  }

  writeMeta(meta.slug, updated)
  gitCommitAndPush(`feat(software): update ${meta.slug} meta`, [
    `data/software/${meta.slug}/meta.json`,
  ])

  return NextResponse.json(updated)
}
