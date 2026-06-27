import type { InputHTMLAttributes } from 'react'

type AdminInputProps = InputHTMLAttributes<HTMLInputElement>

export function AdminInput({ className = '', ...props }: AdminInputProps): React.JSX.Element {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm outline-none focus:border-[#0078D4] ${className}`}
    />
  )
}
