'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { useSearchModal } from '@/components/search/search-context'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { LanguageToggle } from '@/components/theme/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { cn, getAssetUrl } from '@/lib/utils'
import type { SiteConfig } from '@/types'

interface HeaderProps {
  config: SiteConfig
  locale: string
}

export function Header({ config, locale }: HeaderProps): React.JSX.Element {
  const t = useTranslations('search')
  const { open } = useSearchModal()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = (): void => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full h-16 md:h-32 mica',
        'border-b border-border-pixel',
        'transition-shadow duration-[var(--duration-base)]',
        scrolled ? 'shadow-[var(--shadow-sm)]' : '',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-full flex items-center gap-3 md:gap-10">
        <Link
          href={`/${locale}`}
          className="flex items-center shrink-0 text-text-primary hover:opacity-80 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export; logo from /public */}
          <img
            src={getAssetUrl('/assets/logo.png')}
            className="logo-img"
            alt="HyoT"
          />
        </Link>

        <div
          className="hidden md:block"
          style={{
            width: '1px',
            height: '28px',
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(74,159,224,0.4) 0px, rgba(74,159,224,0.4) 3px, transparent 3px, transparent 8px)',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />

        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 min-w-0"
          aria-label="Main"
        >
          {config.nav?.map((item) => {
            const href = item.external ? item.href : `/${locale}${item.href}`
            const isActive =
              !item.external &&
              (pathname === href || pathname.startsWith(`${href}/`))
            return (
              <Link
                key={item.href}
                href={href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'relative shrink-0 whitespace-nowrap px-3 lg:px-6 py-3 text-base lg:text-lg font-medium rounded-md flex items-center',
                  'transition-all duration-[var(--duration-fast)] ease-[var(--ease-fluent)]',
                  'focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)]',
                  isActive
                    ? cn(
                        'text-[var(--hyot-blue)]',
                        'after:absolute after:bottom-0 after:left-3 after:right-3 lg:after:left-6 lg:after:right-6',
                        'after:h-0.5 after:bg-[var(--hyot-blue)] after:rounded-[1px]',
                      )
                    : 'text-text-secondary hover:text-text-primary hover:bg-fill-subtle',
                )}
              >
                {item.label[locale as 'ko' | 'en'] ?? item.label.en}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto md:ml-0">
          <button
            type="button"
            onClick={open}
            aria-label={t('shortcut')}
            className={cn(
              'flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-lg',
              'text-text-secondary hover:text-text-primary hover:bg-fill-subtle',
              'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
              'focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)]',
            )}
          >
            <Search size={22} />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <MobileMenu config={config} locale={locale} />
        </div>
      </div>
    </header>
  )
}
