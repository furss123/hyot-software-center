import Link from 'next/link'

import { DownloadCount } from '@/components/download/DownloadCount'
import { SoftwareIcon } from '@/components/software/SoftwareIcon'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Locale } from '@/i18n/config'
import type { SoftwareMeta, SoftwareStatus } from '@/types'

type SoftwareCardProps = {
  app: SoftwareMeta
  locale: string
  initialDownloadCount?: number
}

function statusBadgeVariant(
  status: SoftwareStatus,
): 'stable' | 'beta' | 'deprecated' | 'default' {
  if (status === 'active') return 'stable'
  if (status === 'beta') return 'beta'
  if (status === 'deprecated') return 'deprecated'
  return 'default'
}

export function SoftwareCard({
  app,
  locale,
  initialDownloadCount = 0,
}: SoftwareCardProps): React.JSX.Element {
  const l = locale as Locale

  return (
    <Link href={`/${locale}/software/${app.slug}`}>
      <Card hover className="p-5 h-full">
        <div className="flex items-start gap-4">
          <SoftwareIcon app={app} size="sm" />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-text-primary truncate">{app.name[l]}</h2>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {app.shortDescription[l]}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant={statusBadgeVariant(app.status)}>{app.category}</Badge>
              {app.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
              <DownloadCount slug={app.slug} initialCount={initialDownloadCount} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
