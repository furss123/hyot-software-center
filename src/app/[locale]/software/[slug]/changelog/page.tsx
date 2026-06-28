import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getReleasesData } from '@/lib/content/releases'
import { getAllSoftwareSlugs, getSoftwareMeta } from '@/lib/content/software'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { formatDate } from '@/lib/utils'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import type { ReleaseChannel } from '@/types'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
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
  const t = await getTranslations('software')
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: `${t('changelog')} — ${app.name[l]}`,
    locale,
    path: `/${locale}/software/${slug}/changelog`,
    ogImage: `/og/${slug}.png`,
  })
}

export default async function SoftwareChangelogPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('software')
  const tNav = await getTranslations('nav')

  const app = getSoftwareMeta(slug)
  if (!app) notFound()

  const releasesData = getReleasesData(slug)
  if (!releasesData) notFound()

  const releases = [...releasesData.releases].sort((a, b) =>
    b.releaseDate.localeCompare(a.releaseDate),
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: tNav('home'), href: `/${locale}` },
          { label: tNav('software'), href: `/${locale}/software` },
          { label: app.name[l], href: `/${locale}/software/${slug}` },
          { label: t('changelog') },
        ]}
      />
      <Link
        href={`/${locale}/software/${slug}`}
        className="text-sm text-accent hover:opacity-80 transition-opacity mb-6 inline-block"
      >
        ← {app.name[l]}
      </Link>

      <h1 className="text-3xl font-bold text-text-primary mb-10">{t('changelog')}</h1>

      <div className="space-y-4">
        {releases.map((release) => {
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
        })}
      </div>
    </div>
  )
}
