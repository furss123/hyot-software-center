'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { t } from '@/lib/i18n'
import type { SoftwareMeta } from '@/types'

export default function SoftwareListPage() {
  const router = useRouter()
  const [items, setItems] = useState<SoftwareMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/software')
      .then((res) => res.json() as Promise<SoftwareMeta[]>)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(slug: string): Promise<void> {
    if (!confirm(`정말 삭제하시겠습니까? ${slug}`)) return

    setDeleting(slug)
    try {
      const res = await fetch(`/api/software?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        alert(t.common.error)
        return
      }
      setItems((prev) => prev.filter((item) => item.slug !== slug))
      router.refresh()
    } finally {
      setDeleting(null)
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
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t.software.title}</h1>
        <a href="/software/new" style={{ textDecoration: 'none' }}>
          <AdminButton variant="primary">{t.software.addNew}</AdminButton>
        </a>
      </div>
      <AdminCard className="">
        <table>
          <thead>
            <tr>
              <th>{t.software.slug}</th>
              <th>{t.software.nameEn}</th>
              <th>{t.software.status}</th>
              <th>{t.software.category}</th>
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
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`/software/${item.slug}`} style={{ textDecoration: 'none' }}>
                      <AdminButton variant="secondary">{t.software.edit}</AdminButton>
                    </a>
                    <AdminButton
                      variant="danger"
                      disabled={deleting === item.slug}
                      onClick={() => void handleDelete(item.slug)}
                    >
                      {t.common.delete}
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
