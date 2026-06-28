import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'

import { AdSlot } from '@/components/ads/AdSlot'
import { DownloadCount } from '@/components/download/DownloadCount'
import { DownloadSection } from '@/components/download/DownloadSection'
import { ShareButton } from '@/components/software/ShareButton'
import { SoftwareIcon } from '@/components/software/SoftwareIcon'
import { SoftwareTabPanel, SoftwareTabs } from '@/components/software/SoftwareTabs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getReleasesData, getLatestRelease } from '@/lib/content/releases'
import { getAllSoftwareSlugs, getSoftwareMeta } from '@/lib/content/software'
import { getSiteConfig } from '@/lib/content/config'
import { breadcrumbJsonLd, softwareJsonLd } from '@/lib/seo/jsonld'
import { pageMetadata } from '@/lib/seo/meta'
import { formatDate, sumDownloadCounts } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import type { ReleaseChannel, SoftwareStatus } from '@/types'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

function statusBadgeVariant(
  status: SoftwareStatus,
): 'stable' | 'beta' | 'deprecated' | 'default' {
  if (status === 'active') return 'stable'
  if (status === 'beta') return 'beta'
  if (status === 'deprecated') return 'deprecated'
  return 'default'
}

function channelBadgeVariant(channel: ReleaseChannel): 'stable' | 'beta' | 'legacy' | 'default' {
  if (channel === 'stable') return 'stable'
  if (channel === 'beta') return 'beta'
  if (channel === 'legacy') return 'legacy'
  return 'default'
}

function channelBorderColor(channel: ReleaseChannel): string {
  if (channel === 'stable') return '#2A9B8A'
  if (channel === 'beta') return '#4A9FE0'
  return 'var(--text-tertiary)'
}

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const slugs = getAllSoftwareSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const app = getSoftwareMeta(slug)
  if (!app) return {}
  const l = locale as Locale
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: app.name[l],
    description: app.shortDescription[l],
    locale,
    path: `/${locale}/software/${slug}`,
    ogImage: `/og/${slug}.png`,
  })
}

export default async function SoftwareDetailPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('software')
  const tNav = await getTranslations('nav')

  const app = getSoftwareMeta(slug)
  if (!app) notFound()

  const config = getSiteConfig()
  const latestRelease = getLatestRelease(slug)
  const jsonLd = softwareJsonLd(app, latestRelease, locale, config.brand.url)
  const breadcrumb = breadcrumbJsonLd([
    { name: tNav('home'), url: `${config.brand.url}/${locale}` },
    {
      name: tNav('software'),
      url: `${config.brand.url}/${locale}/software`,
    },
    {
      name: app.name[l],
      url: `${config.brand.url}/${locale}/software/${app.slug}`,
    },
  ])

  const releasesData = getReleasesData(slug)
  const initialDownloadCount = sumDownloadCounts(releasesData?.releases)
  const releases = [...(releasesData?.releases ?? [])].sort((a, b) =>
    b.releaseDate.localeCompare(a.releaseDate),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb
          items={[
            { label: tNav('home'), href: `/${locale}` },
            { label: tNav('software'), href: `/${locale}/software` },
            { label: app.name[l] },
          ]}
        />
      <div className="flex items-start gap-6 mb-6">
        <SoftwareIcon app={app} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-text-primary">{app.name[l]}</h1>
            <Badge variant={statusBadgeVariant(app.status)}>{app.status}</Badge>
          </div>
          <p className="text-text-secondary text-lg mb-4">{app.shortDescription[l]}</p>
          <div className="flex flex-wrap items-center gap-2">
            {app.links?.docs && (
              <a href={app.links.docs} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />}>
                  {t('documentation')}
                </Button>
              </a>
            )}
            <ShareButton />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <SoftwareTabs locale={locale} slug={slug} />

        <SoftwareTabPanel tabId="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AdSlot position="softwareTop" className="mb-6" />
              <Card className="p-6">
                <h2 className="font-semibold text-text-primary mb-3">{t('descriptionLabel')}</h2>
                <p className="text-text-secondary leading-relaxed">{app.description[l]}</p>
              </Card>
              {releasesData && <DownloadSection releasesData={releasesData} locale={locale} />}
              <AdSlot position="softwareBottom" className="mt-6" />
            </div>
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wide">
                  {t('requirements')}
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-text-tertiary">{t('os')}</dt>
                    <dd className="text-text-primary font-medium mt-0.5">{app.requirements.os}</dd>
                  </div>
                  {app.requirements.arch && (
                    <div>
                      <dt className="text-text-tertiary">{t('architecture')}</dt>
                      <dd className="flex gap-1.5 mt-0.5">
                        {app.requirements.arch.map((a) => (
                          <Badge key={a} variant="default">
                            {a}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  )}
                  {app.requirements.ram && (
                    <div>
                      <dt className="text-text-tertiary">{t('ram')}</dt>
                      <dd className="text-text-primary font-medium mt-0.5">{app.requirements.ram}</dd>
                    </div>
                  )}
                  {app.requirements.disk && (
                    <div>
                      <dt className="text-text-tertiary">{t('disk')}</dt>
                      <dd className="text-text-primary font-medium mt-0.5">{app.requirements.disk}</dd>
                    </div>
                  )}
                </dl>
              </Card>
              {app.tags.length > 0 && (
                <Card className="p-5">
                  <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">
                    {t('tagsLabel')}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {app.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
              <Card className="p-5">
                <h3 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wide">
                  {t('downloadsLabel')}
                </h3>
                <DownloadCount slug={slug} initialCount={initialDownloadCount} />
              </Card>
              <Card className="p-5">
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-text-tertiary">{t('releaseDate')}</dt>
                    <dd className="text-text-primary font-medium mt-0.5">
                      {formatDate(app.updatedAt, locale)}
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>
          </div>
        </SoftwareTabPanel>

        <SoftwareTabPanel tabId="changelog">
          <div className="space-y-4">
            {releases.length === 0 ? (
              <p className="text-text-tertiary">{t('noChangelog')}</p>
            ) : (
              releases.map((release) => {
                const notes = release.notes?.[l] ?? release.notes?.en ?? ''
                return (
                  <Card
                    key={release.version}
                    className="pl-4 relative p-6"
                    style={{
                      borderLeft: `3px solid ${channelBorderColor(release.channel)}`,
                      borderRadius: '0 8px 8px 0',
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="version-number">v{release.version}</span>
                      <Badge variant={channelBadgeVariant(release.channel)}>{release.channel}</Badge>
                      <span className="text-sm text-text-tertiary">
                        {formatDate(release.releaseDate, locale)}
                      </span>
                    </div>
                    {notes && (
                      <div className="prose">
                        <MDXRemote source={notes} />
                      </div>
                    )}
                  </Card>
                )
              })
            )}
          </div>
        </SoftwareTabPanel>
      </Suspense>
      </div>
    </>
  )
}
