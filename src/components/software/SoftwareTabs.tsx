'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'

type SoftwareTabsProps = {
  locale: string
  slug: string
}

export function SoftwareTabs({ locale, slug }: SoftwareTabsProps): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'overview'
  const l = locale as 'ko' | 'en'

  const tabs = [
    { id: 'overview', label: l === 'ko' ? '개요' : 'Overview' },
    { id: 'changelog', label: l === 'ko' ? '변경 내역' : 'Changelog' },
    {
      id: 'feedback',
      label: l === 'ko' ? '버그 제보 & 건의' : 'Feedback',
      href: `/${locale}/software/${slug}/feedback`,
    },
  ]

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
          const isActive = pathname.includes(`/software/${slug}/feedback`)
          return (
            <Link key={tab.id} href={tab.href} className={cn(tabClass(isActive), 'relative')}>
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
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
