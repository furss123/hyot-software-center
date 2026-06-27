import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { Card } from '@/components/ui/Card'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('security')
  const config = getSiteConfig()
  return pageMetadata(config, {
    title: t('title'),
    locale,
    path: `/${locale}/security`,
    ogImage: '/og/default.png',
  })
}

export default async function SecurityPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('security')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-10">{t('title')}</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-semibold text-text-primary mb-3">{t('reportingTitle')}</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('reporting')}</p>
          <a
            href="https://github.com/hyot/hyot-software-center/security/advisories/new"
            className="text-accent text-sm hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('reportLink')} →
          </a>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-text-primary mb-3">{t('verifyTitle')}</h2>
          <p className="text-text-secondary text-sm leading-relaxed">{t('verify')}</p>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-text-primary mb-3">{t('supportedTitle')}</h2>
          <p className="text-text-secondary text-sm leading-relaxed">{t('supported')}</p>
        </Card>
      </div>
    </div>
  )
}
