import type { Metadata } from 'next'
import type { SiteConfig } from '@/types'

export function buildMeta(
  config: SiteConfig,
  options: {
    title?: string
    description?: string
    ogImage?: string
    locale: string
    path: string
  },
): {
  title: string
  description: string
  canonical: string
  og: { title: string; description: string; image: string; url: string }
} {
  const l = options.locale as 'ko' | 'en'
  const title = options.title
    ? config.seo.titleTemplate.replace('%s', options.title)
    : config.seo.defaultTitle
  const description =
    options.description ?? config.seo.description?.[l] ?? config.seo.description?.en ?? ''
  const canonical = `${config.brand.url}${options.path}`
  const ogImage = options.ogImage ?? config.seo.ogImage ?? ''

  return {
    title,
    description,
    canonical,
    og: { title, description, image: ogImage, url: canonical },
  }
}

export function pageMetadata(
  config: SiteConfig,
  options: {
    title?: string
    description?: string
    ogImage?: string
    locale: string
    path: string
  },
): Metadata {
  const meta = buildMeta(config, options)
  const { locale } = options
  const koUrl = `${config.brand.url}${options.path.replace(`/${locale}`, '/ko')}`
  const enUrl = `${config.brand.url}${options.path.replace(`/${locale}`, '/en')}`

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonical,
      languages: { ko: koUrl, en: enUrl },
    },
    openGraph: {
      title: meta.og.title,
      description: meta.og.description,
      url: meta.og.url,
      images: [{ url: meta.og.image, width: 1200, height: 630 }],
      siteName: config.brand.name,
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.og.title,
      description: meta.og.description,
      images: [meta.og.image],
    },
  }
}
