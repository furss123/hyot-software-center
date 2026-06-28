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
    <Link href={`/${locale}/software/${app.slug}`} className="h-full block">
      <Card hover className="h-full flex flex-col">
        <div className="flex flex-col h-full p-5">
          <div className="flex items-start gap-4 flex-1">
            <SoftwareIcon app={app} size="sm" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-text-primary truncate tracking-[-0.01em]">
                {app.name[l]}
              </h2>
              <p className="text-base leading-[1.6] text-text-secondary mt-1 line-clamp-2">
                {app.shortDescription[l]}
              </p>
            </div>
          </div>
          <div className="mt-auto pt-3 border-t border-border flex items-center gap-2 flex-wrap">
            <Badge variant={statusBadgeVariant(app.status)}>{app.category}</Badge>
            {app.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="default" className="normal-case tracking-[0.05em]">
                {tag}
              </Badge>
            ))}
            <DownloadCount slug={app.slug} initialCount={initialDownloadCount} />
          </div>
        </div>
      </Card>
    </Link>
  )
}
