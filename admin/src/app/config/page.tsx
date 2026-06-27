'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'

type SiteConfig = {
  brand: {
    name: string
    url: string
    github?: string
  }
  seo: {
    defaultTitle: string
    description?: { ko: string; en: string }
  }
  theme: {
    accentColor?: string
    defaultMode?: string
  }
}

const THEME_OPTIONS = [
  { value: 'dark', label: 'dark' },
  { value: 'light', label: 'light' },
  { value: 'system', label: 'system' },
]

export default function ConfigPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetch('/api/config')
      .then((res) => res.json() as Promise<SiteConfig>)
      .then(setConfig)
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (!config) return
    setSaving(true)
    setMessage('')

    const form = new FormData(e.currentTarget)
    const partial: SiteConfig = {
      brand: {
        name: String(form.get('brand_name') ?? ''),
        url: String(form.get('brand_url') ?? ''),
        github: String(form.get('brand_github') ?? '') || undefined,
      },
      seo: {
        defaultTitle: String(form.get('seo_defaultTitle') ?? ''),
        description: {
          ko: String(form.get('seo_description_ko') ?? ''),
          en: String(form.get('seo_description_en') ?? ''),
        },
      },
      theme: {
        accentColor: String(form.get('theme_accentColor') ?? ''),
        defaultMode: String(form.get('theme_defaultMode') ?? 'system'),
      },
    }

    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    })

    if (res.ok) {
      setConfig((await res.json()) as SiteConfig)
      setMessage('Config saved')
    } else {
      setMessage('Failed to save')
    }
    setSaving(false)
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>Loading...</p>
  if (!config) return <p style={{ color: '#C42B1C' }}>Failed to load config</p>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Site Config</h1>
      <AdminCard>
        <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '640px' }}>
          <AdminInput label="Brand name" name="brand_name" defaultValue={config.brand.name} required />
          <AdminInput label="Brand URL" name="brand_url" defaultValue={config.brand.url} required />
          <AdminInput label="Brand GitHub" name="brand_github" defaultValue={config.brand.github ?? ''} />
          <AdminInput label="SEO default title" name="seo_defaultTitle" defaultValue={config.seo.defaultTitle} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="SEO description (ko)" name="seo_description_ko" defaultValue={config.seo.description?.ko ?? ''} />
            <AdminInput label="SEO description (en)" name="seo_description_en" defaultValue={config.seo.description?.en ?? ''} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Theme accent color" name="theme_accentColor" defaultValue={config.theme.accentColor ?? '#0078D4'} />
            <AdminSelect label="Theme default mode" name="theme_defaultMode" options={THEME_OPTIONS} defaultValue={config.theme.defaultMode ?? 'system'} />
          </div>
          {message && <p style={{ fontSize: '0.875rem', color: message.includes('Failed') ? '#C42B1C' : '#6CCB5F' }}>{message}</p>}
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save config'}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  )
}
