import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { SoftwareListView } from '@/components/software/SoftwareListView'
import { getSiteConfig } from '@/lib/content/config'
import { getReleasesData } from '@/lib/content/releases'
import { getAllSoftware } from '@/lib/content/software'
import { pageMetadata } from '@/lib/seo/meta'
import { sumDownloadCounts } from '@/lib/utils'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const config = getSiteConfig()
  const t = await getTranslations('nav')
  return pageMetadata(config, {
    title: t('software'),
    locale,
    path: `/${locale}/software`,
    ogImage: '/og/default.png',
  })
}

export default async function SoftwareListPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const tNav = await getTranslations('nav')

  const apps = getAllSoftware()
  const categories = [...new Set(apps.map((app) => app.category))].sort()
  const software = apps.map((app) => ({
    ...app,
    downloadCount: sumDownloadCounts(getReleasesData(app.slug)?.releases),
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">{tNav('software')}</h1>
      <Suspense fallback={null}>
        <SoftwareListView software={software} categories={categories} locale={locale} />
      </Suspense>
    </div>
  )
}
