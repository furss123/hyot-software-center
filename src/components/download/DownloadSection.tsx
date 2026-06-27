'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Download, Copy, Check, Shield } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import type { ReleasesData } from '@/types'
import { cn } from '@/lib/utils'

interface DownloadSectionProps {
  releasesData: ReleasesData
  locale: string
}

type DownloadChannel = 'stable' | 'beta'

export function DownloadSection({ releasesData }: DownloadSectionProps): React.JSX.Element {
  const t = useTranslations('software')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const channels: DownloadChannel[] = ['stable']
  if (releasesData.latest.beta) channels.push('beta')

  const defaultChannel: DownloadChannel =
    releasesData.latest.stable !== null
      ? 'stable'
      : releasesData.latest.beta !== null
        ? 'beta'
        : 'stable'

  const [activeChannel, setActiveChannel] = useState<DownloadChannel>(defaultChannel)

  const latestVersion = releasesData.latest[activeChannel]
  const activeRelease = latestVersion
    ? releasesData.releases.find((r) => r.version === latestVersion)
    : null

  const visibleChannels = channels.filter((ch) => releasesData.latest[ch] !== null)

  function hasValidSha256(sha256: string): boolean {
    return sha256.length === 64 && !/^0+$/.test(sha256)
  }

  async function copyToClipboard(text: string): Promise<void> {
    await navigator.clipboard.writeText(text)
    setCopiedHash(text)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-text-primary mb-4">{t('download')}</h2>

      {visibleChannels.length > 1 && (
        <div className="flex gap-1 p-1 bg-fill-subtle rounded-lg mb-5 w-fit">
          {visibleChannels.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setActiveChannel(ch)}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-[var(--duration-base)]',
                activeChannel === ch
                  ? 'bg-bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {ch === 'stable' ? t('stable') : t('beta')}
            </button>
          ))}
        </div>
      )}

      {activeRelease ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-accent font-semibold">v{activeRelease.version}</span>
            <Badge variant={activeRelease.channel}>{activeRelease.channel}</Badge>
            <span className="text-sm text-text-tertiary">{activeRelease.releaseDate}</span>
          </div>

          <div className="space-y-3">
            {activeRelease.assets
              .filter((a) => a.type !== 'checksum')
              .map((asset) => (
                <div
                  key={asset.filename}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-fill-subtle border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5 mb-1">
                      <span className="font-medium text-text-primary text-sm truncate">
                        {asset.filename}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {asset.type === 'installer' ? t('installer') : t('portable')}
                        {asset.size !== undefined && ` · ${formatBytes(asset.size)}`}
                      </span>
                    </div>
                    {hasValidSha256(asset.sha256) && (
                      <div className="flex items-center gap-2">
                        <Shield size={12} className="text-text-tertiary flex-shrink-0" />
                        <code className="text-xs text-text-tertiary font-mono truncate">
                          {asset.sha256.slice(0, 16)}...
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(asset.sha256)}
                          className="flex items-center gap-1 text-xs text-accent hover:opacity-80 transition-opacity flex-shrink-0"
                          aria-label={t('copySha256')}
                        >
                          {copiedHash === asset.sha256 ? (
                            <>
                              <Check size={12} /> {t('copied')}
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> {t('copySha256')}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <a href={asset.url} download className="flex-shrink-0">
                    <Button size="sm" icon={<Download size={14} />}>
                      {t('download')}
                    </Button>
                  </a>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <p className="text-text-tertiary text-sm">No releases available for this channel.</p>
      )}
    </Card>
  )
}
