'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'

import { registerAdProvider } from '@/lib/ads'
import { GoogleAdSenseProvider } from '@/lib/ads/providers/adsense'
import { SponsorProvider } from '@/lib/ads/providers/sponsor'
import type { MonetizationConfig } from '@/types'

interface AdContextValue {
  config: MonetizationConfig | undefined
  enabled: boolean
}

const AdContext = createContext<AdContextValue>({ config: undefined, enabled: false })

export function useAds(): AdContextValue {
  return useContext(AdContext)
}

interface AdProviderProps {
  config: MonetizationConfig | undefined
  children: ReactNode
}

export function AdProvider({ config, children }: AdProviderProps): React.JSX.Element {
  useEffect(() => {
    registerAdProvider(new GoogleAdSenseProvider())
    registerAdProvider(new SponsorProvider())
  }, [])

  return (
    <AdContext.Provider value={{ config, enabled: config?.enabled ?? false }}>
      {children}
    </AdContext.Provider>
  )
}
