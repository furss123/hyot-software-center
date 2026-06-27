import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { AdSlot } from '@/components/ads/AdSlot'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { getAllNews } from '@/lib/content/news'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { formatDate } from '@/lib/utils'
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
  const t = await getTranslations('news')
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: t('title'),
    locale,
    path: `/${locale}/news`,
    ogImage: '/og/default.png',
  })
}

export default async function NewsPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('news')
  const news = getAllNews()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-10">{t('title')}</h1>

      {news.length === 0 ? (
        <p className="text-text-tertiary">{t('noNews')}</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <Link key={item.slug} href={`/${locale}/news/${item.slug}`}>
              <Card hover className="p-6">
                <h2 className="font-semibold text-text-primary mb-2">{item.title[l]}</h2>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{item.summary[l]}</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs text-text-tertiary">
                    {t('publishedOn')}: {formatDate(item.date, locale)}
                  </span>
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-sm text-accent">{t('readMore')} →</span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <AdSlot position="news" className="mt-8" />
    </div>
  )
}
