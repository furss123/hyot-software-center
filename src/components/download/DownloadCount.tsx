'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface DownloadCountProps {
  slug: string
  initialCount: number
}

export function DownloadCount({ slug, initialCount }: DownloadCountProps): React.JSX.Element {
  const t = useTranslations('software')
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    const owner = 'hyot'
    fetch(`https://api.github.com/repos/${owner}/${slug}/releases`)
      .then((r) => r.json())
      .then((releases: Array<{ assets: Array<{ download_count: number }> }>) => {
        if (!Array.isArray(releases)) return
        const total = releases.reduce(
          (sum, r) => sum + r.assets.reduce((s, a) => s + (a.download_count ?? 0), 0),
          0,
        )
        if (total > 0) setCount(total)
      })
      .catch(() => {
        /* use initialCount */
      })
  }, [slug])

  return (
    <div
      className="flex items-center gap-1 text-[11px] text-text-tertiary"
      style={{ fontFamily: 'var(--font-mono)' }}
      aria-label={t('downloadCountLabel', { count })}
    >
      <Download size={12} aria-hidden />
      <span>{count.toLocaleString()}</span>
    </div>
  )
}
