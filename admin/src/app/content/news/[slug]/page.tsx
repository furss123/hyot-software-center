'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminTextarea } from '@/components/ui/AdminTextarea'
import { PreviewButton } from '@/components/ui/PreviewButton'
import type { NewsItemAdmin } from '@/lib/content'
import { t } from '@/lib/i18n'

export default function EditNewsPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params.slug

  const [item, setItem] = useState<NewsItemAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetch(`/api/content/news?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json() as Promise<NewsItemAdmin>
      })
      .then(setItem)
      .catch(() => setError(t.common.notFound))
      .finally(() => setLoading(false))
  }, [slug])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (!item) return
    setSaving(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const body = {
      slug: item.slug,
      title: {
        ko: String(form.get('title_ko') ?? ''),
        en: String(form.get('title_en') ?? ''),
      },
      summary: {
        ko: String(form.get('summary_ko') ?? ''),
        en: String(form.get('summary_en') ?? ''),
      },
      date: String(form.get('date') ?? ''),
      published: form.get('published') === 'on',
      tags: String(form.get('tags') ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      content: String(form.get('content') ?? ''),
    }

    const res = await fetch('/api/content/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      setError(t.common.error)
      setSaving(false)
      return
    }

    router.push('/content/news')
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>
  if (!item) return <p style={{ color: '#C42B1C' }}>{error || t.common.notFound}</p>

  return (
    <div>
      <a href="/content/news" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← {t.content.news}
      </a>
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
          {t.content.editNews}: {slug}
        </h1>
        <PreviewButton path={`/news/${slug}`} />
      </div>
      <div style={{ maxWidth: '760px' }}>
        <AdminCard>
          <form key={item.filename} onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AdminInput label={t.common.slug} name="slug" defaultValue={item.slug} readOnly />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.content.newsTitleKo} name="title_ko" defaultValue={item.title.ko} required />
            <AdminInput label={t.content.newsTitleEn} name="title_en" defaultValue={item.title.en} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.content.summaryKo} name="summary_ko" defaultValue={item.summary.ko} required />
            <AdminInput label={t.content.summaryEn} name="summary_en" defaultValue={item.summary.en} required />
          </div>
          <AdminInput label={t.content.date} name="date" type="date" defaultValue={item.date} required />
          <AdminInput label={t.content.tags} name="tags" defaultValue={item.tags.join(', ')} />
          <AdminTextarea label={t.content.contentMarkdown} name="content" defaultValue={item.content} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input type="checkbox" name="published" defaultChecked={item.published} />
            {t.content.published}
          </label>
          {error && <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{error}</p>}
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? t.software.saving : t.common.save}
          </AdminButton>
          </form>
        </AdminCard>
      </div>
    </div>
  )
}
