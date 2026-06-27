import { NextResponse } from 'next/server'

type GitHubRun = {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  html_url: string
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
      `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 0 },
      },
    )

    if (!res.ok) {
      const error =
        res.status === 401 ? 'unauthorized' : res.status === 403 ? 'forbidden' : 'fetch_failed'
      return NextResponse.json({ error, runs: [] }, { status: res.status })
    }

    const data = (await res.json()) as { workflow_runs: GitHubRun[] }
    const runs = data.workflow_runs
      .filter(
        (run) =>
          run.name.includes('Deploy') ||
          run.name.includes('Pages') ||
          run.name.toLowerCase().includes('page'),
      )
      .slice(0, 5)
      .map((run) => ({
        id: run.id,
        name: run.name,
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
