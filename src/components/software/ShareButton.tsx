'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

export function ShareButton({ title }: { title: string }): React.JSX.Element {
  const t = useTranslations('share')
  const [copied, setCopied] = useState(false)

  async function handleShare(): Promise<void> {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      aria-label={t('ariaLabel')}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm min-h-[44px]',
        'text-text-secondary hover:text-text-primary',
        'hover:bg-fill-subtle transition-all duration-[var(--duration-base)]',
        'focus-visible:outline-2 focus-visible:outline-accent',
      )}
    >
      {copied ? (
        <Check size={14} className="text-status-success" aria-hidden />
      ) : (
        <Share2 size={14} aria-hidden />
      )}
      {copied ? t('copied') : t('label')}
    </button>
  )
}
