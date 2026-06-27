import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: cn(
    'bg-accent text-accent-foreground',
    'hover:bg-accent-hover active:bg-accent-active',
    'shadow-sm hover:shadow-md',
  ),
  secondary: cn(
    'bg-fill-secondary text-text-primary border border-border',
    'hover:bg-fill-tertiary',
  ),
  ghost: cn('text-text-secondary hover:text-text-primary hover:bg-fill-subtle'),
  destructive: cn('bg-status-error text-white', 'hover:opacity-90 active:opacity-80'),
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-[var(--duration-base)] ease-[var(--ease-fluent)]',
        'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'select-none cursor-pointer',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {loading ? (
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
      )}
      {children}
    </button>
  )
}
