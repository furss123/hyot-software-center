'use client'

import type { AdProvider, AdRenderProps } from '@/types/monetization'

// Future: render sponsor banner cards
export class SponsorProvider implements AdProvider {
  type = 'sponsor' as const

  render(props: AdRenderProps): null {
    void props
    return null
  }
}
