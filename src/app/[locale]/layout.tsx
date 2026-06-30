import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AdProvider } from '@/components/ads/AdProvider'
import { SideRail } from '@/components/ads/SideRail'
import { SearchModalHost } from '@/components/search/SearchModalHost'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { getSiteConfig } from '@/lib/content/config'
import { websiteJsonLd } from '@/lib/seo/jsonld'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import type { Metadata, Viewport } from 'next'

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }))
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const viewport: Viewport = {
  themeColor: '#0078D4',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const config = getSiteConfig()
  const { locale } = await params
  const l = locale as Locale
  return {
    title: {
      default: config.seo.defaultTitle,
      template: config.seo.titleTemplate,
    },
    description: config.seo.description?.[l] ?? config.seo.description?.en,
    manifest: '/manifest.json',
    alternates: {
      types: {
        'application/rss+xml': [{ url: '/feed.xml', title: `${config.brand.name} Feed` }],
      },
    },
    openGraph: {
      siteName: config.brand.name,
      images: config.seo.ogImage ? [{ url: config.seo.ogImage }] : undefined,
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  const config = getSiteConfig()
  const siteJsonLd = websiteJsonLd(config.brand.url, config.brand.name)

  return (
    <div lang={locale} className="min-h-screen bg-bg-base text-text-primary antialiased flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
          <AdProvider config={config.monetization}>
            <SearchModalHost locale={locale}>
              <Header config={config} locale={locale} />
              <SideRail side="left" />
              <SideRail side="right" />
              <main className="flex-1">{children}</main>
              <Footer />
              <BackToTop />
            </SearchModalHost>
          </AdProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  )
}
