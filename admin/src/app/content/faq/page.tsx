'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { AdminTextarea } from '@/components/ui/AdminTextarea'
import type { FaqItemAdmin } from '@/lib/content'
import { t } from '@/lib/i18n'

const CATEGORY_OPTIONS = (
  Object.keys(t.content.categoryOptions) as Array<keyof typeof t.content.categoryOptions>
).map((value) => ({
  value,
  label: t.content.categoryOptions[value],
}))

export default function ContentFaqPage() {
  const [items, setItems] = useState<FaqItemAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    void fetch('/api/content/faq')
      .then((res) => res.json() as Promise<FaqItemAdmin[]>)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  function moveItem(index: number, direction: -1 | 1): void {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    setItems(next.map((item, i) => ({ ...item, order: i + 1 })))
  }

  function updateItem(index: number, field: keyof FaqItemAdmin, value: string): void {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        if (field === 'question' || field === 'answer') {
          return { ...item, [field]: { ...item[field], ko: value } }
        }
        return { ...item, [field]: value }
      }),
    )
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/content/faq', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
    if (res.ok) {
      setItems((await res.json()) as FaqItemAdmin[])
      setMessage(t.common.success)
      setShowAddForm(false)
    } else {
      setMessage(t.common.error)
    }
    setSaving(false)
  }

  function removeItem(index: number): void {
    setItems((prev) =>
      prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i + 1 })),
    )
  }

  function addItem(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const newItem: FaqItemAdmin = {
      id: String(form.get('id') ?? `faq-${Date.now()}`),
      order: items.length + 1,
      question: {
        ko: String(form.get('question_ko') ?? ''),
        en: String(form.get('question_en') ?? ''),
      },
      answer: {
        ko: String(form.get('answer_ko') ?? ''),
        en: String(form.get('answer_en') ?? ''),
      },
      category: String(form.get('category') ?? 'general'),
    }
    setItems((prev) => [...prev, newItem])
    setShowAddForm(false)
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>

  return (
    <div>
      <a href="/content" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← {t.content.title}
      </a>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.content.faq}</h1>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>{t.content.order}</th>
              <th>{t.content.question}</th>
              <th>{t.content.category}</th>
              <th>{t.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{item.order}</td>
                <td>
                  <AdminInput
                    label=""
                    value={item.question.ko}
                    onChange={(e) => updateItem(index, 'question', e.target.value)}
                    aria-label={`${t.content.question} ${item.id}`}
                  />
                </td>
                <td>
                  <AdminSelect
                    label=""
                    options={CATEGORY_OPTIONS}
                    value={item.category}
                    onChange={(e) => updateItem(index, 'category', e.target.value)}
                    aria-label={`${t.content.category} ${item.id}`}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <AdminButton variant="secondary" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                      {t.content.moveUp}
                    </AdminButton>
                    <AdminButton
                      variant="secondary"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                    >
                      {t.content.moveDown}
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => removeItem(index)}>
                      {t.common.delete}
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <AdminButton variant="secondary" onClick={() => setShowAddForm(!showAddForm)}>
            {t.content.addItem}
          </AdminButton>
          <AdminButton variant="primary" onClick={() => void handleSave()} disabled={saving}>
            {saving ? t.software.saving : t.content.saveAll}
          </AdminButton>
        </div>
        {message && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: message === t.common.error ? '#C42B1C' : '#6CCB5F' }}>
            {message}
          </p>
        )}
      </AdminCard>

      {showAddForm && (
        <div style={{ maxWidth: '760px', marginTop: '1rem' }}>
          <AdminCard className="">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{t.content.addItem}</h2>
            <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AdminInput label={t.common.slug} name="id" placeholder="faq-6" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <AdminInput label={t.content.questionKo} name="question_ko" required />
              <AdminInput label={t.content.questionEn} name="question_en" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <AdminTextarea label={t.content.answerKo} name="answer_ko" required />
              <AdminTextarea label={t.content.answerEn} name="answer_en" required />
            </div>
            <AdminSelect label={t.content.category} name="category" options={CATEGORY_OPTIONS} defaultValue="general" />
              <AdminButton type="submit" variant="primary">{t.content.addItem}</AdminButton>
            </form>
          </AdminCard>
        </div>
      )}
    </div>
  )
}
