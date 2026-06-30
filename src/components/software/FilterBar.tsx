'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Monitor, Smartphone } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Platform } from '@/types'

type FilterBarProps = {
  categories: string[]
  platforms: Platform[]
  activeCategory: string
  activePlatform: string
  activeSort: string
  locale: string
}

const PLATFORM_ICON: Record<Platform, typeof Monitor> = {
  windows: Monitor,
  android: Smartphone,
}

const PLATFORM_ORDER: Platform[] = ['windows', 'android']

const pillClass = (active: boolean): string =>
  cn(
    'flex-shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-colors',
    active
      ? 'bg-accent text-white'
      : 'bg-fill-subtle text-text-secondary hover:text-text-primary',
  )

export function FilterBar({
  categories,
  platforms,
  activeCategory,
  activePlatform,
  activeSort,
  locale,
}: FilterBarProps): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('software')

  function navigate(updates: { category?: string; platform?: string; sort?: string }): void {
    const params = new URLSearchParams(searchParams.toString())
    if (updates.category !== undefined) {
      if (updates.category) params.set('category', updates.category)
      else params.delete('category')
    }
    if (updates.platform !== undefined) {
      if (updates.platform) params.set('platform', updates.platform)
      else params.delete('platform')
    }
    if (updates.sort !== undefined) {
      if (updates.sort && updates.sort !== 'updated') params.set('sort', updates.sort)
      else params.delete('sort')
    }
    const qs = params.toString()
    router.push(`/${locale}/software${qs ? `?${qs}` : ''}`)
  }

  function categoryLabel(cat: string): string {
    const key = `categories.${cat}` as 'categories.utility'
    return t(key)
  }

  const availablePlatforms = PLATFORM_ORDER.filter((p) => platforms.includes(p))

  return (
    <div className="space-y-4 mb-8">
      {availablePlatforms.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => navigate({ platform: '' })}
            className={pillClass(!activePlatform)}
          >
            {t('filterAllPlatforms')}
          </button>
          {availablePlatforms.map((p) => {
            const Icon = PLATFORM_ICON[p]
            return (
              <button
                key={p}
                type="button"
                onClick={() => navigate({ platform: p })}
                className={pillClass(activePlatform === p)}
              >
                <Icon size={14} aria-hidden />
                {t(`platforms.${p}` as 'platforms.windows')}
              </button>
            )
          })}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => navigate({ category: '' })}
          className={pillClass(!activeCategory)}
        >
          {t('filterAll')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => navigate({ category: cat })}
            className={cn(pillClass(activeCategory === cat), 'capitalize')}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="software-sort" className="text-sm text-text-tertiary">
          {t('sortLabel')}
        </label>
        <select
          id="software-sort"
          value={activeSort}
          onChange={(e) => navigate({ sort: e.target.value })}
          className="text-sm h-9 bg-fill-subtle border border-border rounded-lg px-4 text-text-primary outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="updated">{t('sortUpdated')}</option>
          <option value="name">{t('sortName')}</option>
          <option value="featured">{t('sortFeatured')}</option>
        </select>
      </div>
    </div>
  )
}
