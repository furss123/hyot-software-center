import Link from 'next/link'
import path from 'path'
import fs from 'fs'

import { AdminCard } from '@/components/ui/AdminCard'
import { DATA_DIR } from '@/lib/data'
import { listSoftwareSlugs, readJson } from '@/lib/content'

type Release = {
  version: string
  channel: string
  releaseDate: string
  assets: unknown[]
}

type ReleasesFile = {
  slug: string
  releases: Release[]
}

export default function ReleasesPage(): React.JSX.Element {
  const rows = listSoftwareSlugs()
    .flatMap((slug) => {
      const file = path.join(DATA_DIR, 'software', slug, 'releases.json')
      if (!fs.existsSync(file)) return []
      const data = readJson<ReleasesFile>(file)
      return data.releases.map((r) => ({ slug, ...r }))
    })
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Releases</h1>
      <AdminCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/60 text-left">
              <th className="px-4 py-3">App</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Assets</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.slug}-${row.version}`} className="border-b border-white/5">
                <td className="px-4 py-3">
                  <Link href={`/releases/${row.slug}`} className="text-[#0078D4] hover:underline">
                    {row.slug}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono">{row.version}</td>
                <td className="px-4 py-3">{row.channel}</td>
                <td className="px-4 py-3">{row.releaseDate}</td>
                <td className="px-4 py-3">{row.assets.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
