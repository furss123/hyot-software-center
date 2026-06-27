'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

export default function EditSoftwarePage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params.slug

  const [meta, setMeta] = useState<SoftwareMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetch(`/api/software?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json() as Promise<SoftwareMeta>
      })
      .then(setMeta)
      .catch(() => setError('Software not found'))
      .finally(() => setLoading(false))
  }, [slug])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (!meta) return
    setSaving(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const updated: SoftwareMeta = {
      ...meta,
      status: String(form.get('status') ?? meta.status) as SoftwareStatus,
      category: String(form.get('category') ?? meta.category) as SoftwareCategory,
      tags: String(form.get('tags') ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      featured: form.get('featured') === 'on',
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
    }

    const res = await fetch('/api/software', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })

    if (!res.ok) {
      setError('Failed to save')
      setSaving(false)
      return
    }

    router.push('/software')
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>Loading...</p>
  if (!meta) return <p style={{ color: '#C42B1C' }}>{error || 'Not found'}</p>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Edit: {slug}
      </h1>
      <AdminCard>
        <form key={meta.updatedAt} onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '640px' }}>
          <AdminInput label="Slug" name="slug" defaultValue={meta.slug} readOnly />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Name (ko)" name="name_ko" defaultValue={meta.name.ko} required />
            <AdminInput label="Name (en)" name="name_en" defaultValue={meta.name.en} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Short description (ko)" name="shortDescription_ko" defaultValue={meta.shortDescription.ko} required />
            <AdminInput label="Short description (en)" name="shortDescription_en" defaultValue={meta.shortDescription.en} required />
          </div>
          <AdminTextarea label="Description (ko)" name="description_ko" defaultValue={meta.description.ko} required />
          <AdminTextarea label="Description (en)" name="description_en" defaultValue={meta.description.en} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminSelect label="Status" name="status" options={STATUS_OPTIONS} defaultValue={meta.status} />
            <AdminSelect label="Category" name="category" options={CATEGORY_OPTIONS} defaultValue={meta.category} />
          </div>
          <AdminInput label="Tags (comma-separated)" name="tags" defaultValue={meta.tags.join(', ')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <AdminInput label="Requirements OS" name="requirements_os" defaultValue={meta.requirements.os} required />
            <AdminInput label="RAM" name="requirements_ram" defaultValue={meta.requirements.ram ?? ''} />
            <AdminInput label="Disk" name="requirements_disk" defaultValue={meta.requirements.disk ?? ''} />
          </div>
          <AdminInput label="GitHub URL" name="links_github" type="url" defaultValue={meta.links?.github ?? ''} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input type="checkbox" name="featured" defaultChecked={meta.featured} />
            Featured
          </label>
          {error && <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{error}</p>}
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  )
}
