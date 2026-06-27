import type { ReactNode } from 'react'

import type { MonetizationConfig, MonetizationPositions } from './config'

export type AdPosition = keyof MonetizationPositions

export type AdProviderType = 'adsense' | 'sponsor' | 'none'

export interface AdProviderConfig {
  publisherId?: string
  clientId?: string
  [key: string]: string | undefined
}

export interface AdRenderProps {
  position: AdPosition
  className?: string
}

export interface AdProvider {
  type: AdProviderType
  render(props: AdRenderProps): ReactNode
}

export type { MonetizationConfig, MonetizationPositions }
