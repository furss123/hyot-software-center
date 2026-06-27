import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { Card } from '@/components/ui/Card'
import { AdSlot } from '@/components/ads/AdSlot'
import { getAllDocs } from '@/lib/content/docs'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'Documentation' }

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function DocsPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const t = await getTranslations('nav')
  const docs = getAllDocs()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">{t('docs')}</h1>
      <div className="space-y-3">
        {docs.map((doc) => (
          <Link key={doc.slug} href={`/${locale}/docs/${doc.slug}`}>
            <Card hover className="p-5">
              <h2 className="font-semibold text-text-primary">
                {doc.frontmatter.title[l] ?? doc.frontmatter.title.en}
              </h2>
            </Card>
          </Link>
        ))}
      </div>
      <AdSlot position="docs" className="mt-8" />
    </div>
  )
}
