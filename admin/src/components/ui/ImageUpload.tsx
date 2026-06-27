'use client'

import { useRef, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { t } from '@/lib/i18n'

type ImageUploadProps = {
  slug: string
  type: 'icon' | 'banner' | 'screenshot'
  currentUrl?: string
  onUpload: (url: string) => void
}

function previewSrc(slug: string, type: 'icon' | 'banner', currentUrl?: string): string | null {
  if (currentUrl) return `/api/upload?slug=${encodeURIComponent(slug)}&type=${type}`
  return null
}

export function ImageUpload({
  slug,
  type,
  currentUrl,
  onUpload,
}: ImageUploadProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const isIcon = type === 'icon'
  const boxStyle: React.CSSProperties = {
    width: isIcon ? 120 : 300,
    height: 120,
    border: '2px dashed rgba(255,255,255,0.2)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
  }

  const displaySrc = preview ?? (type !== 'screenshot' ? previewSrc(slug, type, currentUrl) : null)

  async function handleFile(file: File): Promise<void> {
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setMessage(t.upload.uploading)

    const form = new FormData()
    form.append('file', file)
    form.append('slug', slug)
    form.append('type', type)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) {
        setMessage(t.common.error)
        return
      }
      const data = (await res.json()) as { url: string }
      setMessage(t.upload.uploaded)
      onUpload(data.url)
    } catch {
      setMessage(t.common.error)
    } finally {
      setUploading(false)
    }
  }

  const label =
    type === 'icon'
      ? `${t.upload.icon} (${t.upload.iconHint})`
      : type === 'banner'
        ? `${t.upload.banner} (${t.upload.bannerHint})`
        : t.upload.screenshot

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{label}</p>
      <div style={boxStyle}>
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displaySrc}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#686868' }}>{t.upload.maxSize}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />
      <AdminButton
        variant="secondary"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? t.upload.uploading : t.upload.upload}
      </AdminButton>
      {message && (
        <p style={{ fontSize: '0.75rem', color: message === t.common.error ? '#C42B1C' : '#6CCB5F' }}>
          {message}
        </p>
      )}
    </div>
  )
}
