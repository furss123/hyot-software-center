'use client'

import { createContext, useContext, type ReactNode } from 'react'

type SearchModalContextValue = {
  open: () => void
}

const SearchModalContext = createContext<SearchModalContextValue>({
  open: () => undefined,
})

export function useSearchModal(): SearchModalContextValue {
  return useContext(SearchModalContext)
}

type SearchModalProviderProps = {
  children: ReactNode
  open: () => void
}

export function SearchModalProvider({
  children,
  open,
}: SearchModalProviderProps): React.JSX.Element {
  return (
    <SearchModalContext.Provider value={{ open }}>{children}</SearchModalContext.Provider>
  )
}
