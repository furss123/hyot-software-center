'use client'

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type FeedbackType = 'bug' | 'feature' | 'other'
type Status = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  software: Array<{ slug: string; name: { ko: string; en: string } }>
  formspreeId: string
  locale: string
  initialSoftware?: string
}

export function FeedbackForm({
  software,
  formspreeId,
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

  const typeLabel: Record<FeedbackType, string> = {
    bug: t('typeBug'),
    feature: t('typeFeature'),
    other: t('typeOther'),
  }

  function resetForm(): void {
    setType('bug')
    setSelectedSoftware(querySoftware ?? initialSoftware ?? '__none__')
    setTitle('')
    setContent('')
    setContact('')
    setAttempted(false)
  }

  function getSoftwareLabel(slug: string): string {
    const item = software.find((s) => s.slug === slug)
    return item ? item.name[l] : slug
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    setAttempted(true)
    if (!title.trim() || content.trim().length < 10) return

    setStatus('submitting')

    const softwareLabel =
      selectedSoftware && selectedSoftware !== '__none__'
        ? getSoftwareLabel(selectedSoftware)
        : t('softwareNone')

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          유형: typeLabel[type],
          프로그램: softwareLabel,
          제목: title,
          내용: content,
          연락처: contact || (l === 'ko' ? '미입력' : 'Not provided'),
          _subject: `[HyoT 건의] ${typeLabel[type]} — ${title}`,
        }),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
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
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">{t('type')}</label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
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
        <label htmlFor="feedback-software" className="block text-sm font-medium text-text-primary mb-2">
          {t('software')}
        </label>
        <select
          id="feedback-software"
          value={selectedSoftware}
          onChange={(e) => setSelectedSoftware(e.target.value)}
          className="border border-border rounded-lg p-3 w-full bg-bg-surface text-text-primary"
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
        <label htmlFor="feedback-title" className="block text-sm font-medium text-text-primary mb-2">
          {t('titleLabel')}
        </label>
        <input
          id="feedback-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('titlePlaceholder')}
          className="border border-border rounded-lg p-3 w-full bg-bg-surface text-text-primary"
        />
        {titleError && <p className="text-status-error text-sm mt-2">{t('validTitle')}</p>}
      </div>

      <div>
        <label htmlFor="feedback-content" className="block text-sm font-medium text-text-primary mb-2">
          {t('contentLabel')}
        </label>
        <textarea
          id="feedback-content"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('contentPlaceholder')}
          className="border border-border rounded-lg p-3 w-full bg-bg-surface text-text-primary resize-y"
        />
        {contentError && <p className="text-status-error text-sm mt-2">{t('validContent')}</p>}
      </div>

      <div>
        <label htmlFor="feedback-contact" className="block text-sm font-medium text-text-primary mb-2">
          {t('contact')}
        </label>
        <input
          id="feedback-contact"
          type="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t('contactPlaceholder')}
          className="border border-border rounded-lg p-3 w-full bg-bg-surface text-text-primary"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={status === 'submitting'}
        loading={status === 'submitting'}
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </Button>

      {status === 'error' && <p className="text-status-error text-sm mt-2">{t('errorMsg')}</p>}
    </form>
  )
}
