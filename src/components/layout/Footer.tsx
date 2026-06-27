import { getSiteConfig } from '@/lib/content/config'

export function Footer(): React.JSX.Element {
  const config = getSiteConfig()
  return (
    <footer className="border-t border-border/50 py-5 mt-16">
      <p className="text-center text-[11px] text-text-tertiary/70">
        {config.footer?.copyright?.ko ?? '© 2026 HyoT. All rights reserved.'}
      </p>
    </footer>
  )
}
