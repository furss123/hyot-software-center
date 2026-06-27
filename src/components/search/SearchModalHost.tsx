'use client'

import { useRef, useState, type ReactNode } from 'react'

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
  const triggerRef = useRef<HTMLElement | null>(null)

  function handleOpen(): void {
    triggerRef.current = document.activeElement as HTMLElement
    setOpen(true)
  }

  return (
    <SearchModalProvider open={handleOpen}>
      {children}
      <SearchModal
        locale={locale}
        open={open}
        onOpenChange={setOpen}
        restoreFocusRef={triggerRef}
      />
    </SearchModalProvider>
  )
}
