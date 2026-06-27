'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import type { NewsItemAdmin } from '@/lib/content'
import { t } from '@/lib/i18n'

export default function ContentNewsPage() {
  const [items, setItems] = useState<NewsItemAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/content/news')
      .then((res) => res.json() as Promise<NewsItemAdmin[]>)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(slug: string, title: string): Promise<void> {
    if (!confirm(`${t.content.deleteNewsConfirm}\n${title}`)) return

    setDeleting(slug)
    try {
      const res = await fetch(`/api/content/news?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        alert(t.common.error)
        return
      }
      window.location.reload()
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>
  }

  return (
    <div>
      <a href="/content" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← {t.content.title}
      </a>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t.content.news}</h1>
        <a href="/content/news/new" style={{ textDecoration: 'none' }}>
          <AdminButton variant="primary">{t.content.addNews}</AdminButton>
        </a>
      </div>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>{t.common.slug}</th>
              <th>{t.content.newsTitle}</th>
              <th>{t.content.date}</th>
              <th>{t.content.published}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug}>
                <td style={{ fontFamily: 'monospace' }}>{item.slug}</td>
                <td>{item.title.ko}</td>
                <td>{item.date}</td>
                <td>{item.published ? t.common.yes : t.common.no}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`/content/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                      <AdminButton variant="secondary">{t.common.edit}</AdminButton>
                    </a>
                    <AdminButton
                      variant="danger"
                      disabled={deleting === item.slug}
                      onClick={() => void handleDelete(item.slug, item.title.ko)}
                    >
                      {deleting === item.slug ? t.software.deleting : t.common.delete}
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
