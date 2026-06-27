'use client'

import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type SearchDoc = {
  id: string
  type: 'software' | 'news'
  slug: string
  name_ko: string
  name_en: string
  description_ko: string
  description_en: string
  tags: string[]
}

type SearchModalProps = {
  locale: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? ''
}

function getResultUrl(locale: string, item: SearchDoc): string {
  if (item.type === 'news') return `/${locale}/news/${item.slug}`
  return `/${locale}/software/${item.slug}`
}

export function SearchModal({
  locale,
  open,
  onOpenChange,
}: SearchModalProps): React.JSX.Element | null {
  const t = useTranslations('search')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null)
  const [results, setResults] = useState<SearchDoc[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const loadIndex = useCallback(async (): Promise<void> => {
    if (fuse) return
    setLoading(true)
    try {
      const res = await fetch(`${getBasePath()}/search/index.json`)
      if (!res.ok) return
      const docs = (await res.json()) as SearchDoc[]
      const instance = new Fuse(docs, {
        keys: ['name_ko', 'name_en', 'description_ko', 'description_en', 'tags'],
        threshold: 0.4,
      })
      setFuse(instance)
    } finally {
      setLoading(false)
    }
  }, [fuse])

  useEffect(() => {
    if (!open) return
    void loadIndex()
    setQuery('')
    setResults([])
    setActiveIndex(0)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open, loadIndex])

  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([])
      setActiveIndex(0)
      return
    }
    setResults(fuse.search(query).map((r) => r.item))
    setActiveIndex(0)
  }, [query, fuse])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
      if (!open) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange(false)
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault()
        router.push(getResultUrl(locale, results[activeIndex]))
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange, results, activeIndex, locale, router])

  if (!open) return null

  const l = locale as 'ko' | 'en'

  function navigateTo(item: SearchDoc): void {
    router.push(getResultUrl(locale, item))
    onOpenChange(false)
  }

  const softwareResults = results.filter((r) => r.type === 'software')
  const newsResults = results.filter((r) => r.type === 'news')

  function renderGroup(
    items: SearchDoc[],
    categoryKey: 'software' | 'news',
    indexOffset: number,
  ): React.JSX.Element | null {
    if (items.length === 0) return null
    return (
      <div key={categoryKey}>
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide px-3 py-2">
          {t(`categories.${categoryKey}`)}
        </p>
        {items.map((item, groupIndex) => {
          const index = indexOffset + groupIndex
          return (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => navigateTo(item)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg transition-colors',
                index === activeIndex ? 'bg-fill-subtle' : 'hover:bg-fill-subtle',
              )}
            >
              <p className="text-sm font-medium text-text-primary">
                {l === 'ko' ? item.name_ko : item.name_en}
              </p>
              <p className="text-xs text-text-tertiary line-clamp-1 mt-0.5">
                {l === 'ko' ? item.description_ko : item.description_en}
              </p>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('shortcut')}
    >
      <button
        type="button"
        className="absolute inset-0 bg-bg-base/60 backdrop-blur-md"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />
      <Card variant="glass" className="relative w-full max-w-lg p-0 overflow-hidden shadow-xl">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search size={18} className="text-text-tertiary flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 h-12 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none text-sm"
          />
          <kbd className="hidden sm:inline text-xs text-text-tertiary bg-fill-subtle px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg bg-fill-subtle animate-pulse"
                  aria-hidden
                />
              ))}
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <p className="text-sm text-text-tertiary text-center py-8">{t('noResults')}</p>
          )}

          {!loading && results.length > 0 && (
            <div role="listbox">
              {renderGroup(softwareResults, 'software', 0)}
              {renderGroup(newsResults, 'news', softwareResults.length)}
            </div>
          )}

          {!loading && !query.trim() && (
            <p className="text-sm text-text-tertiary text-center py-8">{t('placeholder')}</p>
          )}
        </div>
      </Card>
    </div>
  )
}
