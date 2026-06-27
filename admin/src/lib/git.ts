import { execSync } from 'child_process'

import { REPO_ROOT } from '@/lib/data'

export function gitCommitAndPush(message: string, relativePaths: string[]): void {
  if (relativePaths.length === 0) return
  const quoted = relativePaths.map((p) => `"${p.replace(/"/g, '')}"`).join(' ')
  execSync(`git add ${quoted}`, { cwd: REPO_ROOT, stdio: 'inherit' })
  try {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    })
    execSync('git push', { cwd: REPO_ROOT, stdio: 'inherit' })
  } catch {
    // no changes or push skipped
  }
}
