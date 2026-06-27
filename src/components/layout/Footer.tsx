import Link from 'next/link'
import type { SiteConfig } from '@/types'
import { cn } from '@/lib/utils'

interface FooterProps {
  config: SiteConfig
  locale: string
}

export function Footer({ config, locale }: FooterProps): React.JSX.Element {
  const l = locale as 'ko' | 'en'
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

        <div className="pt-8 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">H</span>
            </div>
            <span className="text-xs text-text-tertiary">
              {footer?.copyright?.[l] ?? `© ${new Date().getFullYear()} HyoT`}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
