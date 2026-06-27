'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { t } from '@/lib/i18n'
import type { FeatureFlags, FeatureStatus } from '@/types'

const STATUS_OPTIONS = (Object.keys(t.features.statusOptions) as FeatureStatus[]).map((value) => ({
  value,
  label: t.features.statusOptions[value],
}))

export default function FeaturesPage() {
  const [flags, setFlags] = useState<FeatureFlags>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetch('/api/features')
      .then((res) => res.json() as Promise<FeatureFlags>)
      .then(setFlags)
      .finally(() => setLoading(false))
  }, [])

  function updateFlag(key: string, field: 'status' | 'description', value: string): void {
    setFlags((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }))
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/features', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flags),
    })
    if (res.ok) {
      setFlags((await res.json()) as FeatureFlags)
      setMessage(t.features.saved)
    } else {
      setMessage(t.common.error)
    }
    setSaving(false)
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.features.title}</h1>
      <div style={{ maxWidth: '760px' }}>
        <AdminCard>
        <table>
          <thead>
            <tr>
              <th>{t.features.key}</th>
              <th>{t.features.status}</th>
              <th>{t.features.description}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(flags).map(([key, flag]) => (
              <tr key={key}>
                <td style={{ fontFamily: 'monospace' }}>{key}</td>
                <td>
                  <AdminSelect
                    label=""
                    options={STATUS_OPTIONS}
                    value={flag.status}
                    onChange={(e) => updateFlag(key, 'status', e.target.value as FeatureStatus)}
                    aria-label={`${t.features.status} ${key}`}
                  />
                </td>
                <td>
                  <AdminInput
                    label=""
                    value={flag.description ?? ''}
                    onChange={(e) => updateFlag(key, 'description', e.target.value)}
                    aria-label={`${t.features.description} ${key}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1rem' }}>
          {message && (
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: message === t.common.error ? '#C42B1C' : '#6CCB5F' }}>
              {message}
            </p>
          )}
          <AdminButton variant="primary" onClick={() => void handleSave()} disabled={saving}>
            {saving ? t.features.saving : t.features.saveAll}
          </AdminButton>
        </div>
        </AdminCard>
      </div>
    </div>
  )
}
