import type { AnalyticsAdapter, DownloadStat } from './index'
import { getReleasesData } from '@/lib/content/releases'

export class GitHubAnalyticsAdapter implements AnalyticsAdapter {
  async getDownloadStats(slug: string): Promise<DownloadStat[]> {
    const data = getReleasesData(slug)
    if (!data) return []
    const stats: DownloadStat[] = []
    for (const release of data.releases) {
      for (const asset of release.assets) {
        stats.push({
          slug,
          assetType: asset.type,
          filename: asset.filename,
          count: asset.downloadCount ?? 0,
        })
      }
    }
    return stats
  }

  async getTotalDownloads(slug: string): Promise<number> {
    const stats = await this.getDownloadStats(slug)
    return stats.reduce((sum, s) => sum + s.count, 0)
  }
}
