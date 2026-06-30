'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

import { AdSenseUnit } from '@/components/ads/AdSenseUnit'
import { locales } from '@/i18n/config'
import type { AdPosition } from '@/types/monetization'

import { useAds } from './AdProvider'

interface SideRailProps {
  side: 'left' | 'right'
}

// Detail page is the conversion/download surface — keep it ad-light.
// Locale set is derived from the routing config so adding a locale can't
// silently leave its /software/[slug] page un-protected.
const AD_FREE_DETAIL = new RegExp(`^/(${locales.join('|')})/software/[^/]+/?$`)

/**
 * A fixed 160x600 skyscraper in the left/right gutter beside the centered
 * 1280px content column. Visibility is gated four ways (all must pass):
 *  1. CSS: `.side-rail` is display:none until viewport >= 1700px and tall
 *     enough (globals.css) — zero CLS, hydration-safe, no horizontal scroll.
 *  2. Ads enabled + this position turned on in config.
 *  3. publisherId + a non-empty slot ID present (nothing paints pre-approval).
 *  4. Not on an ad-free software detail route when adFreeDownloadPages is set.
 */
export function SideRail({ side }: SideRailProps): React.JSX.Element | null {
  const { config, enabled } = useAds()
  const pathname = usePathname()
  const locale = useLocale()

  const position: AdPosition = side === 'left' ? 'railLeft' : 'railRight'
  const slot = config?.slots?.[position]
  const isAdFreeDetail = Boolean(config?.adFreeDownloadPages && AD_FREE_DETAIL.test(pathname))

  const shouldRender =
    enabled &&
    config !== undefined &&
    config.positions[position] &&
    Boolean(config.publisherId) &&
    Boolean(slot) &&
    !isAdFreeDetail

  if (!shouldRender || !config?.publisherId || !slot) return null

  return (
    <aside
      aria-hidden="true"
      data-ad-position={position}
      className="side-rail z-30"
      style={{
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '160px',
        height: '600px',
        left:
          side === 'left'
            ? 'calc(50% - 640px - 24px - 160px)'
            : 'calc(50% + 640px + 24px)',
      }}
    >
      <span className="side-rail__label">{locale === 'ko' ? '광고' : 'Advertisement'}</span>
      <AdSenseUnit format="vertical" publisherId={config.publisherId} slot={slot} />
    </aside>
  )
}
