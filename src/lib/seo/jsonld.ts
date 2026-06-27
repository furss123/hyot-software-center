import type { Release, SoftwareMeta } from '@/types'

export function softwareJsonLd(
  app: SoftwareMeta,
  latestRelease: Release | null,
  locale: string,
  baseUrl: string,
): object {
  const l = locale as 'ko' | 'en'
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name[l],
    description: app.description[l],
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: app.requirements.os,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(latestRelease && {
      softwareVersion: latestRelease.version,
      datePublished: latestRelease.releaseDate,
    }),
    url: `${baseUrl}/${locale}/software/${app.slug}`,
    ...(app.links?.github && { codeRepository: app.links.github }),
  }
}

export function websiteJsonLd(baseUrl: string, name: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/ko/software?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
