import { execSync, spawn } from 'child_process'
import path from 'path'

const REPO_DIR = path.resolve(process.cwd(), '..')

/**
 * 스테이징 + 커밋(동기, 로컬이라 빠름) 후, push는 백그라운드로 분리(detach)한다.
 * 이전에는 push를 동기 실행해 자격증명 프롬프트/네트워크 지연 시 요청이 멈추고
 * 화면이 "저장 중..."에 영구 고정됐다. 이제 커밋까지만 기다리고 즉시 반환한다.
 */
export function gitCommitAndPush(message: string, files: string[]): void {
  try {
    if (files.length === 0) {
      execSync(`git -C "${REPO_DIR}" add -A`, { stdio: 'inherit' })
    } else {
      const filesStr = files.map((f) => `"${f}"`).join(' ')
      execSync(`git -C "${REPO_DIR}" add ${filesStr}`, { stdio: 'inherit' })
    }
    execSync(`git -C "${REPO_DIR}" commit -m "${message.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit',
    })
  } catch {
    // 변경 없음 / 커밋할 것 없음 — 무시 (데이터는 이미 디스크에 기록됨)
  }
  backgroundPush()
}

/**
 * push를 분리된 자식 프로세스로 실행하고 즉시 unref 한다.
 * GIT_TERMINAL_PROMPT=0 으로 자격증명 프롬프트가 떠서 멈추는 것을 방지(실패 시 즉시 종료).
 * 실패해도 커밋은 로컬에 남아 다음 저장 때 함께 push 된다.
 */
function backgroundPush(): void {
  try {
    const child = spawn(`git -C "${REPO_DIR}" push`, {
      shell: true,
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    })
    child.unref()
  } catch {
    // best-effort
  }
}

export function gitAdd(files: string[]): void {
  const filesStr = files.map((f) => `"${f}"`).join(' ')
  execSync(`git -C "${REPO_DIR}" add ${filesStr}`, { stdio: 'inherit' })
}

export function gitStatus(): string {
  return execSync(`git -C "${REPO_DIR}" status --short`, { encoding: 'utf-8' })
}
