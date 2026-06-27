import { NextResponse } from 'next/server'

import { gitCommitAndPush } from '@/lib/git'
import { readFaqItems, writeFaqItems, type FaqItemAdmin } from '@/lib/content'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(readFaqItems())
}

export async function PUT(request: Request): Promise<NextResponse> {
  const items = (await request.json()) as FaqItemAdmin[]
  const filepath = writeFaqItems(items)
  gitCommitAndPush('feat(faq): update items', [filepath])
  return NextResponse.json(items)
}
