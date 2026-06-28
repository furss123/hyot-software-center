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
            'hover:border-border-strong hover:shadow-[var(--shadow-md)] hover:-translate-y-px',
          ),
        className,
      )}
    >
      {hover && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10"
          style={{
            background: 'linear-gradient(90deg, #0078D4, #7B2FBE, #FF6B00, #00897B)',
          }}
          aria-hidden
        />
      )}
      {children}
    </div>
  )
}
