'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { t } from '@/lib/i18n'

type Submission = {
  _id?: string
  _date?: string
  유형?: string
  프로그램?: string
  제목?: string
  내용?: string
  연락처?: string
}

type Filter = 'all' | 'bug' | 'feature' | 'other'

function formatDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function matchesFilter(type: string | undefined, filter: Filter): boolean {
  if (filter === 'all') return true
  if (!type) return false
  if (filter === 'bug') return type.includes('버그')
  if (filter === 'feature') return type.includes('기능')
  if (filter === 'other') return type.includes('기타')
  return true
}

function typeBadgeStyle(type?: string): React.CSSProperties {
  if (!type) return { background: 'rgba(255,255,255,0.08)', color: '#A0A0A0' }
  if (type.includes('버그')) {
    return { background: 'rgba(196, 43, 28, 0.12)', color: '#FF6B6B' }
  }
  if (type.includes('기능')) {
    return { background: 'rgba(0, 120, 212, 0.12)', color: '#4DA3FF' }
  }
  return { background: 'rgba(255,255,255,0.08)', color: '#A0A0A0' }
}

export default function FeedbackAdminPage(): React.JSX.Element {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/feedback')
    const data = (await res.json()) as {
      submissions?: Submission[]
      error?: string
    }
    setError(data.error ?? null)
    setSubmissions(data.submissions ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = submissions.filter((s) => matchesFilter(s.유형, filter))

  const filters: Array<{ key: Filter; label: string }> = [
    { key: 'all', label: t.feedback.all },
    { key: 'bug', label: t.feedback.bug },
    { key: 'feature', label: t.feedback.feature },
    { key: 'other', label: t.feedback.other },
  ]

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

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: filter === f.key ? '#0078D4' : 'transparent',
              color: filter === f.key ? '#fff' : '#A0A0A0',
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AdminCard>
        {loading && <p style={{ color: '#A0A0A0', fontSize: '0.875rem' }}>{t.feedback.loading}</p>}
        {!loading && error === 'no_key' && (
          <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{t.feedback.noKey}</p>
        )}
        {!loading && error && error !== 'no_key' && (
          <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{t.common.error}</p>
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
                <th>{t.feedback.contact}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const rowId = row._id ?? `${row._date}-${row.제목}`
                const expanded = expandedId === rowId
                return (
                  <Fragment key={rowId}>
                    <tr
                      onClick={() => setExpandedId(expanded ? null : rowId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span
                          style={{
                            ...typeBadgeStyle(row.유형),
                            padding: '0.125rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {row.유형 ?? '—'}
                        </span>
                      </td>
                      <td>{row.프로그램 ?? '—'}</td>
                      <td>{row.제목 ?? '—'}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(row._date)}</td>
                      <td>{row.연락처 ?? '—'}</td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={5} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                          <p style={{ fontSize: '0.75rem', color: '#A0A0A0', marginBottom: '0.5rem' }}>
                            {t.feedback.content}
                          </p>
                          <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                            {row.내용 ?? '—'}
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
