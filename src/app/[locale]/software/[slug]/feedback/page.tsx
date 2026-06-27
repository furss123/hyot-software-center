import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { SoftwareIcon } from '@/components/software/SoftwareIcon'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getAllSoftwareSlugs, getSoftwareMeta } from '@/lib/content/software'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

function bugReportUrl(repo: string): string {
  const params = new URLSearchParams({
    template: 'bug_report.md',
    labels: 'bug',
  })
  return `https://github.com/${repo}/issues/new?${params.toString()}`
}

function featureRequestUrl(repo: string): string {
  const params = new URLSearchParams({
    template: 'feature_request.md',
    labels: 'enhancement',
  })
  return `https://github.com/${repo}/issues/new?${params.toString()}`
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
  const t = await getTranslations('feedback')
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: `${app.name[l]} ${t('breadcrumb')}`,
    description: l === 'ko' ? `${app.name.ko} 버그 제보 및 개선 건의` : `${app.name.en} bug reports and feature requests`,
    locale,
    path: `/${locale}/software/${slug}/feedback`,
    ogImage: `/og/${slug}.png`,
  })
}

export default async function SoftwareFeedbackPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('feedback')
  const tNav = await getTranslations('nav')

  const app = getSoftwareMeta(slug)
  if (!app) notFound()

  const hasRepo = Boolean(app.githubRepo)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: tNav('home'), href: `/${locale}` },
          { label: tNav('software'), href: `/${locale}/software` },
          { label: app.name[l], href: `/${locale}/software/${slug}` },
          { label: t('breadcrumb') },
        ]}
      />

      <div className="flex items-start gap-4 mb-8 mt-6">
        <SoftwareIcon app={app} size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t('title')}</h1>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </div>
      </div>

      {hasRepo && app.githubRepo ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card className="p-6 flex flex-col">
              <span className="text-3xl mb-3" aria-hidden>
                🐛
              </span>
              <h2 className="font-semibold text-text-primary text-lg mb-2">{t('bugReport')}</h2>
              <p className="text-text-secondary text-sm mb-4 flex-1">{t('bugDesc')}</p>
              <a href={bugReportUrl(app.githubRepo)} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">{t('bugButton')}</Button>
              </a>
            </Card>

            <Card className="p-6 flex flex-col">
              <span className="text-3xl mb-3" aria-hidden>
                💡
              </span>
              <h2 className="font-semibold text-text-primary text-lg mb-2">{t('featureRequest')}</h2>
              <p className="text-text-secondary text-sm mb-4 flex-1">{t('featureDesc')}</p>
              <a href={featureRequestUrl(app.githubRepo)} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">{t('featureButton')}</Button>
              </a>
            </Card>
          </div>

          <Card className="p-6 mb-6">
            <p className="text-text-secondary text-sm mb-4">{t('viewIssuesDesc')}</p>
            <a
              href={`https://github.com/${app.githubRepo}/issues`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost">{t('viewIssues')}</Button>
            </a>
          </Card>

          <div className="bg-fill-subtle rounded-xl p-4 flex gap-3 items-start">
            <span className="text-xl shrink-0" aria-hidden>
              ℹ️
            </span>
            <p className="text-text-secondary text-sm">{t('githubNote')}</p>
          </div>
        </>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-text-secondary">{t('notReady')}</p>
        </Card>
      )}
    </div>
  )
}
