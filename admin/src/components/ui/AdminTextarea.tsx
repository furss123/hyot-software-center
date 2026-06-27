import type { TextareaHTMLAttributes } from 'react'

type AdminTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function AdminTextarea({
  className = '',
  ...props
}: AdminTextareaProps): React.JSX.Element {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm outline-none focus:border-[#0078D4] resize-y min-h-[100px] ${className}`}
    />
  )
}
