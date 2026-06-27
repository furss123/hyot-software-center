'use client'

import { useActionState } from 'react'

import { saveSoftwareMeta, type SoftwareFormState } from '@/actions/content'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { AdminTextarea } from '@/components/ui/AdminTextarea'

type SoftwareMeta = {
  slug: string
  status: string
  category: string
  tags: string[]
  featured: boolean
  name: { ko: string; en: string }
  description: { ko: string; en: string }
  shortDescription: { ko: string; en: string }
  requirements: { os: string }
  createdAt: string
}

type SoftwareFormProps = {
  meta?: SoftwareMeta
  isNew?: boolean
}

const initial: SoftwareFormState = { ok: false, message: '' }

export function SoftwareForm({ meta, isNew = false }: SoftwareFormProps): React.JSX.Element {
  const [state, formAction, pending] = useActionState(saveSoftwareMeta, initial)

  return (
    <AdminCard>
      <form action={formAction} className="space-y-4 max-w-xl">
        <input type="hidden" name="isNew" value={isNew ? 'true' : 'false'} />
        {meta?.createdAt && <input type="hidden" name="createdAt" value={meta.createdAt} />}

        <div>
          <label className="block text-sm text-white/60 mb-1">Slug</label>
          <AdminInput
            name="slug"
            defaultValue={meta?.slug ?? ''}
            readOnly={!isNew}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Name (ko)</label>
            <AdminInput name="name_ko" defaultValue={meta?.name.ko ?? ''} required />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Name (en)</label>
            <AdminInput name="name_en" defaultValue={meta?.name.en ?? ''} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Short desc (ko)</label>
            <AdminInput
              name="shortDescription_ko"
              defaultValue={meta?.shortDescription.ko ?? ''}
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Short desc (en)</label>
            <AdminInput
              name="shortDescription_en"
              defaultValue={meta?.shortDescription.en ?? ''}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">Description (ko)</label>
          <AdminTextarea name="description_ko" defaultValue={meta?.description.ko ?? ''} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Description (en)</label>
          <AdminTextarea name="description_en" defaultValue={meta?.description.en ?? ''} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Status</label>
            <AdminSelect name="status" defaultValue={meta?.status ?? 'active'}>
              <option value="active">active</option>
              <option value="beta">beta</option>
              <option value="deprecated">deprecated</option>
              <option value="archived">archived</option>
            </AdminSelect>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Category</label>
            <AdminSelect name="category" defaultValue={meta?.category ?? 'utility'}>
              <option value="utility">utility</option>
              <option value="productivity">productivity</option>
              <option value="system">system</option>
              <option value="developer">developer</option>
              <option value="media">media</option>
              <option value="security">security</option>
              <option value="other">other</option>
            </AdminSelect>
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">Tags (comma-separated)</label>
          <AdminInput name="tags" defaultValue={meta?.tags.join(', ') ?? ''} />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">Requirements OS</label>
          <AdminInput
            name="requirements_os"
            defaultValue={meta?.requirements.os ?? 'Windows 10 22H2+'}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={meta?.featured ?? false} />
          Featured
        </label>

        <AdminButton type="submit" disabled={pending}>
          {pending ? 'Saving...' : 'Save'}
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
