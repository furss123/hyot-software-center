'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const themes = [
  { value: 'light', icon: Sun, labelKey: 'light' as const },
  { value: 'dark', icon: Moon, labelKey: 'dark' as const },
  { value: 'system', icon: Monitor, labelKey: 'system' as const },
]

export function ThemeToggle(): React.JSX.Element | null {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('theme')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const current = themes.find((th) => th.value === theme) ?? themes[2]!
  const Icon = current.icon

  return (
    <div className="relative group">
      <button
        type="button"
        aria-label={t('toggle', { mode: t(current.labelKey) })}
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-lg',
          'text-text-secondary hover:bg-fill-subtle',
          'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
          'focus-visible:outline-2 focus-visible:outline-accent',
        )}
        style={{ color: 'var(--text-secondary)' }}
      >
        <Icon size={22} style={{ color: 'var(--text-secondary)' }} />
      </button>
      <div
        className={cn(
          'absolute right-0 top-full mt-1 py-1 min-w-[120px]',
          'bg-bg-surface border border-border rounded-xl shadow-lg',
          'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
          'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
          'z-50',
        )}
      >
        {themes.map(({ value, icon: ItemIcon, labelKey }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 text-sm min-h-[44px]',
              'hover:bg-fill-subtle transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-2 focus-visible:outline-accent',
              theme === value ? 'text-accent font-medium' : 'text-text-secondary',
            )}
          >
            <ItemIcon size={15} aria-hidden />
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
