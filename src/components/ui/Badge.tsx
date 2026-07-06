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
    'bg-[rgba(42,155,138,0.15)] text-[var(--status-success)] border border-[rgba(42,155,138,0.3)]',
  beta: 'bg-[rgba(74,159,224,0.15)] text-[var(--status-info)] border border-[rgba(74,159,224,0.3)]',
  legacy: 'bg-fill-secondary text-text-tertiary border border-border',
  experimental:
    'bg-[rgba(232,120,32,0.15)] text-[var(--status-warning)] border border-[rgba(232,120,32,0.3)]',
  deprecated:
    'bg-[rgba(255,112,112,0.12)] text-[var(--status-error)] border border-[rgba(255,112,112,0.25)]',
  success:
    'bg-[rgba(42,155,138,0.15)] text-[var(--status-success)] border border-[rgba(42,155,138,0.3)]',
  warning:
    'bg-[rgba(232,120,32,0.15)] text-[var(--status-warning)] border border-[rgba(232,120,32,0.3)]',
  error: 'bg-[rgba(255,112,112,0.12)] text-[var(--status-error)] border border-[rgba(255,112,112,0.25)]',
  info: 'bg-[rgba(74,159,224,0.15)] text-[var(--status-info)] border border-[rgba(74,159,224,0.3)]',
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
        'inline-flex items-center px-2 py-[3px]',
        'rounded-[var(--radius-sm)]',
        'text-[11px] font-bold uppercase tracking-[0.04em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
