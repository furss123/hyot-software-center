'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { AdminTextarea } from '@/components/ui/AdminTextarea'
import type { SoftwareCategory, SoftwareMeta, SoftwareStatus } from '@/types'

const STATUS_OPTIONS = [
  { value: 'active', label: 'active' },
  { value: 'beta', label: 'beta' },
  { value: 'deprecated', label: 'deprecated' },
  { value: 'archived', label: 'archived' },
]

const CATEGORY_OPTIONS = [
  { value: 'utility', label: 'utility' },
  { value: 'productivity', label: 'productivity' },
  { value: 'system', label: 'system' },
  { value: 'developer', label: 'developer' },
  { value: 'media', label: 'media' },
  { value: 'security', label: 'security' },
  { value: 'other', label: 'other' },
]

export default function NewSoftwarePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<SoftwareStatus>('active')
  const [category, setCategory] = useState<SoftwareCategory>('utility')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const slug = String(form.get('slug') ?? '').trim()

    const meta: SoftwareMeta = {
      slug,
      status,
      category,
      tags: String(form.get('tags') ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      featured,
      name: {
        ko: String(form.get('name_ko') ?? ''),
        en: String(form.get('name_en') ?? ''),
      },
      description: {
        ko: String(form.get('description_ko') ?? ''),
        en: String(form.get('description_en') ?? ''),
      },
      shortDescription: {
        ko: String(form.get('shortDescription_ko') ?? ''),
        en: String(form.get('shortDescription_en') ?? ''),
      },
      requirements: {
        os: String(form.get('requirements_os') ?? ''),
        ram: String(form.get('requirements_ram') ?? '') || undefined,
        disk: String(form.get('requirements_disk') ?? '') || undefined,
      },
      links: {
        github: String(form.get('links_github') ?? '') || undefined,
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }

    const res = await fetch('/api/software', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meta),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Failed to create')
      setLoading(false)
      return
    }

    router.push('/software')
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>New Software</h1>
      <AdminCard>
        <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '640px' }}>
          <AdminInput label="Slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Name (ko)" name="name_ko" required />
            <AdminInput label="Name (en)" name="name_en" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Short description (ko)" name="shortDescription_ko" required />
            <AdminInput label="Short description (en)" name="shortDescription_en" required />
          </div>
          <AdminTextarea label="Description (ko)" name="description_ko" required />
          <AdminTextarea label="Description (en)" name="description_en" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminSelect label="Status" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as SoftwareStatus)} />
            <AdminSelect label="Category" options={CATEGORY_OPTIONS} value={category} onChange={(e) => setCategory(e.target.value as SoftwareCategory)} />
          </div>
          <AdminInput label="Tags (comma-separated)" name="tags" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Requirements OS" name="requirements_os" defaultValue="Windows 10 22H2+" required />
            <AdminInput label="RAM" name="requirements_ram" />
            <AdminInput label="Disk" name="requirements_disk" />
          </div>
          <AdminInput label="GitHub URL" name="links_github" type="url" />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
          {error && <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{error}</p>}
          <AdminButton type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  )
}
