import type { HTMLAttributes, ReactNode } from 'react'

type AdminCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function AdminCard({ children, className = '', ...props }: AdminCardProps): React.JSX.Element {
  return (
    <div
      {...props}
      className={`rounded-xl border border-white/10 bg-[#1A1A1A] p-5 ${className}`}
    >
      {children}
    </div>
  )
}
