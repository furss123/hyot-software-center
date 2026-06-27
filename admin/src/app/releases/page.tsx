import { AdminCard } from '@/components/ui/AdminCard'
import { getAllSlugs, readReleases } from '@/lib/data'
import { t } from '@/lib/i18n'

export default function ReleasesPage() {
  const rows = getAllSlugs()
    .flatMap((slug) => {
      const data = readReleases(slug)
      if (!data) return []
      return data.releases.map((r) => ({
        slug,
        version: r.version,
        channel: r.channel,
        releaseDate: r.releaseDate,
        assetsCount: r.assets.length,
      }))
    })
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.releases.title}</h1>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>{t.nav.software}</th>
              <th>{t.releases.version}</th>
              <th>{t.releases.channel}</th>
              <th>{t.releases.date}</th>
              <th>{t.releases.assets}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.slug}-${row.version}`}>
                <td>
                  <a href={`/releases/${row.slug}`}>{row.slug}</a>
                </td>
                <td style={{ fontFamily: 'monospace' }}>{row.version}</td>
                <td>{t.releases.channelOptions[row.channel] ?? row.channel}</td>
                <td>{row.releaseDate}</td>
                <td>{row.assetsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
