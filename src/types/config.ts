import type { I18nString } from './software'
import type { ReleaseChannel } from './release'

export type ThemeMode = 'dark' | 'light' | 'system'
export type Locale = 'ko' | 'en'

export interface MonetizationPositions {
  homeTop: boolean
  homeBottom: boolean
  softwareTop: boolean
  softwareBottom: boolean
  faq: boolean
  docs: boolean
  news: boolean
  about: boolean
}

export interface MonetizationConfig {
  enabled: boolean
  provider: 'adsense' | 'sponsor' | 'none'
  adFreeDownloadPages: boolean
  lazyLoadAds: boolean
  positions: MonetizationPositions
}

export interface SiteConfig {
  feedback?: {
    formspreeId: string
    enabled: boolean
  }
  brand: {
    name: string
    tagline?: I18nString
    logo?: string
    favicon?: string
    url: string
    email?: string
    github?: string
    twitter?: string
    discord?: string
  }
  seo: {
    defaultTitle: string
    titleTemplate: string
    description?: I18nString
    ogImage?: string
    twitterHandle?: string
  }
  i18n: { defaultLocale: Locale; locales: Locale[] }
  theme: { defaultMode: ThemeMode; accentColor?: string }
  download: {
    channels: ReleaseChannel[]
    showLegacy: boolean
    checksumAlgorithm: 'sha256'
  }
  nav?: Array<{ label: I18nString; href: string; external?: boolean }>
  footer?: {
    links?: Array<{
      group: I18nString
      items: Array<{ label: I18nString; href: string; external?: boolean }>
    }>
    copyright?: I18nString
  }
  monetization?: MonetizationConfig
}
