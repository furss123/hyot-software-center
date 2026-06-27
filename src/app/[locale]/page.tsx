import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFeaturedSoftware } from '@/lib/content/software'
import { getAllLatestReleases } from '@/lib/content/releases'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AdSlot } from '@/components/ads/AdSlot'
import { formatDate, sumDownloadCounts } from '@/lib/utils'
import { Github, ArrowRight } from 'lucide-react'
import { SoftwareIcon } from '@/components/software/SoftwareIcon'
import { DownloadCount } from '@/components/download/DownloadCount'
import { getReleasesData } from '@/lib/content/releases'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/config'
import type { SoftwareStatus } from '@/types'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const config = getSiteConfig()
  return pageMetadata(config, {
    locale,
    path: `/${locale}`,
    ogImage: '/og/default.png',
  })
}

function statusBadgeVariant(
  status: SoftwareStatus,
): 'stable' | 'beta' | 'deprecated' | 'default' {
  if (status === 'active') return 'stable'
  if (status === 'beta') return 'beta'
  if (status === 'deprecated') return 'deprecated'
  return 'default'
}

export default async function HomePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('home')
  const config = getSiteConfig()
  const featured = getFeaturedSoftware()
  const latestReleases = getAllLatestReleases().slice(0, 6)

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-24 sm:py-32 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle text-accent text-xs font-medium mb-6 opacity-0 animate-fade-in-up">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            {config.brand.tagline?.[l] ?? config.brand.tagline?.en}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight whitespace-pre-line opacity-0 animate-fade-in-up animate-delay-100">
            {t('hero.title')}
          </h1>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up animate-delay-200">
            {t('hero.subtitle')}
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap opacity-0 animate-fade-in-up animate-delay-300">
            <Link href={`/${locale}/software`}>
              <Button size="lg" icon={<ArrowRight size={18} />}>
                {t('hero.cta')}
              </Button>
            </Link>
            {config.brand.github && (
              <a href={config.brand.github} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" icon={<Github size={18} />}>
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      <AdSlot position="homeTop" className="my-8 max-w-7xl mx-auto px-4" />

      {featured.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text-primary">{t('featured')}</h2>
              <Link
                href={`/${locale}/software`}
                className="text-sm text-accent hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                {t('viewAll')} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((app) => (
                <Link key={app.slug} href={`/${locale}/software/${app.slug}`}>
                  <Card hover className="p-5 h-full">
                    <div className="flex items-start gap-4">
                      <SoftwareIcon app={app} size="sm" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-text-primary truncate">
                          {app.name[l]}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                          {app.shortDescription[l]}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant={statusBadgeVariant(app.status)}>{app.status}</Badge>
                          <Badge variant="default">{app.category}</Badge>
                          <DownloadCount
                            slug={app.slug}
                            initialCount={sumDownloadCounts(getReleasesData(app.slug)?.releases)}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {latestReleases.length > 0 && (
        <section className="py-16 px-4 bg-bg-surface-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text-primary">{t('latestReleases')}</h2>
              <Link
                href={`/${locale}/changelog`}
                className="text-sm text-accent hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                {t('viewAll')} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestReleases.map(({ slug, release }) => (
                <Link key={`${slug}-${release.version}`} href={`/${locale}/software/${slug}`}>
                  <Card hover className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-text-primary text-sm">{slug}</span>
                      <Badge variant={release.channel}>{release.channel}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-mono text-sm">v{release.version}</span>
                      <span className="text-xs text-text-tertiary">
                        {formatDate(release.releaseDate, locale)}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <AdSlot position="homeBottom" className="my-8 max-w-7xl mx-auto px-4" />
    </div>
  )
}
