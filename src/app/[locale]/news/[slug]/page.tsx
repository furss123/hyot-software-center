import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'

import { AdSlot } from '@/components/ads/AdSlot'
import { Badge } from '@/components/ui/Badge'
import { getAllNews, getNewsItem } from '@/lib/content/news'
import { formatDate } from '@/lib/utils'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const slugs = getAllNews().map((n) => n.slug)
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const item = getNewsItem(slug)
  if (!item) return {}
  const l = locale as Locale
  return {
    title: item.title[l],
    description: item.summary[l],
  }
}

export default async function NewsDetailPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('news')

  const item = getNewsItem(slug)
  if (!item) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href={`/${locale}/news`}
        className="text-sm text-accent hover:opacity-80 transition-opacity mb-6 inline-block"
      >
        {t('backToNews')}
      </Link>

      <h1 className="text-3xl font-bold text-text-primary mb-4">{item.title[l]}</h1>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-sm text-text-tertiary">
          {t('publishedOn')}: {formatDate(item.date, locale)}
        </span>
        {item.tags.map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="prose mt-8">
        <MDXRemote source={item.content} />
      </div>

      <AdSlot position="news" className="mt-8" />
    </article>
  )
}
