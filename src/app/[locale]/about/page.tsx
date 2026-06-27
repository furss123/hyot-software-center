import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/content/config'
import { pageMetadata } from '@/lib/seo/meta'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const config = getSiteConfig()
  const t = await getTranslations('nav')
  return pageMetadata(config, {
    title: t('about'),
    locale,
    path: `/${locale}/about`,
    ogImage: '/og/default.png',
  })
}

export default async function AboutPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const config = getSiteConfig()
  const tNav = await getTranslations('nav')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: tNav('home'), href: `/${locale}` },
          { label: tNav('about') },
        ]}
      />
      <h1 className="text-3xl font-bold text-text-primary mb-4">{tNav('about')}</h1>
      <p className="text-text-secondary text-lg mb-10">{config.seo.description?.[l]}</p>
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">H</span>
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">{config.brand.name}</h2>
        <p className="text-text-secondary mb-6">{config.brand.tagline?.[l]}</p>
        {config.brand.github && (
          <a href={config.brand.github} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" icon={<Github size={16} />}>
              GitHub
            </Button>
          </a>
        )}
      </Card>
      <AdSlot position="about" className="mt-8" />
    </div>
  )
}
