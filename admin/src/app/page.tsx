import { DeployStatus, QuickActions } from '@/components/dashboard/DashboardPanels'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { getAllSlugs, readMeta, readReleases } from '@/lib/data'
import { t } from '@/lib/i18n'

export default function AdminDashboardPage() {
  const slugs = getAllSlugs()
  const metas = slugs.map((s) => readMeta(s)).filter(Boolean)
  const totalSoftware = metas.length
  const totalReleases = slugs.reduce((sum, slug) => {
    const data = readReleases(slug)
    return sum + (data?.releases.length ?? 0)
  }, 0)
  const totalDownloads = slugs.reduce((sum, slug) => {
    const data = readReleases(slug)
    return (
      sum +
      (data?.releases.reduce(
        (rSum, r) => rSum + r.assets.reduce((aSum, a) => aSum + (a.downloadCount ?? 0), 0),
        0,
      ) ?? 0)
    )
  }, 0)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>{t.dashboard.title}</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <AdminCard>
          <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>
            {t.dashboard.totalSoftware}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{totalSoftware}</p>
        </AdminCard>
        <AdminCard>
          <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>
            {t.dashboard.totalReleases}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{totalReleases}</p>
        </AdminCard>
        <AdminCard>
          <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.25rem' }}>
            {t.dashboard.totalDownloads}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{totalDownloads.toLocaleString()}</p>
        </AdminCard>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '0.75rem' }}>{t.dashboard.quickLinks}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {[
          { href: '/software', label: t.nav.software },
          { href: '/releases', label: t.nav.releases },
          { href: '/config', label: t.nav.config },
          { href: '/features', label: t.nav.features },
        ].map(({ href, label }) => (
          <a key={href} href={href} style={{ textDecoration: 'none' }}>
            <AdminButton variant="secondary">{label}</AdminButton>
          </a>
        ))}
        <a
          href="https://furss123.github.io/hyot-software-center/ko/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <AdminButton variant="secondary">{t.dashboard.viewSite}</AdminButton>
        </a>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <DeployStatus />
        <QuickActions />
      </div>
    </div>
  )
}
