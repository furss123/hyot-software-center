'use client'

import { useState, type ReactNode } from 'react'

import { SearchModal } from '@/components/search/SearchModal'
import { SearchModalProvider } from '@/components/search/search-context'

type SearchModalHostProps = {
  locale: string
  children: ReactNode
}

export function SearchModalHost({
  locale,
  children,
}: SearchModalHostProps): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <SearchModalProvider open={() => setOpen(true)}>
      {children}
      <SearchModal locale={locale} open={open} onOpenChange={setOpen} />
    </SearchModalProvider>
  )
}
