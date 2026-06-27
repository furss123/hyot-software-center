import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const styles: Record<Variant, string> = {
  primary: 'bg-[#0078D4] text-white hover:bg-[#106EBE]',
  secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
}

export function AdminButton({
  variant = 'primary',
  children,
  className = '',
  ...props
}: AdminButtonProps): React.JSX.Element {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
