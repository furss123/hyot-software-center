'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const

export function ThemeToggle(): React.JSX.Element | null {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const current = themes.find((t) => t.value === theme) ?? themes[2]
  const Icon = current.icon

  return (
    <div className="relative group">
      <button
        type="button"
        aria-label={`Theme: ${current.label}`}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg',
          'text-text-secondary hover:text-text-primary',
          'hover:bg-fill-subtle',
          'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
          'focus-visible:outline-2 focus-visible:outline-accent',
        )}
      >
        <Icon size={18} />
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
        {themes.map(({ value, icon: ItemIcon, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 text-sm',
              'hover:bg-fill-subtle transition-colors duration-[var(--duration-fast)]',
              theme === value ? 'text-accent font-medium' : 'text-text-secondary',
            )}
          >
            <ItemIcon size={15} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
