export type ReleaseChannel = 'stable' | 'beta' | 'legacy'
export type AssetType = 'installer' | 'portable' | 'checksum'

export interface ReleaseAsset {
  type: AssetType
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
