'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Check, ChevronDown, Copy, Download, Shield } from 'lucide-react'
import {
  getAdvancedAssets,
  getMostRecentRelease,
  hasValidSha256,
  pickPrimaryAsset,
  type AdvancedSlot,
} from '@/lib/download/assets'
import { cn, formatBytes, formatDate } from '@/lib/utils'
import type { ReleaseAsset, ReleasesData } from '@/types'

interface DownloadSectionProps {
  releasesData: ReleasesData
  locale: string
}

const ADVANCED_LABEL_KEYS: Record<AdvancedSlot, 'advancedPortableX64' | 'advancedInstallerX64Msi' | 'advancedPortableArm64' | 'advancedInstallerArm64Msi'> = {
  portableX64: 'advancedPortableX64',
  installerX64Msi: 'advancedInstallerX64Msi',
  portableArm64: 'advancedPortableArm64',
  installerArm64Msi: 'advancedInstallerArm64Msi',
}

function AssetChecksumRow({
  asset,
  copiedHash,
  onCopy,
  copyLabel,
  copiedLabel,
}: {
  asset: ReleaseAsset
  copiedHash: string | null
  onCopy: (text: string) => void
  copyLabel: string
  copiedLabel: string
}): React.JSX.Element | null {
  if (!hasValidSha256(asset.sha256)) return null

  return (
    <div className="flex items-center gap-2 mt-2">
      <Shield size={12} className="text-text-tertiary flex-shrink-0" />
      <code className="text-xs text-text-tertiary font-mono truncate">{asset.sha256}</code>
      <button
        type="button"
        onClick={() => onCopy(asset.sha256)}
        className="flex items-center gap-1 text-xs text-accent hover:opacity-80 transition-opacity flex-shrink-0"
        aria-label={copyLabel}
      >
        {copiedHash === asset.sha256 ? (
          <>
            <Check size={12} /> {copiedLabel}
          </>
        ) : (
          <>
            <Copy size={12} /> {copyLabel}
          </>
        )}
      </button>
    </div>
  )
}

export function DownloadSection({ releasesData, locale }: DownloadSectionProps): React.JSX.Element {
  const t = useTranslations('software')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const activeRelease = getMostRecentRelease(releasesData.releases)
  const primaryAsset = activeRelease ? pickPrimaryAsset(activeRelease.assets) : null
  const advancedAssets = activeRelease
    ? getAdvancedAssets(activeRelease.assets, primaryAsset)
    : []

  async function copyToClipboard(text: string): Promise<void> {
    await navigator.clipboard.writeText(text)
    setCopiedHash(text)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-text-primary mb-4">{t('download')}</h2>

      {activeRelease && primaryAsset ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="version-number">v{activeRelease.version}</span>
            <Badge variant={activeRelease.channel}>{activeRelease.channel}</Badge>
            <span className="text-sm text-text-tertiary">
              {formatDate(activeRelease.releaseDate, locale)}
            </span>
          </div>

          <a href={primaryAsset.url} download className="block w-full">
            <Button
              size="lg"
              icon={<Download size={20} />}
              className="w-full h-14 text-base font-bold shadow-[0_4px_20px_rgba(74,159,224,0.25)]"
            >
              {t('downloadWindows')}
            </Button>
          </a>

          <p className="text-xs text-text-tertiary text-center truncate">{primaryAsset.filename}</p>

          {advancedAssets.length > 0 && (
            <div className="border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setAdvancedOpen((open) => !open)}
                aria-expanded={advancedOpen}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3',
                  'bg-fill-subtle border border-border',
                  'text-sm font-medium text-text-primary',
                  'hover:bg-fill-secondary transition-colors duration-[var(--duration-base)]',
                  'focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)]',
                )}
              >
                <span>{t('advancedOptions')}</span>
                <ChevronDown
                  size={18}
                  className={cn(
                    'text-text-tertiary transition-transform duration-300 ease-[var(--ease-fluent)]',
                    advancedOpen && 'rotate-180',
                  )}
                />
              </button>

              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-[var(--ease-fluent)]',
                  advancedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 pt-3">
                    {advancedAssets.map(({ slot, asset }) => (
                      <div
                        key={`${slot}-${asset.filename}`}
                        className="rounded-xl border border-border bg-fill-subtle p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-text-primary mb-1">
                              {t(ADVANCED_LABEL_KEYS[slot])}
                            </p>
                            <p className="text-sm text-text-secondary truncate">{asset.filename}</p>
                            {asset.size !== undefined && asset.size > 0 && (
                              <p className="text-xs text-text-tertiary mt-1">
                                {formatBytes(asset.size)}
                              </p>
                            )}
                            <AssetChecksumRow
                              asset={asset}
                              copiedHash={copiedHash}
                              onCopy={copyToClipboard}
                              copyLabel={t('copySha256')}
                              copiedLabel={t('copied')}
                            />
                          </div>
                          <a href={asset.url} download className="flex-shrink-0">
                            <Button size="sm" variant="secondary" icon={<Download size={14} />}>
                              {t('download')}
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-text-tertiary text-sm">{t('noReleases')}</p>
      )}
    </Card>
  )
}
