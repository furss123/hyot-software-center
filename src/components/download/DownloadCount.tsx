'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface DownloadCountProps {
  /** GitHub 저장소 "owner/repo". 없으면 라이브 조회를 생략하고 initialCount 사용 */
  repo?: string
  initialCount: number
}

export function DownloadCount({ repo, initialCount }: DownloadCountProps): React.JSX.Element {
  const t = useTranslations('software')
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    if (!repo) return
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${repo}/releases`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((releases: Array<{ assets?: Array<{ download_count?: number }> }> | null) => {
        if (!Array.isArray(releases)) return
        const total = releases.reduce(
          (sum, r) => sum + (r.assets ?? []).reduce((s, a) => s + (a.download_count ?? 0), 0),
          0,
        )
        setCount(total)
      })
      .catch(() => {
        /* 네트워크/요청한도 초과 시 initialCount 유지 */
      })
    return () => controller.abort()
  }, [repo])

  return (
    <div
      className="flex items-center gap-1 text-xs text-text-tertiary font-mono"
      aria-label={t('downloadCountLabel', { count })}
    >
      <Download size={12} aria-hidden />
      <span>{count.toLocaleString()}</span>
    </div>
  )
}
