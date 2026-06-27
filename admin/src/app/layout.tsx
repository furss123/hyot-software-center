import './globals.css'

import { t } from '@/lib/i18n'

const navLinks = [
  { href: '/', label: t.nav.dashboard },
  { href: '/software', label: t.nav.software },
  { href: '/releases', label: t.nav.releases },
  { href: '/content', label: t.nav.content },
  { href: '/config', label: t.nav.config },
  { href: '/features', label: t.nav.features },
  { href: '/analytics', label: t.nav.analytics },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="dark">
      <head>
        <title>HyoT 관리자</title>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body
        style={{
          margin: 0,
          background: '#0A0A0A',
          color: '#F0F0F0',
          minHeight: '100vh',
        }}
      >
        <nav
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: '#1A1A1A',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 1.5rem',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.875rem', marginRight: '1rem' }}>
              ⚙ HyoT 관리자
            </span>
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{ fontSize: '0.875rem', color: '#A0A0A0', textDecoration: 'none' }}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
        <main
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '2rem 1.5rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  )
}
