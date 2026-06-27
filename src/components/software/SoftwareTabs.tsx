'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'

type Tab = { id: string; label: string; href?: string }

type SoftwareTabsProps = {
  tabs: Tab[]
  locale: string
  slug: string
}

export function SoftwareTabs({ tabs, locale, slug }: SoftwareTabsProps): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'overview'

  function setTab(id: string): void {
    const params = new URLSearchParams(searchParams.toString())
    if (id === 'overview') params.delete('tab')
    else params.set('tab', id)
    const qs = params.toString()
    router.replace(`/${locale}/software/${slug}${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const tabClass = (isActive: boolean): string =>
    cn(
      'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative',
      isActive ? 'text-accent' : 'text-text-tertiary hover:text-text-secondary',
    )

  return (
    <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
      {tabs.map((tab) => {
        if (tab.href) {
          return (
            <Link key={tab.id} href={tab.href} className={tabClass(false)}>
              {tab.label}
            </Link>
          )
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={tabClass(activeTab === tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}

type SoftwareTabPanelProps = {
  tabId: string
  children: React.ReactNode
}

export function SoftwareTabPanel({ tabId, children }: SoftwareTabPanelProps): React.JSX.Element {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'overview'

  return (
    <div data-tab={tabId} className={activeTab === tabId ? 'block' : 'hidden'}>
      {children}
    </div>
  )
}
