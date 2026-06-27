'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { AdminTextarea } from '@/components/ui/AdminTextarea'
import { PreviewButton } from '@/components/ui/PreviewButton'
import { t } from '@/lib/i18n'
import type { Release, ReleaseChannel, ReleasesData } from '@/types'

const CHANNEL_OPTIONS = (Object.keys(t.releases.channelOptions) as ReleaseChannel[]).map(
  (value) => ({
    value,
    label: t.releases.channelOptions[value],
  }),
)

export default function ReleaseDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [data, setData] = useState<ReleasesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [editingVersion, setEditingVersion] = useState<string | null>(null)
  const [notesKo, setNotesKo] = useState('')
  const [notesEn, setNotesEn] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

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
        setMessage(err.error ?? t.releases.syncFail)
        return
      }
      const updated = (await res.json()) as ReleasesData
      setData(updated)
      setMessage(`${t.releases.syncSuccess} (${updated.releases.length})`)
    } catch {
      setMessage(t.releases.syncFail)
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
      setMessage(t.common.success)
    }
  }

  function startEditNotes(release: Release): void {
    setEditingVersion(release.version)
    setNotesKo(release.notes?.ko ?? '')
    setNotesEn(release.notes?.en ?? '')
  }

  async function saveNotes(version: string): Promise<void> {
    if (!data) return
    setSavingNotes(true)
    const releases = data.releases.map((r) =>
      r.version === version
        ? { ...r, notes: { ko: notesKo, en: notesEn } }
        : r,
    )
    const updated: ReleasesData = { ...data, releases }
    const res = await fetch(`/api/releases?noteVersion=${encodeURIComponent(version)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      setData((await res.json()) as ReleasesData)
      setMessage(t.common.success)
      setEditingVersion(null)
    } else {
      setMessage(t.common.error)
    }
    setSavingNotes(false)
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {t.releases.title}: {slug}
        </h1>
        <PreviewButton path={`/software/${slug}`} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <AdminButton onClick={() => void syncFromGitHub()} disabled={syncing}>
          {syncing ? t.releases.syncing : t.releases.syncFromGitHub}
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
                <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>
                  {release.assets.length} {t.releases.assets}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <AdminSelect
                  label={t.releases.channel}
                  options={CHANNEL_OPTIONS}
                  value={release.channel}
                  onChange={(e) => void updateChannel(release.version, e.target.value as ReleaseChannel)}
                />
                <AdminButton
                  variant="secondary"
                  onClick={() =>
                    editingVersion === release.version
                      ? setEditingVersion(null)
                      : startEditNotes(release)
                  }
                >
                  {t.releases.editNotes}
                </AdminButton>
              </div>
            </div>
            {editingVersion === release.version && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AdminTextarea
                  label={t.releases.notesKo}
                  value={notesKo}
                  onChange={(e) => setNotesKo(e.target.value)}
                />
                <AdminTextarea
                  label={t.releases.notesEn}
                  value={notesEn}
                  onChange={(e) => setNotesEn(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <AdminButton
                    variant="primary"
                    disabled={savingNotes}
                    onClick={() => void saveNotes(release.version)}
                  >
                    {savingNotes ? t.software.saving : t.common.save}
                  </AdminButton>
                  <AdminButton variant="secondary" onClick={() => setEditingVersion(null)}>
                    {t.common.cancel}
                  </AdminButton>
                </div>
              </div>
            )}
          </AdminCard>
        ))}
        {(!data || data.releases.length === 0) && (
          <p style={{ color: '#A0A0A0' }}>{t.releases.empty}</p>
        )}
      </div>
    </div>
  )
}
