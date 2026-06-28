import { getSiteConfig } from '@/lib/content/config'

export function Footer(): React.JSX.Element {
  const config = getSiteConfig()
  return (
    <footer className="py-5 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="dot-divider mb-5" aria-hidden="true" />
        <p className="text-center text-[11px] text-text-tertiary/70">
          {config.footer?.copyright?.ko ?? '© 2026 HyoT. All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}
