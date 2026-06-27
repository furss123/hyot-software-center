'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { t } from '@/lib/i18n'
import type { SoftwareMeta } from '@/types'

export default function SoftwareListPage() {
  const [items, setItems] = useState<SoftwareMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/software')
      .then((res) => res.json() as Promise<SoftwareMeta[]>)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(slug: string): Promise<void> {
    if (!confirm(`${t.software.deleteConfirm}\n${slug}`)) return

    setDeleting(slug)
    try {
      const res = await fetch(`/api/software?slug=${encodeURIComponent(slug)}`, {
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

  async function toggleFeatured(item: SoftwareMeta): Promise<void> {
    const updated = { ...item, featured: !item.featured }
    setToggling(item.slug)
    setItems((prev) => prev.map((i) => (i.slug === item.slug ? updated : i)))

    try {
      const res = await fetch('/api/software', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!res.ok) {
        setItems((prev) => prev.map((i) => (i.slug === item.slug ? item : i)))
        alert(t.common.error)
        return
      }
      const saved = (await res.json()) as SoftwareMeta
      setItems((prev) => prev.map((i) => (i.slug === item.slug ? saved : i)))
    } catch {
      setItems((prev) => prev.map((i) => (i.slug === item.slug ? item : i)))
      alert(t.common.error)
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t.software.title}</h1>
        <a href="/software/new" style={{ textDecoration: 'none' }}>
          <AdminButton variant="primary">{t.software.addNew}</AdminButton>
        </a>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '1.5rem' }}>
        {items.length}
        {t.software.count}
      </p>
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '1.5rem',
        }}
      />
      <AdminCard className="">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#686868' }}>
            {t.software.empty}
          </div>
        ) : (
          <table className="admin-table">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>{t.software.slug}</th>
                <th>{t.software.nameEn}</th>
                <th>{t.software.status}</th>
                <th>{t.software.category}</th>
                <th>{t.software.featured}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug}>
                  <td style={{ fontFamily: 'monospace' }}>{item.slug}</td>
                  <td>{item.name.en}</td>
                  <td>{t.software.statusOptions[item.status] ?? item.status}</td>
                  <td>{t.software.categoryOptions[item.category] ?? item.category}</td>
                  <td>
                    <button
                      type="button"
                      disabled={toggling === item.slug}
                      onClick={() => void toggleFeatured(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: toggling === item.slug ? 'not-allowed' : 'pointer',
                        fontSize: '1.25rem',
                        lineHeight: 1,
                        padding: '0.25rem',
                        color: item.featured ? '#F9C74F' : '#686868',
                        opacity: toggling === item.slug ? 0.5 : 1,
                      }}
                      aria-label={item.featured ? t.software.featuredOn : t.software.featuredOff}
                    >
                      {item.featured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={`/software/${item.slug}`} style={{ textDecoration: 'none' }}>
                        <AdminButton variant="secondary">{t.software.edit}</AdminButton>
                      </a>
                      <AdminButton
                        variant="danger"
                        disabled={deleting === item.slug}
                        onClick={() => void handleDelete(item.slug)}
                      >
                        {deleting === item.slug ? t.software.deleting : t.common.delete}
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>
    </div>
  )
}
