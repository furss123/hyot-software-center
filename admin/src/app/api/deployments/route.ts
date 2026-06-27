import { NextResponse } from 'next/server'

type GitHubRun = {
  id: number
  status: string
  conclusion: string | null
  created_at: string
  html_url: string
  path?: string
}

export async function GET(): Promise<NextResponse> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'no_token', runs: [] })
  }

  const owner = process.env.GITHUB_OWNER ?? 'furss123'
  const repo = process.env.GITHUB_REPO ?? 'hyot-software-center'

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
        next: { revalidate: 0 },
      },
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'fetch_failed', runs: [] }, { status: res.status })
    }

    const data = (await res.json()) as { workflow_runs: GitHubRun[] }
    const runs = data.workflow_runs
      .filter((run) => run.path?.includes('pages.yml'))
      .slice(0, 5)
      .map((run) => ({
        id: run.id,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        html_url: run.html_url,
      }))

    return NextResponse.json({ runs })
  } catch {
    return NextResponse.json({ error: 'fetch_failed', runs: [] }, { status: 500 })
  }
}
