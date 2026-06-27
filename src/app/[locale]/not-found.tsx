'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/Button'

export default function NotFound(): React.JSX.Element {
  const locale = useLocale()
  const t = useTranslations('notFound')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-fill-tertiary mb-4">404</div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">{t('title')}</h1>
      <p className="text-text-secondary mb-8 max-w-md">{t('description')}</p>
      <Link href={`/${locale}`}>
        <Button variant="primary">{t('goHome')}</Button>
      </Link>
    </div>
  )
}
