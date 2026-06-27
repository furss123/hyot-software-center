'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminSelect } from '@/components/ui/AdminSelect'
import { AdminTextarea } from '@/components/ui/AdminTextarea'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { PreviewButton } from '@/components/ui/PreviewButton'
import { t } from '@/lib/i18n'
import type { SoftwareCategory, SoftwareMeta, SoftwareStatus } from '@/types'

const STATUS_OPTIONS = (Object.keys(t.software.statusOptions) as SoftwareStatus[]).map((value) => ({
  value,
  label: t.software.statusOptions[value],
}))

const CATEGORY_OPTIONS = (Object.keys(t.software.categoryOptions) as SoftwareCategory[]).map(
  (value) => ({
    value,
    label: t.software.categoryOptions[value],
  }),
)

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
      .catch(() => setError(t.common.notFound))
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
        .map((tag) => tag.trim())
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
      setError(t.common.error)
      setSaving(false)
      return
    }

    router.push('/software')
  }

  if (loading) return <p style={{ color: '#A0A0A0' }}>{t.common.loading}</p>
  if (!meta) return <p style={{ color: '#C42B1C' }}>{error || t.common.notFound}</p>

  return (
    <div>
      <a href="/software" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        {t.software.back}
      </a>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {t.software.edit}: {slug}
        </h1>
        <PreviewButton path={`/software/${slug}`} />
      </div>
      <div style={{ maxWidth: '760px' }}>
        <AdminCard>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <ImageUpload
            slug={slug}
            type="icon"
            currentUrl={meta.icon}
            onUpload={(url) => setMeta((prev) => (prev ? { ...prev, icon: url } : prev))}
          />
          <ImageUpload
            slug={slug}
            type="banner"
            currentUrl={meta.banner}
            onUpload={(url) => setMeta((prev) => (prev ? { ...prev, banner: url } : prev))}
          />
        </div>
          <form key={meta.updatedAt} onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AdminInput label={t.software.slug} name="slug" defaultValue={meta.slug} readOnly />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.software.nameKo} name="name_ko" defaultValue={meta.name.ko} required />
            <AdminInput label={t.software.nameEn} name="name_en" defaultValue={meta.name.en} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.software.shortDescKo} name="shortDescription_ko" defaultValue={meta.shortDescription.ko} required />
            <AdminInput label={t.software.shortDescEn} name="shortDescription_en" defaultValue={meta.shortDescription.en} required />
          </div>
          <AdminTextarea label={t.software.descriptionKo} name="description_ko" defaultValue={meta.description.ko} required />
          <AdminTextarea label={t.software.descriptionEn} name="description_en" defaultValue={meta.description.en} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AdminSelect label={t.software.status} name="status" options={STATUS_OPTIONS} defaultValue={meta.status} />
            <AdminSelect label={t.software.category} name="category" options={CATEGORY_OPTIONS} defaultValue={meta.category} />
          </div>
          <AdminInput label={t.software.tags} name="tags" defaultValue={meta.tags.join(', ')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <AdminInput label={t.software.os} name="requirements_os" defaultValue={meta.requirements.os} required />
            <AdminInput label={t.software.ram} name="requirements_ram" defaultValue={meta.requirements.ram ?? ''} />
            <AdminInput label={t.software.disk} name="requirements_disk" defaultValue={meta.requirements.disk ?? ''} />
          </div>
          <AdminInput label={t.software.github} name="links_github" type="url" defaultValue={meta.links?.github ?? ''} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input type="checkbox" name="featured" defaultChecked={meta.featured} />
            {t.software.featuredLabel}
          </label>
          {error && <p style={{ color: '#C42B1C', fontSize: '0.875rem' }}>{error}</p>}
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? t.software.saving : t.software.save}
          </AdminButton>
          </form>
        </AdminCard>
      </div>
    </div>
  )
}
