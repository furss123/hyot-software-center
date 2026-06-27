import { NextResponse } from 'next/server'

import { getReleases } from '@/lib/github'

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const owner = process.env.GITHUB_OWNER ?? 'hyot'

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  try {
    const releases = await getReleases(owner, slug)
    return NextResponse.json(releases)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
