'use client'

import { useState } from 'react'

import { updateReleaseChannel } from '@/actions/content'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminSelect } from '@/components/ui/AdminSelect'

type Release = {
  version: string
  channel: string
  releaseDate: string
  assets: Array<{ filename: string }>
}

type ReleasesDetailProps = {
  slug: string
  releases: Release[]
}

export function ReleasesDetail({ slug, releases }: ReleasesDetailProps): React.JSX.Element {
  const [message, setMessage] = useState('')
  const [syncing, setSyncing] = useState(false)

  async function syncFromGitHub(): Promise<void> {
    setSyncing(true)
    setMessage('')
    try {
      const res = await fetch(`/api/github/releases?slug=${slug}`)
      const data = (await res.json()) as unknown[]
      setMessage(`Fetched ${data.length} releases from GitHub`)
    } catch {
      setMessage('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  async function saveChannel(version: string, channel: string): Promise<void> {
    const result = await updateReleaseChannel(slug, version, channel)
    setMessage(result.message)
  }

  return (
    <div className="space-y-4">
      <AdminButton onClick={() => void syncFromGitHub()} disabled={syncing}>
        {syncing ? 'Syncing...' : 'Sync from GitHub'}
      </AdminButton>
      {message && <p className="text-sm text-white/70">{message}</p>}

      {releases.map((release) => (
        <AdminCard key={release.version}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-lg">v{release.version}</p>
              <p className="text-sm text-white/60">{release.releaseDate}</p>
              <p className="text-sm text-white/60">{release.assets.length} assets</p>
            </div>
            <AdminSelect
              defaultValue={release.channel}
              onChange={(e) => void saveChannel(release.version, e.target.value)}
            >
              <option value="stable">stable</option>
              <option value="beta">beta</option>
              <option value="legacy">legacy</option>
            </AdminSelect>
          </div>
        </AdminCard>
      ))}
    </div>
  )
}
