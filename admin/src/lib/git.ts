import { execSync } from 'child_process'
import path from 'path'

const REPO_DIR = path.resolve(process.cwd(), '..')

export function gitCommitAndPush(message: string, files: string[]): void {
  if (files.length === 0) return
  const filesStr = files.map((f) => `"${f}"`).join(' ')
  execSync(`git -C "${REPO_DIR}" add ${filesStr}`, { stdio: 'inherit' })
  try {
    execSync(`git -C "${REPO_DIR}" commit -m "${message.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit',
    })
    execSync(`git -C "${REPO_DIR}" push`, { stdio: 'inherit' })
  } catch {
    // no changes or push skipped
  }
}

export function gitAdd(files: string[]): void {
  const filesStr = files.map((f) => `"${f}"`).join(' ')
  execSync(`git -C "${REPO_DIR}" add ${filesStr}`, { stdio: 'inherit' })
}

export function gitStatus(): string {
  return execSync(`git -C "${REPO_DIR}" status --short`, { encoding: 'utf-8' })
}
