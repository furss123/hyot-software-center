import { AdminCard } from '@/components/ui/AdminCard'
import { getAllSlugs, readReleases } from '@/lib/data'

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
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Releases</h1>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>Software</th>
              <th>Version</th>
              <th>Channel</th>
              <th>Date</th>
              <th>Assets</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.slug}-${row.version}`}>
                <td>
                  <a href={`/releases/${row.slug}`}>{row.slug}</a>
                </td>
                <td style={{ fontFamily: 'monospace' }}>{row.version}</td>
                <td>{row.channel}</td>
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
