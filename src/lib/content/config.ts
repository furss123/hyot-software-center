import fs from 'fs'
import path from 'path'
import type { SiteConfig, FeatureFlags } from '@/types'

export function getSiteConfig(): SiteConfig {
  const filePath = path.join(process.cwd(), 'data', 'config', 'site.config.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as SiteConfig
}

export function getFeatureFlags(): FeatureFlags {
  const filePath = path.join(process.cwd(), 'data', 'config', 'features.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as FeatureFlags
}
