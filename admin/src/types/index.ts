export type SoftwareStatus = 'active' | 'beta' | 'deprecated' | 'archived'
export type SoftwareCategory =
  | 'utility'
  | 'productivity'
  | 'system'
  | 'developer'
  | 'media'
  | 'security'
  | 'other'
export type ReleaseChannel = 'stable' | 'beta' | 'legacy'
export type FeatureStatus = 'enabled' | 'disabled' | 'experimental' | 'beta' | 'deprecated'

export interface I18nString {
  ko: string
  en: string
}

export interface SoftwareMeta {
  slug: string
  status: SoftwareStatus
  category: SoftwareCategory
  tags: string[]
  featured: boolean
  name: I18nString
  description: I18nString
  shortDescription: I18nString
  requirements: { os: string; arch?: string[]; ram?: string; disk?: string }
  links?: { github?: string; docs?: string }
  createdAt: string
  updatedAt: string
}

export interface ReleaseAsset {
  type: 'installer' | 'portable' | 'checksum'
  filename: string
  url: string
  size?: number
  sha256: string
  downloadCount?: number
}

export interface Release {
  version: string
  channel: ReleaseChannel
  releaseDate: string
  githubTag: string
  notes?: { ko?: string; en?: string }
  assets: ReleaseAsset[]
}

export interface ReleasesData {
  slug: string
  latest: { stable: string | null; beta: string | null }
  releases: Release[]
}

export interface FeatureFlag {
  status: FeatureStatus
  description?: string
}

export type FeatureFlags = Record<string, FeatureFlag>
