'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminTextarea } from '@/components/ui/AdminTextarea'
import { t } from '@/lib/i18n'

export default function NewNewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState(true)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const body = {
      slug: String(form.get('slug') ?? '').trim(),
      title: {
        ko: String(form.get('title_ko') ?? ''),
        en: String(form.get('title_en') ?? ''),
      },
      summary: {
        ko: String(form.get('summary_ko') ?? ''),
        en: String(form.get('summary_en') ?? ''),
      },
      date: String(form.get('date') ?? ''),
      published,
      tags: String(form.get('tags') ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      content: String(form.get('content') ?? ''),
    }

    const res = await fetch('/api/content/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? t.common.error)
      setLoading(false)
      return
    }

    router.push('/content/news')
  }

  return (
    <div>
      <a href="/content/news" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← {t.content.news}
      </a>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.content.addNews}</h1>
      <div style={{ maxWidth: '760px' }}>
        <AdminCard>
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AdminInput label={t.common.slug} name="slug" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.content.newsTitleKo} name="title_ko" required />
            <AdminInput label={t.content.newsTitleEn} name="title_en" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.content.summaryKo} name="summary_ko" required />
            <AdminInput label={t.content.summaryEn} name="summary_en" required />
          </div>
          <AdminInput label={t.content.date} name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
          <AdminInput label={t.content.tags} name="tags" />
          <AdminTextarea label={t.content.contentMarkdown} name="content" />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            {t.content.published}
          </label>
          {error && <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{error}</p>}
          <AdminButton type="submit" variant="primary" disabled={loading}>
            {loading ? t.software.saving : t.common.save}
          </AdminButton>
          </form>
        </AdminCard>
      </div>
    </div>
  )
}
