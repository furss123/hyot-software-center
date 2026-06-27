import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllSoftware } from '@/lib/content/software'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Locale } from '@/i18n/config'
import type { Metadata } from 'next'
import type { SoftwareStatus } from '@/types'

export const metadata: Metadata = { title: 'Software' }

interface PageProps {
  params: Promise<{ locale: string }>
}

function statusBadgeVariant(
  status: SoftwareStatus,
): 'stable' | 'beta' | 'deprecated' | 'default' {
  if (status === 'active') return 'stable'
  if (status === 'beta') return 'beta'
  if (status === 'deprecated') return 'deprecated'
  return 'default'
}

export default async function SoftwareListPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('software')
  const software = getAllSoftware()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary mb-2">{t('download')}</h1>
        <p className="text-text-secondary">{software.length} apps available</p>
      </div>

      {software.length === 0 ? (
        <div className="text-center py-24 text-text-tertiary">
          <p className="text-lg">{t('noSoftware')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {software.map((app) => (
            <Link key={app.slug} href={`/${locale}/software/${app.slug}`}>
              <Card hover className="p-5 h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-fill-secondary rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                    📦
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-text-primary truncate">{app.name[l]}</h2>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                      {app.shortDescription[l]}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <Badge variant={statusBadgeVariant(app.status)}>{app.category}</Badge>
                      {app.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
