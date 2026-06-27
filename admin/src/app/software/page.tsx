import Link from 'next/link'
import path from 'path'

import { AdminCard } from '@/components/ui/AdminCard'
import { AdminButton } from '@/components/ui/AdminButton'
import { DATA_DIR } from '@/lib/data'
import { listSoftwareSlugs, readJson } from '@/lib/content'

type SoftwareMeta = {
  slug: string
  name: { en: string }
  status: string
}

export default function SoftwareListPage(): React.JSX.Element {
  const slugs = listSoftwareSlugs()
  const items = slugs.map((slug) => {
    const metaPath = path.join(DATA_DIR, 'software', slug, 'meta.json')
    return readJson<SoftwareMeta>(metaPath)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Software</h1>
        <Link href="/software/new">
          <AdminButton>Add software</AdminButton>
        </Link>
      </div>
      <AdminCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/60 text-left">
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug} className="border-b border-white/5">
                <td className="px-4 py-3 font-mono">{item.slug}</td>
                <td className="px-4 py-3">{item.name.en}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/software/${item.slug}`}>
                    <AdminButton variant="secondary">Edit</AdminButton>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
