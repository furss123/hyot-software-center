'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { SiteConfig } from '@/types'
import { cn } from '@/lib/utils'

interface FooterProps {
  config: SiteConfig
  locale: string
}

export function Footer({ config, locale }: FooterProps): React.JSX.Element {
  const l = locale as 'ko' | 'en'
  const t = useTranslations('footer')
  const footer = config.footer

  return (
    <footer className="border-t border-border bg-bg-surface-2 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {footer?.links && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12">
            {footer.links.map((group, i) => (
              <div key={i}>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                  {group.group[l]}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item, j) => (
                    <li key={j}>
                      <Link
                        href={item.external ? item.href : `/${locale}${item.href}`}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className={cn(
                          'text-sm text-text-secondary hover:text-text-primary',
                          'transition-colors duration-[var(--duration-fast)]',
                        )}
                      >
                        {item.label[l]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">H</span>
            </div>
            <span className="text-xs text-text-tertiary">
              {footer?.copyright?.[l] ?? `© ${new Date().getFullYear()} HyoT`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {config.brand.github && (
              <a
                href={config.brand.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('github')}
                className={cn(
                  'flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg',
                  'text-text-tertiary hover:text-text-primary hover:bg-fill-subtle',
                  'transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                )}
              >
                <Github size={18} />
              </a>
            )}
            {config.brand.twitter && (
              <a
                href={config.brand.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('twitter')}
                className={cn(
                  'flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg',
                  'text-text-tertiary hover:text-text-primary hover:bg-fill-subtle',
                  'transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
