import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = { title: 'Security' }

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function SecurityPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Security</h1>
      <Card className="p-6 space-y-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          Report security vulnerabilities through GitHub Security Advisories. Do not disclose
          vulnerabilities publicly before a fix is available.
        </p>
        <a
          href="https://github.com/hyot/hyot-software-center/security/advisories/new"
          className="text-accent text-sm hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
        >
          Report a vulnerability →
        </a>
      </Card>
    </div>
  )
}
