import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AdProvider } from '@/components/ads/AdProvider'
import { SearchModalHost } from '@/components/search/SearchModalHost'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSiteConfig } from '@/lib/content/config'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import type { Metadata } from 'next'

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }))
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
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
    openGraph: {
      siteName: config.brand.name,
      images: config.seo.ogImage ? [{ url: config.seo.ogImage }] : undefined,
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

  return (
    <div lang={locale} className="min-h-screen bg-bg-base text-text-primary antialiased flex flex-col">
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
          <AdProvider config={config.monetization}>
            <SearchModalHost locale={locale}>
              <Header config={config} locale={locale} />
              <main className="flex-1">{children}</main>
              <Footer config={config} locale={locale} />
            </SearchModalHost>
          </AdProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  )
}
