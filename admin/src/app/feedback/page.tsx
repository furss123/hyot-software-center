'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { t } from '@/lib/i18n'

type FeedbackType = 'bug' | 'feature' | 'other'
type FeedbackStatus = 'unread' | 'reviewing' | 'done' | 'dismissed'

type FeedbackRow = {
  id: string
  type: FeedbackType
  software: string | null
  title: string
  content: string
  contact: string | null
  created_at: string
  status: FeedbackStatus
}

type TypeFilter = 'all' | 'unread' | FeedbackType
type StatusFilter = 'all' | FeedbackStatus

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function typeLabel(type: FeedbackType): string {
  if (type === 'bug') return t.feedback.bug
  if (type === 'feature') return t.feedback.feature
  return t.feedback.other
}

function typeBadgeStyle(type: FeedbackType): React.CSSProperties {
  if (type === 'bug') return { background: 'rgba(196, 43, 28, 0.15)', color: '#FF6B6B' }
  if (type === 'feature') return { background: 'rgba(0, 120, 212, 0.15)', color: '#60CDFF' }
  return { background: 'rgba(255, 255, 255, 0.08)', color: '#A0A0A0' }
}

function statusColor(status: FeedbackStatus): string {
  if (status === 'unread') return '#FF6B6B'
  if (status === 'reviewing') return '#FCD116'
  if (status === 'done') return '#6CCB5F'
  return '#686868'
}

function statusLabel(status: FeedbackStatus): string {
  if (status === 'unread') return t.feedback.unread
  if (status === 'reviewing') return t.feedback.reviewing
  if (status === 'done') return t.feedback.done
  return t.feedback.dismissed
}

export default function FeedbackAdminPage(): React.JSX.Element {
  const [rows, setRows] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback')
      const json = (await res.json()) as { data?: FeedbackRow[]; error?: string }
      if (!res.ok) {
        setError(json.error ?? t.common.error)
        setRows([])
      } else {
        setRows(json.data ?? [])
      }
    } catch {
      setError(t.common.error)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = useMemo(
    () => ({
      total: rows.length,
      unread: rows.filter((r) => r.status === 'unread').length,
      bug: rows.filter((r) => r.type === 'bug').length,
      feature: rows.filter((r) => r.type === 'feature').length,
    }),
    [rows],
  )

  const filtered = rows.filter((row) => {
    if (typeFilter === 'unread' && row.status !== 'unread') return false
    if (typeFilter !== 'all' && typeFilter !== 'unread' && row.type !== typeFilter) return false
    if (statusFilter !== 'all' && row.status !== statusFilter) return false
    return true
  })

  async function updateStatus(id: string, status: FeedbackStatus): Promise<void> {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('patch failed')
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    } catch {
      alert(t.common.error)
    } finally {
      setUpdatingId(null)
    }
  }

  const typeFilters: Array<{ key: TypeFilter; label: string }> = [
    { key: 'all', label: t.feedback.all },
    { key: 'unread', label: t.feedback.unread },
    { key: 'bug', label: t.feedback.bug },
    { key: 'feature', label: t.feedback.feature },
    { key: 'other', label: t.feedback.other },
  ]

  const statusFilters: Array<{ key: StatusFilter; label: string }> = [
    { key: 'all', label: t.feedback.all },
    { key: 'unread', label: t.feedback.unread },
    { key: 'reviewing', label: t.feedback.reviewing },
    { key: 'done', label: t.feedback.done },
    { key: 'dismissed', label: t.feedback.dismissed },
  ]

  function filterButtonStyle(active: boolean): React.CSSProperties {
    return {
      padding: '0.375rem 0.875rem',
      borderRadius: '999px',
      border: '1px solid rgba(255,255,255,0.12)',
      background: active ? '#0078D4' : 'transparent',
      color: active ? '#fff' : '#A0A0A0',
      fontSize: '0.8125rem',
      cursor: 'pointer',
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t.feedback.title}</h1>
        <AdminButton variant="secondary" onClick={() => void load()} disabled={loading}>
          {t.feedback.refresh}
        </AdminButton>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { label: t.feedback.all, value: stats.total },
          { label: t.feedback.unread, value: stats.unread },
          { label: t.feedback.bug, value: stats.bug },
          { label: t.feedback.feature, value: stats.feature },
        ].map((stat) => (
          <AdminCard key={stat.label}>
            <p style={{ fontSize: '0.75rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#60CDFF' }}>
              {stat.value}
              <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#A0A0A0' }}>건</span>
            </p>
          </AdminCard>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {typeFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setTypeFilter(f.key)}
            style={filterButtonStyle(typeFilter === f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statusFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setStatusFilter(f.key)}
            style={filterButtonStyle(statusFilter === f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AdminCard>
        {loading && (
          <p style={{ color: '#A0A0A0', fontSize: '0.875rem' }}>{t.feedback.loading}</p>
        )}
        {!loading && error && (
          <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{error}</p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: '#A0A0A0', fontSize: '0.875rem' }}>{t.feedback.empty}</p>
        )}
        {!loading && !error && filtered.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.feedback.type}</th>
                <th>{t.feedback.software}</th>
                <th>{t.feedback.title2}</th>
                <th>{t.feedback.date}</th>
                <th>{t.feedback.statusChange}</th>
                <th>{t.feedback.content}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const expanded = expandedId === row.id
                return (
                  <Fragment key={row.id}>
                    <tr>
                      <td>
                        <span
                          style={{
                            ...typeBadgeStyle(row.type),
                            padding: '0.125rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {typeLabel(row.type)}
                        </span>
                      </td>
                      <td>{row.software ?? '—'}</td>
                      <td>{row.title}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(row.created_at)}</td>
                      <td>
                        <select
                          value={row.status}
                          disabled={updatingId === row.id}
                          onChange={(e) =>
                            void updateStatus(row.id, e.target.value as FeedbackStatus)
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: '#1A1A1A',
                            color: statusColor(row.status),
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.8125rem',
                          }}
                        >
                          <option value="unread">{t.feedback.unread}</option>
                          <option value="reviewing">{t.feedback.reviewing}</option>
                          <option value="done">{t.feedback.done}</option>
                          <option value="dismissed">{t.feedback.dismissed}</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setExpandedId(expanded ? null : row.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#60CDFF',
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                          }}
                        >
                          {expanded ? t.feedback.collapse : t.feedback.expand}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}
                        >
                          <p
                            style={{
                              fontSize: '0.75rem',
                              color: '#A0A0A0',
                              marginBottom: '0.5rem',
                            }}
                          >
                            {t.feedback.content}
                          </p>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6,
                              marginBottom: '0.75rem',
                            }}
                          >
                            {row.content}
                          </p>
                          <p style={{ fontSize: '0.8125rem', color: '#A0A0A0' }}>
                            {t.feedback.contact}:{' '}
                            {row.contact ?? t.feedback.noContact}
                          </p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        )}
      </AdminCard>
    </div>
  )
}
