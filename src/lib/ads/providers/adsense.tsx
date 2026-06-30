'use client'

import { AdSenseUnit } from '@/components/ads/AdSenseUnit'
import type { AdProvider, AdRenderProps } from '@/types/monetization'

export class GoogleAdSenseProvider implements AdProvider {
  type = 'adsense' as const

  render({ publisherId, slot }: AdRenderProps): React.JSX.Element | null {
    // Requires both the publisher ID and a per-unit slot ID.
    // Until an ad unit is created in AdSense (slot is empty), render nothing.
    if (!publisherId || !slot) return null
    return <AdSenseUnit publisherId={publisherId} slot={slot} />
  }
}
