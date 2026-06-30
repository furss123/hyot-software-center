'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdFormat = 'auto' | 'vertical'

interface AdSenseUnitProps {
  publisherId: string
  slot: string
  /** 'auto' = responsive display unit; 'vertical' = fixed 160x600 skyscraper */
  format?: AdFormat
}

/**
 * Renders a single AdSense display unit and pushes it for fill.
 * The loader script is injected globally in the root layout.
 */
export function AdSenseUnit({
  publisherId,
  slot,
  format = 'auto',
}: AdSenseUnitProps): React.JSX.Element {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle ?? []).push({})
    } catch {
      // AdSense not loaded yet or blocked — ignore
    }
  }, [])

  if (format === 'vertical') {
    // Fixed 160x600 skyscraper. No data-ad-format/full-width-responsive so the
    // unit cannot reflow to a non-skyscraper size and overflow the gutter box.
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '160px', height: '600px' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
      />
    )
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', height: '100%' }}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
