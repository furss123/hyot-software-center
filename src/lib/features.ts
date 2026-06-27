import { getFeatureFlags } from '@/lib/content/config'
import { isEnabled, type FeatureFlag } from '@/types/feature'

export function isFeatureEnabled(name: string): boolean {
  const flags = getFeatureFlags()
  const flag: FeatureFlag | undefined = flags[name]
  if (!flag) return false
  return isEnabled(flag)
}
