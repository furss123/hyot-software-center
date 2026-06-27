import { NextResponse } from 'next/server'

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const owner = process.env.GITHUB_OWNER ?? 'hyot'

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${slug}/releases`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: `GitHub API error: ${res.status}` }, { status: 502 })
  }

  return NextResponse.json(await res.json())
}
