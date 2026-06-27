'use client'

import { useActionState } from 'react'

import { saveFeatureFlags, type SoftwareFormState } from '@/actions/content'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminSelect } from '@/components/ui/AdminSelect'

type FeatureFlags = Record<string, { status: string; description?: string }>

type FeaturesFormProps = {
  flags: FeatureFlags
}

const initial: SoftwareFormState = { ok: false, message: '' }

const statuses = ['enabled', 'disabled', 'experimental', 'beta', 'deprecated'] as const

export function FeaturesForm({ flags }: FeaturesFormProps): React.JSX.Element {
  const [state, formAction, pending] = useActionState(saveFeatureFlags, initial)

  return (
    <AdminCard>
      <form action={formAction} className="space-y-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/60 text-left">
              <th className="py-2 pr-4">Key</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(flags).map(([key, flag]) => (
              <tr key={key} className="border-b border-white/5">
                <td className="py-3 pr-4 font-mono">{key}</td>
                <td className="py-3 pr-4">
                  <AdminSelect name={`flag_${key}`} defaultValue={flag.status}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </AdminSelect>
                </td>
                <td className="py-3 text-white/60">{flag.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminButton type="submit" disabled={pending}>
          Save all flags
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
