import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSoftwareMeta, getAllSoftwareSlugs } from '@/lib/content/software'
import { getReleasesData } from '@/lib/content/releases'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DownloadSection } from '@/components/download/DownloadSection'
import { AdSlot } from '@/components/ads/AdSlot'
import { formatDate } from '@/lib/utils'
import { Github, ExternalLink } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { SoftwareStatus } from '@/types'

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

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const slugs = getAllSoftwareSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const app = getSoftwareMeta(slug)
  if (!app) return {}
  const l = locale as Locale
  return {
    title: app.name[l],
    description: app.shortDescription[l],
  }
}

export default async function SoftwareDetailPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('software')

  const app = getSoftwareMeta(slug)
  if (!app) notFound()

  const releasesData = getReleasesData(slug)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-20 bg-fill-secondary rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-sm">
          📦
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-text-primary">{app.name[l]}</h1>
            <Badge variant={statusBadgeVariant(app.status)}>{app.status}</Badge>
          </div>
          <p className="text-text-secondary text-lg mb-4">{app.shortDescription[l]}</p>
          <div className="flex flex-wrap gap-2">
            {app.links?.github && (
              <a href={app.links.github} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" icon={<Github size={14} />}>
                  GitHub
                </Button>
              </a>
            )}
            {app.links?.docs && (
              <a href={app.links.docs} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />}>
                  {t('documentation')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AdSlot position="softwareTop" className="mb-6" />
          <Card className="p-6">
            <h2 className="font-semibold text-text-primary mb-3">Description</h2>
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
                <dt className="text-text-tertiary">OS</dt>
                <dd className="text-text-primary font-medium mt-0.5">{app.requirements.os}</dd>
              </div>
              {app.requirements.arch && (
                <div>
                  <dt className="text-text-tertiary">Architecture</dt>
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
                  <dt className="text-text-tertiary">RAM</dt>
                  <dd className="text-text-primary font-medium mt-0.5">{app.requirements.ram}</dd>
                </div>
              )}
              {app.requirements.disk && (
                <div>
                  <dt className="text-text-tertiary">Disk</dt>
                  <dd className="text-text-primary font-medium mt-0.5">{app.requirements.disk}</dd>
                </div>
              )}
            </dl>
          </Card>

          {app.tags.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">
                Tags
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
    </div>
  )
}
