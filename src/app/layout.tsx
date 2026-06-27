import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'HyoT Software Center',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
