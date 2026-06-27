import { NextResponse } from 'next/server'

import { gitCommitAndPush } from '@/lib/git'
import { getAllNewsAdmin, getNewsItemAdmin, writeNewsItem } from '@/lib/content'

type NewsBody = {
  slug: string
  title: { ko: string; en: string }
  summary: { ko: string; en: string }
  date: string
  published: boolean
  tags: string[]
  content?: string
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const item = getNewsItemAdmin(slug)
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  }

  return NextResponse.json(getAllNewsAdmin())
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as NewsBody

  if (!body.slug || getNewsItemAdmin(body.slug)) {
    return NextResponse.json({ error: 'Invalid or duplicate slug' }, { status: 400 })
  }

  const filepath = writeNewsItem({
    slug: body.slug,
    title: body.title,
    summary: body.summary,
    date: body.date,
    published: body.published,
    tags: body.tags,
    content: body.content ?? '',
  })

  gitCommitAndPush(`feat(news): add ${body.slug}`, [filepath])
  return NextResponse.json({ ok: true })
}

export async function PUT(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as NewsBody
  const existing = getNewsItemAdmin(body.slug)

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const filepath = writeNewsItem(
    {
      slug: body.slug,
      title: body.title,
      summary: body.summary,
      date: body.date,
      published: body.published,
      tags: body.tags,
      content: body.content ?? existing.content,
    },
    existing.filename,
  )

  gitCommitAndPush(`feat(news): update ${body.slug}`, [filepath])
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const { deleteNewsItem } = await import('@/lib/content')
  const filepath = deleteNewsItem(slug)
  if (!filepath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  gitCommitAndPush(`chore(news): remove ${slug}`, [])
  return NextResponse.json({ success: true })
}
