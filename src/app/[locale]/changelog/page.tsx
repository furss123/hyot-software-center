import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getAllSoftwareSlugs, getSoftwareMeta } from '@/lib/content/software'
import { getReleasesData } from '@/lib/content/releases'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import type { Locale } from '@/i18n/config'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const config = getSiteConfig()
  const t = await getTranslations('nav')
  return pageMetadata(config, {
    title: t('changelog'),
    locale,
    path: `/${locale}/changelog`,
    ogImage: '/og/default.png',
  })
}

export default async function ChangelogPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const tNav = await getTranslations('nav')

  const slugs = getAllSoftwareSlugs()
  const allReleases = slugs
    .flatMap((slug) => {
      const data = getReleasesData(slug)
      const meta = getSoftwareMeta(slug)
      if (!data || !meta) return []
      return data.releases.map((r) => ({ ...r, slug, appName: meta.name[l] }))
    })
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-text-primary mb-8">{tNav('changelog')}</h1>

      {allReleases.length === 0 ? (
        <p className="text-xs text-text-tertiary">No releases yet.</p>
      ) : (
        <div className="space-y-3">
          {allReleases.map((release, i) => (
            <Card
              key={`${release.slug}-${release.version}-${i}`}
              className="changelog-release-card p-5"
              data-channel={release.channel}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">
                      {release.appName}
                    </span>
                    <Badge variant={release.channel}>{release.channel}</Badge>
                  </div>
                  <span className="version-number">v{release.version}</span>
                </div>
                <span className="text-xs text-text-tertiary flex-shrink-0">
                  {formatDate(release.releaseDate, locale)}
                </span>
              </div>
              {release.notes?.[l] && (
                <div className="text-sm text-text-secondary whitespace-pre-line">
                  {release.notes[l]}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
