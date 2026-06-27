'use client'

import { useActionState } from 'react'

import { saveSiteConfig, type SoftwareFormState } from '@/actions/content'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'

type SiteConfigFormProps = {
  config: {
    brand: {
      name: string
      url: string
      github?: string
      tagline?: { ko: string; en: string }
    }
  }
}

const initial: SoftwareFormState = { ok: false, message: '' }

export function SiteConfigForm({ config }: SiteConfigFormProps): React.JSX.Element {
  const [state, formAction, pending] = useActionState(saveSiteConfig, initial)

  return (
    <AdminCard>
      <form action={formAction} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-white/60 mb-1">Brand name</label>
          <AdminInput name="brand_name" defaultValue={config.brand.name} required />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">URL</label>
          <AdminInput name="brand_url" defaultValue={config.brand.url} required />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">GitHub</label>
          <AdminInput name="brand_github" defaultValue={config.brand.github ?? ''} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Tagline (ko)</label>
            <AdminInput name="tagline_ko" defaultValue={config.brand.tagline?.ko ?? ''} />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Tagline (en)</label>
            <AdminInput name="tagline_en" defaultValue={config.brand.tagline?.en ?? ''} />
          </div>
        </div>
        <AdminButton type="submit" disabled={pending}>
          Save config
        </AdminButton>
        {state.message && (
          <p className={`text-sm ${state.ok ? 'text-green-400' : 'text-red-400'}`}>
            {state.message}
          </p>
        )}
      </form>
    </AdminCard>
  )
}
