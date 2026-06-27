import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { AdSlot } from '@/components/ads/AdSlot'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { getAllFaq, type FaqItem } from '@/lib/content/faq'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import type { Locale } from '@/i18n/config'

const CATEGORY_LABELS: Record<string, { ko: string; en: string }> = {
  general: { ko: '일반', en: 'General' },
  security: { ko: '보안', en: 'Security' },
  compatibility: { ko: '호환성', en: 'Compatibility' },
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const config = getSiteConfig()
  const t = await getTranslations('nav')
  return pageMetadata(config, {
    title: t('faq'),
    locale,
    path: `/${locale}/faq`,
    ogImage: '/og/default.png',
  })
}

export default async function FaqPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const tNav = await getTranslations('nav')
  const items = getAllFaq()

  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const list = acc[item.category] ?? []
    list.push(item)
    acc[item.category] = list
    return acc
  }, {})

  const categoryOrder = ['general', 'security', 'compatibility']

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: tNav('home'), href: `/${locale}` },
          { label: tNav('faq') },
        ]}
      />
      <h1 className="text-3xl font-bold text-text-primary mb-10">{tNav('faq')}</h1>
      <div className="space-y-8">
        {categoryOrder
          .filter((cat) => grouped[cat]?.length)
          .map((cat) => (
            <section key={cat}>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {CATEGORY_LABELS[cat]?.[l] ?? cat}
              </h2>
              <div className="space-y-4">
                {(grouped[cat] ?? []).map((item) => (
                  <Card key={item.id} className="p-6">
                    <h3 className="font-semibold text-text-primary mb-2">{item.question[l]}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.answer[l]}</p>
                  </Card>
                ))}
              </div>
            </section>
          ))}
      </div>
      <AdSlot position="faq" className="mt-8" />
    </div>
  )
}
