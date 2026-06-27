import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { SoftwareIcon } from '@/components/software/SoftwareIcon'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getAllSoftware, getAllSoftwareSlugs, getSoftwareMeta } from '@/lib/content/software'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
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
    title: `${app.name[l]} — ${t('softwarePageTitle')}`,
    description: t('softwarePageSubtitle'),
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

  const config = getSiteConfig()
  const software = getAllSoftware()
  const feedbackEnabled = config.feedback?.enabled ?? false

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: tNav('home'), href: `/${locale}` },
          { label: tNav('software'), href: `/${locale}/software` },
          { label: app.name[l], href: `/${locale}/software/${slug}` },
          { label: t('softwarePageTitle') },
        ]}
      />

      <div className="flex items-start gap-4 mb-8 mt-6">
        <SoftwareIcon app={app} size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t('softwarePageTitle')}</h1>
          <p className="text-text-secondary">{t('softwarePageSubtitle')}</p>
        </div>
      </div>

      {feedbackEnabled && config.feedback ? (
        <>
          <Suspense fallback={null}>
            <FeedbackForm
              software={software.map((s) => ({ slug: s.slug, name: s.name }))}
              supabaseUrl={config.feedback.supabaseUrl}
              supabaseAnonKey={config.feedback.supabaseAnonKey}
              locale={locale}
              initialSoftware={slug}
            />
          </Suspense>
          <p className="mt-6 bg-fill-subtle rounded-xl p-4 text-sm text-text-secondary">
            {t('softwarePageNote')}
          </p>
        </>
      ) : (
        <p className="text-text-secondary">{t('notReady')}</p>
      )}
    </div>
  )
}
