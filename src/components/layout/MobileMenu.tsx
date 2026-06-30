'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Moon, Monitor, Sun, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { SiteConfig } from '@/types'

interface MobileMenuProps {
  config: SiteConfig
  locale: string
}

const THEME_OPTIONS = [
  { value: 'light', icon: Sun, labelKey: 'light' as const },
  { value: 'dark', icon: Moon, labelKey: 'dark' as const },
  { value: 'system', icon: Monitor, labelKey: 'system' as const },
]

export function MobileMenu({ config, locale }: MobileMenuProps): React.JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const tNav = useTranslations('a11y')
  const tTheme = useTranslations('theme')
  const tLang = useTranslations('lang')
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => setOpen(false), [])

  // Close on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Escape to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  function switchLocale(next: string): void {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
    close()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tNav('openMenu')}
        aria-expanded={open}
        className={cn(
          'md:hidden flex items-center justify-center w-11 h-11 rounded-lg',
          'text-text-secondary hover:text-text-primary hover:bg-fill-subtle',
          'transition-colors focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)]',
        )}
      >
        <Menu size={22} />
      </button>

      {mounted && (
        <div
          className={cn('md:hidden fixed inset-0 z-[90]', !open && 'pointer-events-none')}
          aria-hidden={!open}
        >
          {/* Overlay */}
          <button
            type="button"
            tabIndex={-1}
            aria-label={tNav('closeMenu')}
            onClick={close}
            className={cn(
              'absolute inset-0 bg-bg-overlay backdrop-blur-sm transition-opacity duration-[var(--duration-base)]',
              open ? 'opacity-100' : 'opacity-0',
            )}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={tNav('openMenu')}
            className={cn(
              'absolute right-0 top-0 h-full w-[82%] max-w-xs',
              'bg-bg-surface border-l border-border shadow-[var(--shadow-lg)]',
              'flex flex-col transition-transform duration-[var(--duration-slow)] ease-[var(--ease-fluent)]',
              open ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            <div className="flex items-center justify-end h-16 px-4 border-b border-border">
              <button
                type="button"
                onClick={close}
                aria-label={tNav('closeMenu')}
                className={cn(
                  'flex items-center justify-center w-11 h-11 rounded-lg',
                  'text-text-secondary hover:text-text-primary hover:bg-fill-subtle',
                  'transition-colors focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)]',
                )}
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col p-3 gap-1" aria-label="Mobile">
              {config.nav?.map((item) => {
                const href = item.external ? item.href : `/${locale}${item.href}`
                const isActive =
                  !item.external && (pathname === href || pathname.startsWith(`${href}/`))
                return (
                  <Link
                    key={item.href}
                    href={href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    onClick={close}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                      'focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)]',
                      isActive
                        ? 'bg-fill-secondary text-[var(--hyot-blue)]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-fill-subtle',
                    )}
                  >
                    {item.label[locale as 'ko' | 'en'] ?? item.label.en}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto p-4 border-t border-border space-y-4">
              {/* Language */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary mb-2">
                  {tLang('label')}
                </p>
                <div className="flex gap-1 p-1 rounded-lg bg-fill-subtle">
                  {(['ko', 'en'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => switchLocale(l)}
                      className={cn(
                        'flex-1 h-10 rounded-md text-sm font-medium transition-colors',
                        locale === l
                          ? 'bg-bg-surface text-text-primary shadow-[var(--shadow-sm)]'
                          : 'text-text-tertiary hover:text-text-secondary',
                      )}
                    >
                      {tLang(l)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary mb-2">
                  {tTheme('label')}
                </p>
                <div className="flex gap-1 p-1 rounded-lg bg-fill-subtle">
                  {THEME_OPTIONS.map(({ value, icon: Icon, labelKey }) => {
                    const active = mounted && theme === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        aria-label={tTheme(labelKey)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 h-10 rounded-md text-sm font-medium transition-colors',
                          active
                            ? 'bg-bg-surface text-[var(--hyot-blue)] shadow-[var(--shadow-sm)]'
                            : 'text-text-tertiary hover:text-text-secondary',
                        )}
                      >
                        <Icon size={15} aria-hidden />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
