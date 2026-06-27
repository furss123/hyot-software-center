import { requireGitHubToken } from '@/lib/auth/pat'

type GitHubRelease = {
  tag_name: string
  name: string
  published_at: string
  body: string
  assets: Array<{
    name: string
    browser_download_url: string
    size: number
    download_count: number
  }>
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${requireGitHubToken()}`,
    Accept: 'application/vnd.github+json',
  }
}

export async function getReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    headers: headers(),
  })
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }
  return (await res.json()) as GitHubRelease[]
}

export async function getFileContent(
  owner: string,
  repo: string,
  filePath: string,
): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    { headers: headers() },
  )
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }
  const data = (await res.json()) as { content: string; sha: string }
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha: data.sha,
  }
}

export async function putFileContent(
  owner: string,
  repo: string,
  filePath: string,
  content: string,
  sha: string,
  message: string,
): Promise<void> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      sha,
    }),
  })
  if (!res.ok) {
    throw new Error(`GitHub PUT error: ${res.status}`)
  }
}

export type { GitHubRelease }
