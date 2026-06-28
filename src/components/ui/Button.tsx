import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: cn(
    'bg-[var(--hyot-blue)] text-white',
    'border border-[var(--hyot-blue-dark)]',
    'hover:bg-[var(--hyot-blue-light)] hover:shadow-[var(--shadow-accent)]',
    'active:bg-[var(--hyot-blue-dark)]',
  ),
  secondary: cn(
    'bg-fill-subtle text-text-primary',
    'border border-border-pixel',
    'hover:bg-fill-secondary hover:border-[var(--hyot-blue)]',
  ),
  ghost: cn(
    'bg-transparent text-text-secondary',
    'hover:bg-fill-subtle hover:text-text-primary',
  ),
  destructive: cn('bg-status-error text-white', 'hover:opacity-90 active:opacity-80'),
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'start',
  children,
  className,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  const iconEl = loading ? (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  ) : (
    icon
  )

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'group/btn inline-flex items-center justify-center font-medium',
        'rounded-[var(--radius-md)] tracking-[0.01em]',
        'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
        'focus-visible:outline-2 focus-visible:outline-[var(--hyot-blue)] focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'select-none cursor-pointer relative overflow-hidden',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {iconPosition === 'start' && iconEl}
      {children}
      {iconPosition === 'end' && iconEl && (
        <span className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-fluent)] group-hover/btn:translate-x-[3px]">
          {iconEl}
        </span>
      )}
    </button>
  )
}
