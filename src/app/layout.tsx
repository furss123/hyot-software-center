import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

const ADSENSE_CLIENT = 'ca-pub-9694429813677076'

export const metadata: Metadata = {
  title: 'HyoT Software Center',
  metadataBase: new URL('https://hyot.dev'),
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=t||'system';if(m==='system')m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',m)}catch(e){}})()`

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-9694429813677076" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- AdSense site verification */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
