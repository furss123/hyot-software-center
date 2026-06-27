import { AdminButton } from '@/components/ui/AdminButton'
import { previewUrl } from '@/lib/preview'
import { t } from '@/lib/i18n'

export function PreviewButton({ path }: { path: string }): React.JSX.Element {
  return (
    <a
      href={previewUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <AdminButton variant="secondary">{t.actions.viewSite} →</AdminButton>
    </a>
  )
}
