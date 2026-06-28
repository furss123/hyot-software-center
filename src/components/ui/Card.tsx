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
        'group relative overflow-hidden',
        'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
        variants[variant],
        hover &&
          cn(
            'cursor-pointer',
            'hover:border-border-strong hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5',
          ),
        className,
      )}
    >
      {hover && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(90deg, #4A9FE0 0%, #8B4FCC 33%, #E87820 66%, #2A9B8A 100%)',
          }}
          aria-hidden
        />
      )}
      {children}
    </div>
  )
}
