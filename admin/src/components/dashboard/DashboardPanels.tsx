'use client'

import { useCallback, useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { timeAgo } from '@/lib/utils'
import { t } from '@/lib/i18n'

type DeployRun = {
  id: number
  status: string
  conclusion: string | null
  created_at: string
  html_url: string
}

function statusIcon(run: DeployRun): string {
  if (run.status === 'in_progress' || run.status === 'queued') return '🔄'
  if (run.conclusion === 'success') return '✅'
  if (run.conclusion === 'failure') return '❌'
  return '⏳'
}

function statusLabel(run: DeployRun): string {
  if (run.status === 'in_progress' || run.status === 'queued') return t.deploy.inProgress
  if (run.conclusion === 'success') return t.deploy.success
  if (run.conclusion === 'failure') return t.deploy.failure
  return run.status
}

export function DeployStatus(): React.JSX.Element {
  const [runs, setRuns] = useState<DeployRun[]>([])
  const [noToken, setNoToken] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/deployments')
    const data = (await res.json()) as { runs?: DeployRun[]; error?: string }
    setNoToken(data.error === 'no_token')
    setRuns((data.runs ?? []).slice(0, 3))
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <AdminCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>{t.deploy.title}</h2>
        <AdminButton variant="secondary" onClick={() => void load()} disabled={loading}>
          {t.deploy.refresh}
        </AdminButton>
      </div>
      {loading && <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{t.common.loading}</p>}
      {!loading && noToken && (
        <p style={{ fontSize: '0.875rem', color: '#C42B1C' }}>{t.deploy.noToken}</p>
      )}
      {!loading && !noToken && runs.length === 0 && (
        <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{t.deploy.noRuns}</p>
      )}
      {!loading && runs.length > 0 && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {runs.map((run) => (
            <li
              key={run.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.875rem',
              }}
            >
              <span>
                {statusIcon(run)} {statusLabel(run)} · {timeAgo(run.created_at)}
              </span>
              <a href={run.html_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem' }}>
                {t.deploy.viewActions}
              </a>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  )
}

export function QuickActions(): React.JSX.Element {
  const [rebuilding, setRebuilding] = useState(false)
  const [message, setMessage] = useState('')

  async function handleRebuild(): Promise<void> {
    setRebuilding(true)
    setMessage('')
    try {
      const res = await fetch('/api/rebuild', { method: 'POST' })
      const data = (await res.json()) as { success: boolean; message: string }
      setMessage(data.success ? `✅ ${t.actions.rebuildSuccess}` : `❌ ${t.actions.rebuildFail}`)
    } catch {
      setMessage(`❌ ${t.actions.rebuildFail}`)
    } finally {
      setRebuilding(false)
    }
  }

  return (
    <AdminCard>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{t.actions.title}</h2>
      <AdminButton variant="secondary" disabled={rebuilding} onClick={() => void handleRebuild()}>
        {rebuilding ? t.actions.rebuilding : t.actions.rebuildSearch}
      </AdminButton>
      {message && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#A0A0A0' }}>{message}</p>
      )}
    </AdminCard>
  )
}
