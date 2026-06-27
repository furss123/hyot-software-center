'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

export function BackToTop(): React.JSX.Element {
  const t = useTranslations('a11y')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (): void => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label={t('backToTop')}
      className={cn(
        'BackToTop fixed bottom-6 right-6 z-40',
        'w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl',
        'bg-bg-surface border border-border shadow-lg',
        'flex items-center justify-center',
        'text-text-secondary hover:text-text-primary',
        'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
        'focus-visible:outline-2 focus-visible:outline-accent',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      )}
    >
      <ArrowUp size={16} />
    </button>
  )
}
