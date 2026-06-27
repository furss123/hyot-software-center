'use client'

import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { AdminTextarea } from '@/components/ui/AdminTextarea'
import type { FaqItemAdmin } from '@/lib/content'

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'general' },
  { value: 'security', label: 'security' },
  { value: 'compatibility', label: 'compatibility' },
]

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
          return { ...item, [field]: { ...item[field], en: value } }
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
      setMessage('Saved')
      setShowAddForm(false)
    } else {
      setMessage('Failed to save')
    }
    setSaving(false)
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

  if (loading) return <p style={{ color: '#A0A0A0' }}>Loading...</p>

  return (
    <div>
      <a href="/content" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to Content
      </a>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>FAQ</h1>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Question</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{item.order}</td>
                <td>
                  <AdminInput
                    label=""
                    value={item.question.en}
                    onChange={(e) => updateItem(index, 'question', e.target.value)}
                    aria-label={`Question ${item.id}`}
                  />
                </td>
                <td>
                  <AdminSelect
                    label=""
                    options={CATEGORY_OPTIONS}
                    value={item.category}
                    onChange={(e) => updateItem(index, 'category', e.target.value)}
                    aria-label={`Category ${item.id}`}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <AdminButton variant="secondary" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                      ↑
                    </AdminButton>
                    <AdminButton
                      variant="secondary"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                    >
                      ↓
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <AdminButton variant="secondary" onClick={() => setShowAddForm(!showAddForm)}>
            Add Item
          </AdminButton>
          <AdminButton variant="primary" onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Saving...' : 'Save All'}
          </AdminButton>
        </div>
        {message && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: message === 'Saved' ? '#6CCB5F' : '#C42B1C' }}>
            {message}
          </p>
        )}
      </AdminCard>

      {showAddForm && (
        <AdminCard className="">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>New FAQ Item</h2>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '640px' }}>
            <AdminInput label="ID" name="id" placeholder="faq-6" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <AdminInput label="Question (ko)" name="question_ko" required />
              <AdminInput label="Question (en)" name="question_en" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <AdminTextarea label="Answer (ko)" name="answer_ko" required />
              <AdminTextarea label="Answer (en)" name="answer_en" required />
            </div>
            <AdminSelect label="Category" name="category" options={CATEGORY_OPTIONS} defaultValue="general" />
            <AdminButton type="submit" variant="primary">Add to list</AdminButton>
          </form>
        </AdminCard>
      )}
    </div>
  )
}
