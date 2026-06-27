'use client'

import { useCallback, useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { timeAgo } from '@/lib/utils'
import { t } from '@/lib/i18n'

type DeployRun = {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  html_url: string
}

function statusIcon(run: DeployRun): string {
  if (run.conclusion === 'success') return '✅'
  if (run.conclusion === 'failure') return '❌'
  if (run.status === 'in_progress' || run.status === 'queued') return '🔄'
  return '⏸'
}

type RebuildState = 'idle' | 'loading' | 'success' | 'error'

export function DeployStatus(): React.JSX.Element {
  const [runs, setRuns] = useState<DeployRun[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/deployments')
    const data = (await res.json()) as { runs?: DeployRun[]; error?: string }
    setError(data.error ?? null)
    setRuns(data.runs ?? [])
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
      {!loading && error === 'no_token' && (
        <p style={{ fontSize: '0.875rem', color: '#C42B1C' }}>{t.deploy.noToken}</p>
      )}
      {!loading && error === 'unauthorized' && (
        <p style={{ fontSize: '0.875rem', color: '#C42B1C' }}>{t.deploy.invalidToken}</p>
      )}
      {!loading && error === 'forbidden' && (
        <p style={{ fontSize: '0.875rem', color: '#C42B1C' }}>{t.deploy.forbidden}</p>
      )}
      {!loading && error && !['no_token', 'unauthorized', 'forbidden'].includes(error) && (
        <p style={{ fontSize: '0.875rem', color: '#C42B1C' }}>{t.common.error}</p>
      )}
      {!loading && !error && runs.length === 0 && (
        <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{t.deploy.noRuns}</p>
      )}
      {!loading && !error && runs.length > 0 && (
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
                {statusIcon(run)} {run.name} · {timeAgo(run.created_at)}
              </span>
              <a
                href={run.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', flexShrink: 0 }}
              >
                {t.deploy.viewLink}
              </a>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  )
}

export function QuickActions(): React.JSX.Element {
  const [state, setState] = useState<RebuildState>('idle')

  async function handleRebuild(): Promise<void> {
    setState('loading')
    try {
      const res = await fetch('/api/rebuild', { method: 'POST' })
      const data = (await res.json()) as { success: boolean }
      setState(data.success ? 'success' : 'error')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 3000)
  }

  const message =
    state === 'success' ? t.actions.rebuildDone : state === 'error' ? t.actions.rebuildFailOk : ''

  return (
    <AdminCard>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{t.actions.title}</h2>
      <AdminButton variant="secondary" disabled={state === 'loading'} onClick={() => void handleRebuild()}>
        {state === 'loading' ? t.actions.rebuilding : t.actions.rebuildSearch}
      </AdminButton>
      {message && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#A0A0A0' }}>{message}</p>
      )}
    </AdminCard>
  )
}
