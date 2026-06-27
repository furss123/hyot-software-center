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
  stable: 'bg-[color:rgba(16,124,16,0.12)] text-status-success',
  beta: 'bg-accent-subtle text-accent',
  legacy: 'bg-fill-tertiary text-text-tertiary',
  experimental: 'bg-[color:rgba(193,156,0,0.12)] text-status-warning',
  deprecated: 'bg-[color:rgba(196,43,28,0.12)] text-status-error',
  success: 'bg-[color:rgba(16,124,16,0.12)] text-status-success',
  warning: 'bg-[color:rgba(193,156,0,0.12)] text-status-warning',
  error: 'bg-[color:rgba(196,43,28,0.12)] text-status-error',
  info: 'bg-accent-subtle text-status-info',
  default: 'bg-fill-secondary text-text-secondary',
}

export function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
