import { execSync } from 'child_process'
import path from 'path'
import { NextResponse } from 'next/server'

export async function POST(): Promise<NextResponse> {
  try {
    execSync('npm run build:search-index', {
      cwd: path.resolve(process.cwd(), '..'),
      stdio: 'pipe',
      encoding: 'utf-8',
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 })
  }
}
