'use client'

import { ExternalLink } from 'lucide-react'

import { AdminButton } from '@/components/ui/AdminButton'
import { previewUrl } from '@/lib/preview'
import { t } from '@/lib/i18n'

type PreviewButtonProps = {
  path: string
}

export function PreviewButton({ path }: PreviewButtonProps): React.JSX.Element {
  return (
    <a
      href={previewUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <AdminButton variant="secondary">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          {t.actions.viewSite} →
          <ExternalLink size={14} />
        </span>
      </AdminButton>
    </a>
  )
}
