'use client'

import { useEffect, useRef, useState } from 'react'

import { getAdProvider } from '@/lib/ads'
import { cn } from '@/lib/utils'
import type { AdPosition } from '@/types/monetization'

import { useAds } from './AdProvider'

interface AdSlotProps {
  position: AdPosition
  className?: string
}

const SLOT_HEIGHTS: Record<AdPosition, string> = {
  homeTop: 'h-[90px]',
  homeBottom: 'h-[250px]',
  softwareTop: 'h-[90px]',
  softwareBottom: 'h-[250px]',
  faq: 'h-[250px]',
  news: 'h-[250px]',
  about: 'h-[250px]',
}

const SOFTWARE_POSITIONS: AdPosition[] = ['softwareTop', 'softwareBottom']

function isSoftwarePosition(position: AdPosition): boolean {
  return SOFTWARE_POSITIONS.includes(position)
}

export function AdSlot({ position, className }: AdSlotProps): React.JSX.Element | null {
  const { config, enabled } = useAds()
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const shouldRender =
    enabled &&
    config !== undefined &&
    config.positions[position] &&
    !(config.adFreeDownloadPages && isSoftwarePosition(position))

  useEffect(() => {
    if (!shouldRender || !config) return

    if (!config.lazyLoadAds) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldRender, config])

  if (!shouldRender || !config) return null

  const provider = getAdProvider(config.provider)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-ad-position={position}
      className={cn(
        'w-full flex items-center justify-center',
        'bg-fill-subtle border border-border border-dashed rounded-xl',
        'transition-all duration-[var(--duration-base)]',
        SLOT_HEIGHTS[position],
        !visible && 'opacity-0',
        className,
      )}
    >
      {visible && provider?.render({ position, className })}
    </div>
  )
}
