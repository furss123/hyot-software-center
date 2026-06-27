export type SoftwareStatus = 'active' | 'beta' | 'deprecated' | 'archived'
export type SoftwareCategory =
  | 'utility'
  | 'productivity'
  | 'system'
  | 'developer'
  | 'media'
  | 'security'
  | 'other'
export type Arch = 'x64' | 'arm64' | 'x86'

export interface I18nString {
  ko: string
  en: string
}

export interface Screenshot {
  file: string
  alt: I18nString
}

export interface SoftwareMeta {
  slug: string
  status: SoftwareStatus
  category: SoftwareCategory
  tags: string[]
  featured: boolean
  icon?: string
  banner?: string
  screenshots: Screenshot[]
  name: I18nString
  description: I18nString
  shortDescription: I18nString
  requirements: {
    os: string
    arch?: Arch[]
    ram?: string
    disk?: string
  }
  links?: {
    github?: string
    docs?: string
    homepage?: string
  }
  seo?: {
    title?: I18nString
    description?: I18nString
    ogImage?: string
  }
  createdAt: string
  updatedAt: string
}
