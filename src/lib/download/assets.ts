import type { Release, ReleaseAsset } from '@/types'

export function getMostRecentRelease(releases: Release[]): Release | null {
  if (releases.length === 0) return null
  return [...releases].sort((a, b) => {
    const byDate = b.releaseDate.localeCompare(a.releaseDate)
    if (byDate !== 0) return byDate
    return b.version.localeCompare(a.version, undefined, { numeric: true })
  })[0] ?? null
}

export type AssetArch = 'x64' | 'arm64'
export type AdvancedSlot =
  | 'portableX64'
  | 'installerX64Msi'
  | 'portableArm64'
  | 'installerArm64Msi'

export function isDownloadableAsset(asset: ReleaseAsset): boolean {
  return asset.type !== 'checksum'
}

export function inferArch(asset: ReleaseAsset): AssetArch | null {
  const arch = (asset as ReleaseAsset & { arch?: string }).arch?.toLowerCase()
  if (arch === 'x64' || arch === 'amd64') return 'x64'
  if (arch === 'arm64' || arch === 'aarch64') return 'arm64'

  const name = asset.filename.toLowerCase()
  if (name.includes('arm64') || name.includes('aarch64')) return 'arm64'
  if (name.includes('x64') || name.includes('amd64') || name.includes('win64')) return 'x64'
  if (name.includes('setup') || name.endsWith('.msi')) return 'x64'
  if (asset.type === 'installer' && name.endsWith('.exe')) return 'x64'
  return null
}

function fileExt(filename: string): string {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? (parts.pop() ?? '') : ''
}

export function isSetupExe(asset: ReleaseAsset): boolean {
  const name = asset.filename.toLowerCase()
  return (
    isDownloadableAsset(asset) &&
    name.endsWith('.exe') &&
    name.includes('setup') &&
    asset.type === 'installer'
  )
}

export function pickPrimaryAsset(assets: ReleaseAsset[]): ReleaseAsset | null {
  const downloadable = assets.filter(isDownloadableAsset)
  if (downloadable.length === 0) return null

  const x64Setup = downloadable.find(
    (a) => isSetupExe(a) && (inferArch(a) === 'x64' || inferArch(a) === null),
  )
  if (x64Setup) return x64Setup

  const x64InstallerExe = downloadable.find((a) => {
    const name = a.filename.toLowerCase()
    return (
      a.type === 'installer' &&
      name.endsWith('.exe') &&
      !name.includes('portable') &&
      inferArch(a) !== 'arm64'
    )
  })
  if (x64InstallerExe) return x64InstallerExe

  const anyInstallerExe = downloadable.find((a) => {
    const name = a.filename.toLowerCase()
    return a.type === 'installer' && name.endsWith('.exe')
  })
  if (anyInstallerExe) return anyInstallerExe

  return downloadable.find((a) => a.filename.toLowerCase().endsWith('.exe')) ?? downloadable[0] ?? null
}

export function matchAdvancedSlot(asset: ReleaseAsset, slot: AdvancedSlot): boolean {
  if (!isDownloadableAsset(asset)) return false

  const arch = inferArch(asset)
  const ext = fileExt(asset.filename)

  switch (slot) {
    case 'portableX64':
      return arch === 'x64' && asset.type === 'portable' && (ext === 'exe' || ext === 'zip')
    case 'installerX64Msi':
      return arch === 'x64' && asset.type === 'installer' && ext === 'msi'
    case 'portableArm64':
      return arch === 'arm64' && asset.type === 'portable' && ext === 'exe'
    case 'installerArm64Msi':
      return arch === 'arm64' && asset.type === 'installer' && ext === 'msi'
    default:
      return false
  }
}

export function getAdvancedAssets(
  assets: ReleaseAsset[],
  primary: ReleaseAsset | null,
): Array<{ slot: AdvancedSlot; asset: ReleaseAsset }> {
  const slots: AdvancedSlot[] = [
    'portableX64',
    'installerX64Msi',
    'portableArm64',
    'installerArm64Msi',
  ]

  return slots.flatMap((slot) => {
    const asset = assets.find(
      (a) =>
        a !== primary &&
        a.filename !== primary?.filename &&
        matchAdvancedSlot(a, slot),
    )
    return asset ? [{ slot, asset }] : []
  })
}

export function hasValidSha256(sha256: string): boolean {
  return sha256.length === 64 && !/^0+$/.test(sha256)
}
