import { AdminCard } from '@/components/ui/AdminCard'
import { getAllSlugs, readReleases } from '@/lib/data'
import { t } from '@/lib/i18n'

export default function AnalyticsPage() {
  const rows = getAllSlugs().map((slug) => {
    const data = readReleases(slug)
    const releases = data?.releases ?? []
    const totalDownloads = releases.reduce(
      (sum, r) => sum + r.assets.reduce((aSum, a) => aSum + (a.downloadCount ?? 0), 0),
      0,
    )
    const latest = releases.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0]
    return {
      slug,
      totalDownloads,
      latestVersion: latest?.version ?? '—',
      releaseDate: latest?.releaseDate ?? '—',
    }
  })

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.analytics.title}</h1>
      <p style={{ fontSize: '0.875rem', color: '#A0A0A0', marginBottom: '1.5rem' }}>{t.analytics.note}</p>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>{t.analytics.software}</th>
              <th>{t.analytics.totalDownloads}</th>
              <th>{t.analytics.latestVersion}</th>
              <th>{t.analytics.releaseDate}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug}>
                <td>{row.slug}</td>
                <td>{row.totalDownloads.toLocaleString()}</td>
                <td style={{ fontFamily: 'monospace' }}>{row.latestVersion}</td>
                <td>{row.releaseDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
