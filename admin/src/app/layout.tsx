import './globals.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>HyoT Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body
        style={{
          margin: 0,
          background: '#0A0A0A',
          color: '#F0F0F0',
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
        }}
      >
        <nav
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '0 1.5rem',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: '#1A1A1A',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>⚙ HyoT Admin</span>
          {[
            { href: '/', label: 'Dashboard' },
            { href: '/software', label: 'Software' },
            { href: '/releases', label: 'Releases' },
            { href: '/content', label: 'Content' },
            { href: '/config', label: 'Config' },
            { href: '/features', label: 'Features' },
            { href: '/analytics', label: 'Analytics' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{ fontSize: '0.875rem', color: '#A0A0A0', textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}
        </nav>
        <main style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
