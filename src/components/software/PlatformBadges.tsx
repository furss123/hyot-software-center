import { Monitor, Smartphone } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Platform } from '@/types'

const PLATFORM_META: Record<Platform, { label: string; Icon: typeof Monitor }> = {
  windows: { label: 'Windows', Icon: Monitor },
  android: { label: 'Android', Icon: Smartphone },
}

const PLATFORM_ORDER: Platform[] = ['windows', 'android']

interface PlatformBadgesProps {
  platforms: Platform[]
  /** 'icon' = compact icon-only (cards); 'full' = icon + label (detail) */
  variant?: 'icon' | 'full'
  className?: string
}

/** Consistent Windows/Android platform indicators used across the site. */
export function PlatformBadges({
  platforms,
  variant = 'icon',
  className,
}: PlatformBadgesProps): React.JSX.Element {
  const ordered = PLATFORM_ORDER.filter((p) => platforms.includes(p))

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {ordered.map((p) => {
        const { label, Icon } = PLATFORM_META[p]
        if (variant === 'full') {
          return (
            <span
              key={p}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-fill-subtle px-2 py-[3px] text-[11px] font-semibold text-text-secondary"
            >
              <Icon size={13} aria-hidden />
              {label}
            </span>
          )
        }
        return (
          <span
            key={p}
            title={label}
            aria-label={label}
            className="inline-flex items-center text-text-tertiary"
          >
            <Icon size={14} aria-hidden />
          </span>
        )
      })}
    </span>
  )
}
