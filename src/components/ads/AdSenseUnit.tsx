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
    // Vertical skyscraper sized by its container width (120px or 160px,
    // set in globals.css per breakpoint). data-ad-format="vertical" keeps the
    // served creative a skyscraper; the container has overflow:hidden so it can
    // never spill into the content column.
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '600px' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="vertical"
        data-full-width-responsive="false"
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
