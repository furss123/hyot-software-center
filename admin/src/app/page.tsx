import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { getAllSlugs, readMeta, readReleases } from '@/lib/data'

export default function AdminDashboardPage() {
  const slugs = getAllSlugs()
  const metas = slugs.map((s) => readMeta(s)).filter(Boolean)
  const totalSoftware = metas.length
  const totalReleases = slugs.reduce((sum, slug) => {
    const data = readReleases(slug)
    return sum + (data?.releases.length ?? 0)
  }, 0)
  const featuredCount = metas.filter((m) => m?.featured).length
  const lastUpdated = metas.reduce<string | null>((latest, m) => {
    if (!m?.updatedAt) return latest
    if (!latest || m.updatedAt > latest) return m.updatedAt
    return latest
  }, null)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>HyoT Admin</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <AdminCard>
          <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>Software</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{totalSoftware}</p>
        </AdminCard>
        <AdminCard>
          <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>
            Total releases
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{totalReleases}</p>
        </AdminCard>
        <AdminCard>
          <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>
            Featured
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{featuredCount}</p>
        </AdminCard>
        <AdminCard>
          <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>
            Last updated
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{lastUpdated ?? '—'}</p>
        </AdminCard>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {[
          { href: '/software', label: 'Software' },
          { href: '/releases', label: 'Releases' },
          { href: '/config', label: 'Config' },
          { href: '/features', label: 'Features' },
        ].map(({ href, label }) => (
          <a key={href} href={href} style={{ textDecoration: 'none' }}>
            <AdminButton variant="secondary">{label}</AdminButton>
          </a>
        ))}
      </div>
    </div>
  )
}
