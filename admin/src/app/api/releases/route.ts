import { NextResponse } from 'next/server'

import { gitCommitAndPush } from '@/lib/git'
import { readReleases, writeReleases } from '@/lib/data'
import type { ReleasesData } from '@/types'

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const data = readReleases(slug)
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: Request): Promise<NextResponse> {
  const data = (await request.json()) as ReleasesData

  if (!data.slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  writeReleases(data.slug, data)
  gitCommitAndPush(`chore(release): update ${data.slug} releases`, [
    `data/software/${data.slug}/releases.json`,
  ])

  return NextResponse.json(data)
}
