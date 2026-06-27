'use client'

import type { AdProvider, AdRenderProps } from '@/types/monetization'

// Placeholder — no real publisher ID yet
// To activate: add publisherId, inject AdSense script in layout
export class GoogleAdSenseProvider implements AdProvider {
  type = 'adsense' as const

  render(props: AdRenderProps): null {
    void props
    // TODO: implement when publisherId is configured
    // <ins class="adsbygoogle" data-ad-client={publisherId} data-ad-slot={slot} />
    return null
  }
}
