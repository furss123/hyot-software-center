import { NextResponse } from 'next/server'

import { gitCommitAndPush } from '@/lib/git'
import { readSiteConfig, writeSiteConfig } from '@/lib/data'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(readSiteConfig())
}

export async function PUT(request: Request): Promise<NextResponse> {
  const partial = (await request.json()) as Record<string, unknown>
  const existing = readSiteConfig()

  const merged = deepMerge(existing, partial)
  writeSiteConfig(merged)
  gitCommitAndPush('chore(config): update site config', ['data/config/site.config.json'])

  return NextResponse.json(merged)
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    const srcVal = source[key]
    const tgtVal = target[key]
    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal as Record<string, unknown>, srcVal as Record<string, unknown>)
    } else {
      result[key] = srcVal
    }
  }
  return result
}
