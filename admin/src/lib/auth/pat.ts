import type { AuthAdapter } from '@/lib/auth'

export class PATAuthAdapter implements AuthAdapter {
  async getToken(): Promise<string> {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error('GITHUB_TOKEN is not set in admin/.env.local')
    }
    return token
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken()
      const res = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      })
      return res.ok
    } catch {
      return false
    }
  }
}

export const patAuth = new PATAuthAdapter()

export function requireGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN is missing')
  }
  return token
}
