'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminSelect } from '@/components/ui/AdminSelect'
import type { Release, ReleaseChannel, ReleasesData } from '@/types'

const CHANNEL_OPTIONS = [
  { value: 'stable', label: 'stable' },
  { value: 'beta', label: 'beta' },
  { value: 'legacy', label: 'legacy' },
]

export default function ReleaseDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [data, setData] = useState<ReleasesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/releases?slug=${slug}`)
    if (res.ok) {
      setData((await res.json()) as ReleasesData)
    }
    setLoading(false)
  }, [slug])

  useEffect(() => {
    void load()
  }, [load])

  async function syncFromGitHub(): Promise<void> {
    setSyncing(true)
    setMessage('')
    try {
      const res = await fetch('/api/releases/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) {
        const err = (await res.json()) as { error?: string }
        setMessage(err.error ?? 'Sync failed')
        return
      }
      const updated = (await res.json()) as ReleasesData
      setData(updated)
      setMessage(`Synced ${updated.releases.length} releases`)
    } catch {
      setMessage('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  async function updateChannel(version: string, channel: ReleaseChannel): Promise<void> {
    if (!data) return
    const releases = data.releases.map((r) =>
      r.version === version ? { ...r, channel } : r,
    )
    const updated: ReleasesData = { ...data, releases }
    const res = await fetch('/api/releases', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      setData((await res.json()) as ReleasesData)
      setMessage(`Updated ${version} channel to ${channel}`)
    }
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>Loading...</p>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Releases: {slug}
      </h1>
      <div style={{ marginBottom: '1rem' }}>
        <AdminButton onClick={() => void syncFromGitHub()} disabled={syncing}>
          {syncing ? 'Syncing...' : 'Sync from GitHub'}
        </AdminButton>
      </div>
      {message && <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '1rem' }}>{message}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(data?.releases ?? []).map((release: Release) => (
          <AdminCard key={release.version}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: '1.125rem' }}>v{release.version}</p>
                <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{release.releaseDate}</p>
                <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{release.assets.length} assets</p>
              </div>
              <AdminSelect
                label="Channel"
                options={CHANNEL_OPTIONS}
                value={release.channel}
                onChange={(e) => void updateChannel(release.version, e.target.value as ReleaseChannel)}
              />
            </div>
          </AdminCard>
        ))}
        {(!data || data.releases.length === 0) && (
          <p style={{ color: '#A0A0A0' }}>No releases yet. Use Sync from GitHub to import.</p>
        )}
      </div>
    </div>
  )
}
