import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type BadgeVariant =
  | 'stable'
  | 'beta'
  | 'legacy'
  | 'experimental'
  | 'deprecated'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  stable:
    'bg-[rgba(0,137,123,0.15)] text-[var(--hyot-teal-light)] border border-[rgba(0,137,123,0.25)]',
  beta: 'bg-[rgba(0,120,212,0.12)] text-[var(--hyot-blue-light)] border border-[rgba(0,120,212,0.2)]',
  legacy: 'bg-fill-secondary text-text-tertiary border border-border',
  experimental:
    'bg-[rgba(255,107,0,0.12)] text-[var(--hyot-orange-light)] border border-[rgba(255,107,0,0.2)]',
  deprecated:
    'bg-[rgba(255,107,107,0.12)] text-[#FF6B6B] border border-[rgba(255,107,107,0.2)]',
  success:
    'bg-[rgba(0,137,123,0.15)] text-[var(--hyot-teal-light)] border border-[rgba(0,137,123,0.25)]',
  warning:
    'bg-[rgba(255,107,0,0.12)] text-[var(--hyot-orange-light)] border border-[rgba(255,107,0,0.2)]',
  error: 'bg-[rgba(255,107,107,0.12)] text-[#FF6B6B] border border-[rgba(255,107,107,0.2)]',
  info: 'bg-[rgba(0,120,212,0.12)] text-[var(--hyot-blue-light)] border border-[rgba(0,120,212,0.2)]',
  default: 'bg-fill-subtle text-text-secondary border border-border',
}

export function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5',
        'rounded-[var(--radius-sm)]',
        'text-[10px] font-semibold uppercase tracking-[0.04em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
