export type FeatureStatus = 'enabled' | 'disabled' | 'experimental' | 'beta' | 'deprecated'

export interface FeatureFlag {
  status: FeatureStatus
  description?: string
  since?: string
  deprecatedSince?: string
  removedIn?: string
}

export type FeatureFlags = Record<string, FeatureFlag>

export function isEnabled(flag: FeatureFlag): boolean {
  return (
    flag.status === 'enabled' ||
    flag.status === 'beta' ||
    flag.status === 'experimental'
  )
}
