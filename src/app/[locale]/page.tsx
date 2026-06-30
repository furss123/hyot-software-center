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

const sectionAccentStyle = {
  width: '4px',
  height: '20px',
  borderRadius: '2px',
  flexShrink: 0,
  background: 'linear-gradient(180deg, #4A9FE0, #8B4FCC)',
} as const

const sectionDotColors = ['#4A9FE0', '#8B4FCC', '#E87820'] as const

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
        <div className="flex items-center gap-2">
          <span className="flex gap-[3px] items-center" aria-hidden>
            {sectionDotColors.map((color, i) => (
              <span
                key={color}
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: color,
                  opacity: 1 - i * 0.25,
                }}
              />
            ))}
          </span>
          <span
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}
          >
            {title}
          </span>
        </div>
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
      <section className="relative px-4 pt-14 pb-5 mt-8 overflow-hidden">
        <div className="dot-hero-bg" aria-hidden="true" />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            height: '320px',
            backgroundImage:
              'radial-gradient(circle, rgba(74,159,224,0.25) 2px, transparent 2px)',
            backgroundSize: '16px 16px',
            WebkitMaskImage:
              'radial-gradient(ellipse at top right, black 10%, transparent 70%)',
            maskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200px',
            height: '200px',
            backgroundImage:
              'radial-gradient(circle, rgba(139,79,204,0.2) 2px, transparent 2px)',
            backgroundSize: '14px 14px',
            WebkitMaskImage:
              'radial-gradient(ellipse at bottom left, black 10%, transparent 70%)',
            maskImage: 'radial-gradient(ellipse at bottom left, black 10%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative">
          <h1
            className={cn(
              'text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.1]',
              'whitespace-pre-line opacity-0 animate-fade-in-up animate-delay-100',
              'bg-gradient-to-br from-text-primary from-40% to-[#4A9FE0] bg-clip-text text-transparent',
            )}
          >
            {t('hero.title')}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mt-5 mb-10 text-balance sm:whitespace-nowrap opacity-0 animate-fade-in-up animate-delay-200">
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

      <div className="dot-divider mx-auto max-w-7xl px-6 my-2" aria-hidden="true" />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {featured.map((app) => (
                <Link
                  key={app.slug}
                  href={`/${locale}/software/${app.slug}`}
                  className="h-full block"
                >
                  <Card hover className="h-full flex flex-col">
                    <div className="flex flex-col h-full p-5">
                      <div className="flex items-start gap-4 flex-1">
                        <SoftwareIcon app={app} size="sm" />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-text-primary truncate tracking-[-0.01em]">
                            {app.name[l]}
                          </h3>
                          <p className="text-base leading-[1.6] text-text-secondary mt-1 line-clamp-2">
                            {app.shortDescription[l]}
                          </p>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                        <Badge variant={statusBadgeVariant(app.status)}>
                          {app.status}
                        </Badge>
                        <Badge variant="default">{app.category}</Badge>
                        <DownloadCount
                          repo={app.githubRepo}
                          initialCount={sumDownloadCounts(getReleasesData(app.slug)?.releases)}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && latestReleases.length > 0 && (
        <div className="dot-divider max-w-7xl mx-auto px-6" aria-hidden="true" />
      )}

      {latestReleases.length > 0 && (
        <section className="py-16 px-4">
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
                  <Card hover className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-text-primary">{slug}</span>
                      <Badge variant={release.channel}>{release.channel}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-mono font-bold text-[var(--hyot-blue)]">
                        v{release.version}
                      </span>
                      <span className="text-base text-text-tertiary">
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
