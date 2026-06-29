'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { t } from '@/lib/i18n'
import type { SoftwareMeta } from '@/types'

function isVisible(meta: SoftwareMeta): boolean {
  return meta.visible !== false
}

export default function SoftwareListPage() {
  const [items, setItems] = useState<SoftwareMeta[]>([])
  const [featuredMap, setFeaturedMap] = useState<Map<string, boolean>>(new Map())
  const [visibleMap, setVisibleMap] = useState<Map<string, boolean>>(new Map())
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null)
  const [togglingVisible, setTogglingVisible] = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/software')
      .then((res) => res.json() as Promise<SoftwareMeta[]>)
      .then((list) => {
        setItems(list)
        setFeaturedMap(new Map(list.map((item) => [item.slug, item.featured])))
        setVisibleMap(new Map(list.map((item) => [item.slug, isVisible(item)])))
      })
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

  async function toggleFeatured(slug: string): Promise<void> {
    const current = featuredMap.get(slug) ?? false
    const next = !current

    setFeaturedMap((prev) => new Map(prev).set(slug, next))
    setTogglingFeatured(slug)

    try {
      const res = await fetch(`/api/software?slug=${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error('fetch failed')
      const meta = (await res.json()) as SoftwareMeta

      const putRes = await fetch('/api/software?featuredToggle=1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...meta, featured: next }),
      })
      if (!putRes.ok) throw new Error('put failed')

      const saved = (await putRes.json()) as SoftwareMeta
      setItems((prev) => prev.map((i) => (i.slug === slug ? saved : i)))
      setFeaturedMap((prev) => new Map(prev).set(slug, saved.featured))
    } catch {
      setFeaturedMap((prev) => new Map(prev).set(slug, current))
      alert(t.common.error)
    } finally {
      setTogglingFeatured(null)
    }
  }

  async function toggleVisible(slug: string): Promise<void> {
    const current = visibleMap.get(slug) ?? true
    const next = !current

    setVisibleMap((prev) => new Map(prev).set(slug, next))
    setTogglingVisible(slug)

    try {
      const res = await fetch(`/api/software?slug=${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error('fetch failed')
      const meta = (await res.json()) as SoftwareMeta

      const putRes = await fetch('/api/software?visibleToggle=1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...meta, visible: next }),
      })
      if (!putRes.ok) throw new Error('put failed')

      const saved = (await putRes.json()) as SoftwareMeta
      setItems((prev) => prev.map((i) => (i.slug === slug ? saved : i)))
      setVisibleMap((prev) => new Map(prev).set(slug, isVisible(saved)))
    } catch {
      setVisibleMap((prev) => new Map(prev).set(slug, current))
      alert(t.common.error)
    } finally {
      setTogglingVisible(null)
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
              <col style={{ width: '14%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '8%' }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>{t.software.slug}</th>
                <th>{t.software.nameEn}</th>
                <th>{t.software.status}</th>
                <th>{t.software.category}</th>
                <th>{t.software.featured}</th>
                <th>{t.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const featured = featuredMap.get(item.slug) ?? item.featured
                const visible = visibleMap.get(item.slug) ?? isVisible(item)
                return (
                  <tr
                    key={item.slug}
                    style={visible ? undefined : { opacity: 0.55 }}
                  >
                    <td style={{ fontFamily: 'monospace' }}>{item.slug}</td>
                    <td>{item.name.en}</td>
                    <td>
                      {!visible ? (
                        <span style={{ color: '#F9C74F' }}>{t.software.hidden}</span>
                      ) : (
                        (t.software.statusOptions[item.status] ?? item.status)
                      )}
                    </td>
                    <td>{t.software.categoryOptions[item.category] ?? item.category}</td>
                    <td>
                      <button
                        type="button"
                        disabled={togglingFeatured === item.slug}
                        onClick={() => void toggleFeatured(item.slug)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: togglingFeatured === item.slug ? 'not-allowed' : 'pointer',
                          fontSize: '1.25rem',
                          lineHeight: 1,
                          padding: '0.25rem',
                          color: featured ? '#F9C74F' : '#686868',
                          opacity: togglingFeatured === item.slug ? 0.5 : 1,
                        }}
                        aria-label={featured ? t.software.featuredOn : t.software.featuredOff}
                      >
                        {featured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <a href={`/software/${item.slug}`} style={{ textDecoration: 'none' }}>
                          <AdminButton variant="secondary">{t.software.edit}</AdminButton>
                        </a>
                        <AdminButton
                          variant="secondary"
                          disabled={togglingVisible === item.slug}
                          onClick={() => void toggleVisible(item.slug)}
                        >
                          {togglingVisible === item.slug
                            ? t.software.hiding
                            : visible
                              ? t.software.hide
                              : t.software.show}
                        </AdminButton>
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
                )
              })}
            </tbody>
          </table>
        )}
      </AdminCard>
    </div>
  )
}
