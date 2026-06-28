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
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '80px',
          right: '0',
          width: '160px',
          height: '160px',
          backgroundImage:
            'radial-gradient(circle, rgba(139,79,204,0.2) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
          WebkitMaskImage:
            'radial-gradient(ellipse at top right, black 20%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div className="max-w-xl mx-auto px-4 py-12 relative">
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
    </div>
  )
}
