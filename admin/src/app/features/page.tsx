'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import type { FeatureFlags, FeatureStatus } from '@/types'

const STATUS_OPTIONS = [
  { value: 'enabled', label: 'enabled' },
  { value: 'disabled', label: 'disabled' },
  { value: 'experimental', label: 'experimental' },
  { value: 'beta', label: 'beta' },
  { value: 'deprecated', label: 'deprecated' },
]

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
      setMessage('Features saved')
    } else {
      setMessage('Failed to save')
    }
    setSaving(false)
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>Loading...</p>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Feature Flags</h1>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Status</th>
              <th>Description</th>
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
                    aria-label={`Status for ${key}`}
                  />
                </td>
                <td>
                  <AdminInput
                    label=""
                    value={flag.description ?? ''}
                    onChange={(e) => updateFlag(key, 'description', e.target.value)}
                    aria-label={`Description for ${key}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1rem' }}>
          {message && <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: message.includes('Failed') ? '#C42B1C' : '#6CCB5F' }}>{message}</p>}
          <AdminButton variant="primary" onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Saving...' : 'Save All'}
          </AdminButton>
        </div>
      </AdminCard>
    </div>
  )
}
