import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { getAllSoftware } from '@/lib/content/software'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { locales } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('feedback')
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: t('title'),
    description: t('subtitle'),
    locale,
    path: `/${locale}/feedback`,
    ogImage: '/og/default.png',
  })
}

export default async function FeedbackPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('feedback')
  const software = getAllSoftware()
  const config = getSiteConfig()

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{t('title')}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('subtitle')}</p>
      </div>

      {config.feedback?.enabled ? (
        <Suspense fallback={null}>
          <FeedbackForm
            software={software.map((s) => ({ slug: s.slug, name: s.name }))}
            supabaseUrl={config.feedback.supabaseUrl}
            supabaseAnonKey={config.feedback.supabaseAnonKey}
            locale={locale}
          />
        </Suspense>
      ) : (
        <p className="text-text-secondary">{t('notReady')}</p>
      )}
    </div>
  )
}
