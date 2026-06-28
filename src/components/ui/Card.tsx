import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'default' | 'glass' | 'mica' | 'acrylic'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hover?: boolean
  children: ReactNode
}

const variants: Record<CardVariant, string> = {
  default: cn(
    'bg-bg-surface border border-border-pixel',
    'rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)]',
  ),
  glass: 'glass rounded-[var(--radius-xl)]',
  mica: 'mica border border-border-pixel rounded-[var(--radius-xl)]',
  acrylic: 'acrylic border border-border-pixel rounded-[var(--radius-xl)]',
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
        'relative overflow-hidden',
        'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
        variants[variant],
        hover &&
          cn(
            'group/card cursor-pointer',
            'hover:border-border-strong hover:shadow-[var(--shadow-md)] hover:-translate-y-px',
          ),
        className,
      )}
    >
      {hover && (
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-0.5 z-10',
            'opacity-0 group-hover/card:opacity-100',
            'transition-opacity duration-[var(--duration-base)]',
          )}
          style={{
            background:
              'linear-gradient(90deg, var(--hyot-blue), var(--hyot-purple), var(--hyot-orange), var(--hyot-teal))',
          }}
          aria-hidden
        />
      )}
      {children}
    </div>
  )
}
