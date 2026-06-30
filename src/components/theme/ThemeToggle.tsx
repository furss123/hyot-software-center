'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // Close on outside click or Escape (works on touch, unlike hover).
  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!mounted) return null

  const current = themes.find((th) => th.value === theme) ?? themes[2]!
  const Icon = current.icon

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('toggle', { mode: t(current.labelKey) })}
        aria-haspopup="menu"
        aria-expanded={open}
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
        role="menu"
        className={cn(
          'absolute right-0 top-full mt-1 py-1 min-w-[140px]',
          'bg-bg-surface border border-border rounded-xl shadow-[var(--shadow-lg)]',
          'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)] z-50',
          open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
        )}
      >
        {themes.map(({ value, icon: ItemIcon, labelKey }) => (
          <button
            key={value}
            type="button"
            role="menuitem"
            onClick={() => {
              setTheme(value)
              setOpen(false)
            }}
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
