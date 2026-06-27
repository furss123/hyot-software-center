'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { t } from '@/lib/i18n'

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

const THEME_OPTIONS = (Object.keys(t.config.themeOptions) as Array<keyof typeof t.config.themeOptions>).map(
  (value) => ({
    value,
    label: t.config.themeOptions[value],
  }),
)

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
      setMessage(t.config.saved)
    } else {
      setMessage(t.common.error)
    }
    setSaving(false)
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>
  if (!config) return <p style={{ color: '#C42B1C' }}>{t.common.error}</p>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.config.title}</h1>
      <div style={{ maxWidth: '760px' }}>
        <AdminCard>
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#A0A0A0' }}>{t.config.brand}</p>
          <AdminInput label={t.config.brandName} name="brand_name" defaultValue={config.brand.name} required />
          <AdminInput label={t.config.brandUrl} name="brand_url" defaultValue={config.brand.url} required />
          <AdminInput label={t.config.brandGithub} name="brand_github" defaultValue={config.brand.github ?? ''} />
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#A0A0A0', marginTop: '0.5rem' }}>{t.config.seo}</p>
          <AdminInput label={t.config.seoTitle} name="seo_defaultTitle" defaultValue={config.seo.defaultTitle} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.config.seoDescKo} name="seo_description_ko" defaultValue={config.seo.description?.ko ?? ''} />
            <AdminInput label={t.config.seoDescEn} name="seo_description_en" defaultValue={config.seo.description?.en ?? ''} />
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#A0A0A0', marginTop: '0.5rem' }}>{t.config.theme}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.config.accentColor} name="theme_accentColor" defaultValue={config.theme.accentColor ?? '#0078D4'} />
            <AdminSelect label={t.config.themeMode} name="theme_defaultMode" options={THEME_OPTIONS} defaultValue={config.theme.defaultMode ?? 'system'} />
          </div>
          {message && (
            <p style={{ fontSize: '0.875rem', color: message === t.common.error ? '#C42B1C' : '#6CCB5F' }}>{message}</p>
          )}
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? t.config.saving : t.config.save}
          </AdminButton>
          </form>
        </AdminCard>
      </div>
    </div>
  )
}
