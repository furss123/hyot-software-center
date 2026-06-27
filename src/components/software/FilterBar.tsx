'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

type FilterBarProps = {
  categories: string[]
  activeCategory: string
  activeSort: string
  locale: string
}

export function FilterBar({
  categories,
  activeCategory,
  activeSort,
  locale,
}: FilterBarProps): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('software')

  function navigate(updates: { category?: string; sort?: string }): void {
    const params = new URLSearchParams(searchParams.toString())
    if (updates.category !== undefined) {
      if (updates.category) params.set('category', updates.category)
      else params.delete('category')
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

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => navigate({ category: '' })}
          className={cn(
            'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
            !activeCategory
              ? 'bg-accent text-white'
              : 'bg-fill-subtle text-text-secondary hover:text-text-primary',
          )}
        >
          {t('filterAll')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => navigate({ category: cat })}
            className={cn(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
              activeCategory === cat
                ? 'bg-accent text-white'
                : 'bg-fill-subtle text-text-secondary hover:text-text-primary',
            )}
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
          className="text-sm bg-fill-subtle border border-border rounded-lg px-3 py-1.5 text-text-primary outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="updated">{t('sortUpdated')}</option>
          <option value="name">{t('sortName')}</option>
          <option value="featured">{t('sortFeatured')}</option>
        </select>
      </div>
    </div>
  )
}
