'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useSearchModal } from '@/components/search/search-context'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { cn } from '@/lib/utils'
import type { SiteConfig } from '@/types'

interface HeaderProps {
  config: SiteConfig
  locale: string
}

export function Header({ config, locale }: HeaderProps): React.JSX.Element {
  const t = useTranslations('search')
  const { open } = useSearchModal()

  return (
    <header
      className={cn('sticky top-0 z-50 w-full', 'mica border-b border-border', 'h-14')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center gap-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 font-semibold text-text-primary hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="text-sm hidden sm:block">{config.brand.name}</span>
        </Link>

        <nav className="flex items-center gap-1 flex-1" aria-label="Main">
          {config.nav?.map((item) => (
            <Link
              key={item.href}
              href={item.external ? item.href : `/${locale}${item.href}`}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md',
                'text-text-secondary hover:text-text-primary',
                'hover:bg-fill-subtle',
                'transition-all duration-[var(--duration-fast)] ease-[var(--ease-fluent)]',
              )}
            >
              {item.label[locale as 'ko' | 'en'] ?? item.label.en}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={open}
            aria-label={t('shortcut')}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg',
              'text-text-secondary hover:text-text-primary hover:bg-fill-subtle',
              'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
              'focus-visible:outline-2 focus-visible:outline-accent',
            )}
          >
            <Search size={18} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
