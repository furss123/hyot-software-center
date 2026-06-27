import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'

import { AdSlot } from '@/components/ads/AdSlot'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { Card } from '@/components/ui/Card'
import { getAllDocs } from '@/lib/content/docs'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }))
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('docs')
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: t('title'),
    locale,
    path: `/${locale}/docs`,
    ogImage: '/og/default.png',
  })
}

export default async function DocsPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('docs')
  const docs = getAllDocs()
  const firstDoc = docs[0]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-10">{t('title')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 flex-shrink-0">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3 px-3">
            {t('onThisPage')}
          </p>
          {docs.length > 0 ? (
            <DocsSidebar locale={locale} activeSlug={firstDoc?.slug} />
          ) : null}
        </aside>

        <main className="flex-1 min-w-0">
          {docs.length === 0 ? (
            <Card className="p-6">
              <p className="text-text-tertiary">{t('noContent')}</p>
            </Card>
          ) : firstDoc ? (
            <article>
              <h2 className="text-2xl font-bold text-text-primary mb-6">{firstDoc.title[l]}</h2>
              <div className="prose">
                <MDXRemote source={firstDoc.content} />
              </div>
            </article>
          ) : null}
          <AdSlot position="docs" className="mt-8" />
        </main>
      </div>
    </div>
  )
}
