import { getSiteConfig } from '@/lib/content/config'

export function Footer(): React.JSX.Element {
  const config = getSiteConfig()
  return (
    <footer className="border-t border-border py-6 mt-16">
      <p className="text-center text-xs text-text-tertiary">
        {config.footer?.copyright?.ko ?? '© 2026 HyoT. All rights reserved.'}
      </p>
    </footer>
  )
}
