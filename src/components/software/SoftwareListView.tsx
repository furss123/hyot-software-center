'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { FilterBar } from '@/components/software/FilterBar'
import { SoftwareCard } from '@/components/software/SoftwareCard'
import type { Locale } from '@/i18n/config'
import type { SoftwareMeta } from '@/types'

type SoftwareWithCount = SoftwareMeta & { downloadCount: number }

type SoftwareListViewProps = {
  software: SoftwareWithCount[]
  categories: string[]
  locale: string
}

function filterAndSort(
  software: SoftwareWithCount[],
  category: string | undefined,
  sort: string,
  locale: Locale,
): SoftwareWithCount[] {
  let result = category ? software.filter((app) => app.category === category) : [...software]

  if (sort === 'name') {
    result = result.sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale))
  } else if (sort === 'featured') {
    result = result.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return b.updatedAt.localeCompare(a.updatedAt)
    })
  } else {
    result = result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  return result
}

export function SoftwareListView({
  software,
  categories,
  locale,
}: SoftwareListViewProps): React.JSX.Element {
  const searchParams = useSearchParams()
  const t = useTranslations('software')
  const l = locale as Locale

  const category = searchParams.get('category') ?? ''
  const sort = searchParams.get('sort') ?? 'updated'

  const filtered = useMemo(
    () => filterAndSort(software, category || undefined, sort, l),
    [software, category, sort, l],
  )

  return (
    <>
      <p className="text-sm text-text-tertiary mb-6">{t('resultCount', { count: filtered.length })}</p>
      <FilterBar
        categories={categories}
        activeCategory={category}
        activeSort={sort}
        locale={locale}
      />
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-text-tertiary">
          <p className="text-lg">{t('noSoftware')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((app) => (
            <SoftwareCard
              key={app.slug}
              app={app}
              locale={locale}
              initialDownloadCount={app.downloadCount}
            />
          ))}
        </div>
      )}
    </>
  )
}
