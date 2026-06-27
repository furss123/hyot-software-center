import Link from 'next/link'

import { AdminCard } from '@/components/ui/AdminCard'
import { countReleases, listSoftwareSlugs } from '@/lib/content'

export default function AdminDashboardPage(): React.JSX.Element {
  const softwareCount = listSoftwareSlugs().length
  const releaseCount = countReleases()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">HyoT Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminCard>
          <p className="text-white/60 text-sm mb-1">Software</p>
          <p className="text-3xl font-bold">{softwareCount}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-white/60 text-sm mb-1">Releases</p>
          <p className="text-3xl font-bold">{releaseCount}</p>
        </AdminCard>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/software', label: 'Software' },
          { href: '/releases', label: 'Releases' },
          { href: '/config', label: 'Config' },
          { href: '/features', label: 'Features' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <AdminCard className="hover:border-[#0078D4]/50 transition-colors cursor-pointer text-center">
              {item.label}
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  )
}
