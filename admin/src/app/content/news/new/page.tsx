'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminTextarea } from '@/components/ui/AdminTextarea'

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
        .map((t) => t.trim())
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
      setError(data.error ?? 'Failed to create')
      setLoading(false)
      return
    }

    router.push('/content/news')
  }

  return (
    <div>
      <a href="/content/news" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to News
      </a>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add News</h1>
      <AdminCard>
        <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '640px' }}>
          <AdminInput label="Slug" name="slug" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Title (ko)" name="title_ko" required />
            <AdminInput label="Title (en)" name="title_en" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Summary (ko)" name="summary_ko" required />
            <AdminInput label="Summary (en)" name="summary_en" required />
          </div>
          <AdminInput label="Date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
          <AdminInput label="Tags (comma-separated)" name="tags" />
          <AdminTextarea label="Content (markdown)" name="content" />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          {error && <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{error}</p>}
          <AdminButton type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  )
}
