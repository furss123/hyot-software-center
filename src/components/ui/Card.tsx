import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'default' | 'glass' | 'mica' | 'acrylic'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hover?: boolean
  children: ReactNode
}

const variants: Record<CardVariant, string> = {
  default: 'bg-bg-surface border border-border',
  glass: 'glass',
  mica: 'mica border border-border/30',
  acrylic: 'acrylic border border-border/40',
}

export function Card({
  variant = 'default',
  hover = false,
  children,
  className,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div
      {...props}
      className={cn(
        'rounded-xl shadow-sm',
        'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
        variants[variant],
        hover && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  )
}
