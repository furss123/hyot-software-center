export interface DownloadStat {
  slug: string
  assetType: string
  filename: string
  count: number
}

export interface AnalyticsAdapter {
  getDownloadStats(slug: string): Promise<DownloadStat[]>
  getTotalDownloads(slug: string): Promise<number>
}
