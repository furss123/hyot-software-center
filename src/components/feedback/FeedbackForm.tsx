'use client'

import { createClient } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type FeedbackType = 'bug' | 'feature' | 'other'
type Status = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  software: Array<{ slug: string; name: { ko: string; en: string } }>
  supabaseUrl: string
  supabaseAnonKey: string
  locale: string
  initialSoftware?: string
}

export function FeedbackForm({
  software,
  supabaseUrl,
  supabaseAnonKey,
  locale,
  initialSoftware,
}: Props): React.JSX.Element {
  const t = useTranslations('feedback')
  const l = locale as 'ko' | 'en'
  const searchParams = useSearchParams()
  const querySoftware = searchParams.get('software') ?? undefined
  const resolvedInitial = initialSoftware ?? querySoftware

  const [type, setType] = useState<FeedbackType>('bug')
  const [selectedSoftware, setSelectedSoftware] = useState(resolvedInitial ?? '__none__')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [attempted, setAttempted] = useState(false)

  const typeOptions: Array<{ value: FeedbackType; label: string }> = [
    { value: 'bug', label: t('typeBug') },
    { value: 'feature', label: t('typeFeature') },
    { value: 'other', label: t('typeOther') },
  ]

  function resetForm(): void {
    setType('bug')
    setSelectedSoftware(querySoftware ?? initialSoftware ?? '__none__')
    setTitle('')
    setContent('')
    setContact('')
    setAttempted(false)
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    setAttempted(true)
    if (!title.trim() || content.trim().length < 10) return

    setStatus('submitting')

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { error } = await supabase.from('feedback').insert({
        type,
        software:
          selectedSoftware && selectedSoftware !== '__none__' ? selectedSoftware : null,
        title: title.trim(),
        content: content.trim(),
        contact: contact.trim() || null,
      })
      if (error) throw error
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4" aria-hidden>
          ✅
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">{t('successTitle')}</h2>
        <p className="text-text-secondary mb-6">{t('successDesc')}</p>
        <Button
          variant="secondary"
          onClick={() => {
            resetForm()
            setStatus('idle')
          }}
        >
          {t('successAgain')}
        </Button>
      </div>
    )
  }

  const titleError = attempted && !title.trim()
  const contentError = attempted && content.trim().length < 10

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1.5">{t('type')}</label>
        <div className="flex flex-wrap gap-1.5">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={cn(
                'h-9 px-4 rounded-full text-xs font-medium transition-colors',
                type === opt.value
                  ? 'bg-accent text-white'
                  : 'bg-fill-subtle text-text-secondary hover:bg-fill-secondary',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="feedback-software" className="block text-xs font-medium text-text-secondary mb-1.5">
          {t('software')}
        </label>
        <select
          id="feedback-software"
          value={selectedSoftware}
          onChange={(e) => setSelectedSoftware(e.target.value)}
          className="border border-border rounded-lg p-2.5 w-full bg-bg-surface text-text-primary text-sm"
        >
          <option value="" disabled>
            {t('softwarePlaceholder')}
          </option>
          {software.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name[l]}
            </option>
          ))}
          <option value="__none__">{t('softwareNone')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="feedback-title" className="block text-xs font-medium text-text-secondary mb-1.5">
          {t('titleLabel')}
        </label>
        <input
          id="feedback-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('titlePlaceholder')}
          className="border border-border rounded-lg p-2.5 w-full bg-bg-surface text-text-primary text-sm"
        />
        {titleError && <p className="text-status-error text-xs mt-2">{t('validTitle')}</p>}
      </div>

      <div>
        <label htmlFor="feedback-content" className="block text-xs font-medium text-text-secondary mb-1.5">
          {t('contentLabel')}
        </label>
        <textarea
          id="feedback-content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('contentPlaceholder')}
          className="border border-border rounded-lg p-2.5 w-full bg-bg-surface text-text-primary text-sm resize-y min-h-[120px]"
        />
        {contentError && <p className="text-status-error text-xs mt-2">{t('validContent')}</p>}
      </div>

      <div>
        <label htmlFor="feedback-contact" className="block text-xs font-medium text-text-secondary mb-1.5">
          {t('contact')}
        </label>
        <input
          id="feedback-contact"
          type="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t('contactPlaceholder')}
          className="border border-border rounded-lg p-2.5 w-full bg-bg-surface text-text-primary text-sm"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full h-11 rounded-xl text-sm font-semibold mt-2"
        disabled={status === 'submitting'}
        loading={status === 'submitting'}
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </Button>

      {status === 'error' && <p className="text-status-error text-sm mt-2">{t('errorMsg')}</p>}
    </form>
  )
}
