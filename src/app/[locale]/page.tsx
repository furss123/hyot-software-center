import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFeaturedSoftware } from '@/lib/content/software'
import { getAllLatestReleases } from '@/lib/content/releases'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AdSlot } from '@/components/ads/AdSlot'
import { cn, formatDate, sumDownloadCounts } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
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

const sectionTitleStyle = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-tertiary)',
}

const sectionAccentStyle = {
  width: '4px',
  height: '18px',
  background: 'linear-gradient(180deg, #0078D4, #7B2FBE)',
  borderRadius: '2px',
  flexShrink: 0,
}

function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel,
  viewAllClassName,
}: {
  title: string
  viewAllHref: string
  viewAllLabel: string
  viewAllClassName: string
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div style={sectionAccentStyle} aria-hidden />
        <h2 style={sectionTitleStyle}>{title}</h2>
      </div>
      <Link href={viewAllHref} className={viewAllClassName} aria-label={viewAllLabel}>
        <ArrowRight size={15} />
      </Link>
    </div>
  )
}

export default async function HomePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('home')
  const featured = getFeaturedSoftware()
  const latestReleases = getAllLatestReleases().slice(0, 6)

  const viewAllLinkClass = cn(
    'flex items-center justify-center w-8 h-8 rounded-lg',
    'text-text-tertiary hover:text-text-primary',
    'bg-fill-subtle hover:bg-fill-secondary',
    'border border-border-pixel',
    'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
  )

  return (
    <div className="flex flex-col">
      <section className="relative px-4 pt-16 pb-12 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[200px] h-[200px] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,120,212,0.15) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            maskImage: 'radial-gradient(ellipse at top right, black 30%, transparent 70%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at top right, black 30%, transparent 70%)',
          }}
          aria-hidden
        />
        <div className="max-w-7xl mx-auto text-center relative">
          <h1
            className={cn(
              'text-5xl sm:text-6xl font-bold tracking-[-0.03em] leading-[1.1] whitespace-pre-line',
              'opacity-0 animate-fade-in-up animate-delay-100',
              'bg-gradient-to-br from-text-primary from-60% to-[var(--hyot-blue-light)]',
              'bg-clip-text text-transparent',
            )}
          >
            {t('hero.title')}
          </h1>

          <p className="text-base text-text-secondary max-w-lg mx-auto mt-4 mb-8 opacity-0 animate-fade-in-up animate-delay-200">
            {t('hero.subtitle')}
          </p>

          <div className="flex items-center justify-center opacity-0 animate-fade-in-up animate-delay-300">
            <Link href={`/${locale}/software`}>
              <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="end">
                {t('hero.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AdSlot position="homeTop" className="my-8 max-w-7xl mx-auto px-4" />

      {featured.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              title={t('featured')}
              viewAllHref={`/${locale}/software`}
              viewAllLabel={t('viewAll')}
              viewAllClassName={viewAllLinkClass}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((app) => (
                <Link key={app.slug} href={`/${locale}/software/${app.slug}`}>
                  <Card hover className="p-5 h-full">
                    <div className="flex items-start gap-4">
                      <SoftwareIcon app={app} size="sm" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-text-primary truncate tracking-[-0.01em]">
                          {app.name[l]}
                        </h3>
                        <p className="text-[12px] leading-normal text-text-secondary mt-1 line-clamp-2">
                          {app.shortDescription[l]}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          <Badge variant={statusBadgeVariant(app.status)}>
                            {app.status}
                          </Badge>
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
        <section className="py-16 px-4 border-t border-border-pixel">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              title={t('latestReleases')}
              viewAllHref={`/${locale}/changelog`}
              viewAllLabel={t('viewAll')}
              viewAllClassName={viewAllLinkClass}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {latestReleases.map(({ slug, release }) => (
                <Link key={`${slug}-${release.version}`} href={`/${locale}/software/${slug}`}>
                  <Card hover className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-text-primary">{slug}</span>
                      <Badge variant={release.channel}>{release.channel}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="version-number">v{release.version}</span>
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
