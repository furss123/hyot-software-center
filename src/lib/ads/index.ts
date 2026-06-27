import type { ReactNode } from 'react'

export interface AdProvider {
  type: string
  render(props: { position: string; className?: string }): ReactNode
}

const registry = new Map<string, AdProvider>()

export function registerAdProvider(provider: AdProvider): void {
  registry.set(provider.type, provider)
}

export function getAdProvider(type: string): AdProvider | undefined {
  return registry.get(type)
}
