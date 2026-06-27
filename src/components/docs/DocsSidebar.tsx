import Link from 'next/link'

import { getAllDocs } from '@/lib/content/docs'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'

type DocsSidebarProps = {
  locale: string
  activeSlug?: string
}

export function DocsSidebar({ locale, activeSlug }: DocsSidebarProps): React.JSX.Element {
  const l = locale as Locale
  const docs = getAllDocs()

  return (
    <nav className="space-y-1">
      {docs.map((doc) => {
        const isActive = doc.slug === activeSlug
        return (
          <Link
            key={doc.slug}
            href={`/${locale}/docs/${doc.slug}`}
            className={cn(
              'block px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-fill-subtle text-text-primary font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-fill-subtle',
            )}
          >
            {doc.title[l]}
          </Link>
        )
      })}
    </nav>
  )
}
