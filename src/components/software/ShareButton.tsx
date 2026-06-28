'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

export function ShareButton(): React.JSX.Element {
  const t = useTranslations('share')
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  function handleOpen(): void {
    setUrl(window.location.href)
    setOpen(true)
  }

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        aria-label={t('ariaLabel')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm min-h-[44px]',
          'text-text-secondary hover:text-text-primary',
          'hover:bg-fill-subtle transition-all duration-[var(--duration-base)]',
          'focus-visible:outline-2 focus-visible:outline-accent',
        )}
      >
        <Share2 size={14} aria-hidden />
        {t('label')}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-md min-h-[44px]">
      <p
        className={cn(
          'flex-1 min-w-0 px-3 py-2 rounded-[var(--radius-md)] text-xs font-mono',
          'bg-fill-subtle border border-border-pixel text-text-secondary truncate',
        )}
        title={url}
      >
        {url}
      </p>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className={cn(
          'shrink-0 px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium min-h-[36px]',
          'bg-[var(--hyot-blue)] text-white border border-[var(--hyot-blue-dark)]',
          'hover:bg-[var(--hyot-blue-dark)] transition-colors duration-[var(--duration-base)]',
          'focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)] focus-visible:outline-offset-2',
        )}
      >
        {copied ? t('copied') : t('copy')}
      </button>
    </div>
  )
}
