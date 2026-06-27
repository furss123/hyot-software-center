import { execSync } from 'child_process'
import path from 'path'
import { NextResponse } from 'next/server'

import { t } from '@/lib/i18n'

export async function POST(): Promise<NextResponse> {
  try {
    const repoDir = path.resolve(process.cwd(), '..')
    execSync('npm run build:search-index', {
      cwd: repoDir,
      stdio: 'pipe',
      encoding: 'utf-8',
    })
    return NextResponse.json({ success: true, message: t.actions.rebuildSuccess })
  } catch {
    return NextResponse.json(
      { success: false, message: t.actions.rebuildFail },
      { status: 500 },
    )
  }
}
