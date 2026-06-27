import { NextResponse } from 'next/server'

import { gitCommitAndPush } from '@/lib/git'
import { readFeatureFlags, writeFeatureFlags } from '@/lib/data'
import type { FeatureFlags } from '@/types'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(readFeatureFlags())
}

export async function PUT(request: Request): Promise<NextResponse> {
  const flags = (await request.json()) as FeatureFlags
  writeFeatureFlags(flags)
  gitCommitAndPush('chore(features): update flags', ['data/config/features.json'])
  return NextResponse.json(flags)
}
