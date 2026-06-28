'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

export function LanguageToggle(): React.JSX.Element {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('lang')

  function switchLocale(next: string): void {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-fill-subtle h-12">
      {(['ko', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchLocale(l)}
          aria-label={l === 'ko' ? t('switchKo') : t('switchEn')}
          className={cn(
            'flex items-center justify-center w-12 h-10 rounded-md text-base font-medium transition-all duration-[var(--duration-base)]',
            'focus-visible:outline-2 focus-visible:outline-accent',
            locale === l
              ? 'bg-bg-surface text-text-primary shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary',
          )}
        >
          {l === 'ko' ? t('ko') : t('en')}
        </button>
      ))}
    </div>
  )
}
