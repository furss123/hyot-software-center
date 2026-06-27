import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'HyoT Admin',
}

export default function AdminLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#0A0A0A] text-[#F0F0F0] font-[system-ui,sans-serif] antialiased">
        <nav className="border-b border-white/10 px-6 py-3 flex gap-4 text-sm">
          <a href="/" className="font-semibold text-white hover:text-[#0078D4]">
            HyoT Admin
          </a>
          <a href="/software" className="text-white/70 hover:text-white">
            Software
          </a>
          <a href="/releases" className="text-white/70 hover:text-white">
            Releases
          </a>
          <a href="/config" className="text-white/70 hover:text-white">
            Config
          </a>
          <a href="/features" className="text-white/70 hover:text-white">
            Features
          </a>
        </nav>
        <div className="p-6">{children}</div>
      </body>
    </html>
  )
}
