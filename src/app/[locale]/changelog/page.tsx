import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getPublicSoftwareSlugs, getSoftwareMeta } from '@/lib/content/software'
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

function channelBorderColor(channel: string): string {
  if (channel === 'stable') return '#2A9B8A'
  if (channel === 'beta') return '#4A9FE0'
  return 'var(--text-tertiary)'
}

export default async function ChangelogPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const tNav = await getTranslations('nav')

  const slugs = getPublicSoftwareSlugs()
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
        <div className="space-y-0">
          {allReleases.map((release, i) => (
            <div key={`${release.slug}-${release.version}-${i}`}>
              <Card
                className="pl-4 relative p-6"
                style={{
                  borderLeft: `3px solid ${channelBorderColor(release.channel)}`,
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-semibold text-text-primary">
                        {release.appName}
                      </span>
                      <Badge variant={release.channel}>{release.channel}</Badge>
                    </div>
                    <span className="text-base font-mono font-bold text-[var(--hyot-blue)]">
                      v{release.version}
                    </span>
                  </div>
                  <span className="text-sm text-text-tertiary flex-shrink-0">
                    {formatDate(release.releaseDate, locale)}
                  </span>
                </div>
                {release.notes?.[l] && (
                  <div className="text-sm text-text-secondary whitespace-pre-line">
                    {release.notes[l]}
                  </div>
                )}
              </Card>
              {i < allReleases.length - 1 && (
                <div className="flex justify-center my-2" aria-hidden="true">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, dotIndex) => (
                      <span
                        key={dotIndex}
                        style={{
                          width: '3px',
                          height: '3px',
                          borderRadius: '50%',
                          background: 'var(--dot-color-strong)',
                          opacity: 0.3 + dotIndex * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
