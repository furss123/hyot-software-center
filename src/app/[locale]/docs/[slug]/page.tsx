import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'

import { AdSlot } from '@/components/ads/AdSlot'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { getAllDocs, getDocItem } from '@/lib/content/docs'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const slugs = getAllDocs().map((d) => d.slug)
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const doc = getDocItem(slug)
  if (!doc) return {}
  const l = locale as Locale
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: doc.title[l],
    locale,
    path: `/${locale}/docs/${slug}`,
    ogImage: '/og/default.png',
  })
}

export default async function DocDetailPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('docs')
  const tNav = await getTranslations('nav')

  const doc = getDocItem(slug)
  if (!doc) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: tNav('home'), href: `/${locale}` },
          { label: t('title'), href: `/${locale}/docs` },
          { label: doc.title[l] },
        ]}
      />
      <Link
        href={`/${locale}/docs`}
        className="text-sm text-accent hover:opacity-80 transition-opacity mb-6 inline-block"
      >
        ← {t('title')}
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 flex-shrink-0">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3 px-3">
            {t('onThisPage')}
          </p>
          <DocsSidebar locale={locale} activeSlug={slug} />
        </aside>

        <article className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-text-primary mb-8">{doc.title[l]}</h1>
          <div className="prose">
            <MDXRemote source={doc.content} />
          </div>
          <AdSlot position="docs" className="mt-8" />
        </article>
      </div>
    </div>
  )
}
