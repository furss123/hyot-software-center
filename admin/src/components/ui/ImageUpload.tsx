'use client'

import { useEffect, useRef, useState } from 'react'

import { AdminButton } from '@/components/ui/AdminButton'
import { t } from '@/lib/i18n'

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

interface ImageUploadProps {
  slug: string
  type: 'icon' | 'banner' | 'screenshot'
  currentUrl?: string
  onUpload?: (url: string) => void
}

function serverPreviewSrc(slug: string, type: 'icon' | 'banner'): string {
  return `/api/upload?slug=${encodeURIComponent(slug)}&type=${type}`
}

export function ImageUpload({
  slug,
  type,
  currentUrl,
  onUpload,
}: ImageUploadProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<UploadState>('idle')

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const isIcon = type === 'icon'
  const boxStyle: React.CSSProperties = {
    width: isIcon ? 80 : 270,
    height: isIcon ? 80 : 76,
    border: '2px dashed rgba(255,255,255,0.2)',
    borderRadius: isIcon ? 12 : 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
  }

  const displaySrc =
    preview ?? (currentUrl && type !== 'screenshot' ? serverPreviewSrc(slug, type) : null)

  const statusText =
    status === 'uploading'
      ? t.upload.uploading
      : status === 'done'
        ? t.upload.doneOk
        : status === 'error'
          ? t.upload.failOk
          : ''

  const statusColor =
    status === 'error' ? '#C42B1C' : status === 'done' ? '#6CCB5F' : '#A0A0A0'

  async function handleFile(file: File): Promise<void> {
    if (preview) URL.revokeObjectURL(preview)
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setStatus('uploading')

    const form = new FormData()
    form.append('file', file)
    form.append('slug', slug)
    form.append('type', type)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) {
        setStatus('error')
        return
      }
      const data = (await res.json()) as { success: boolean; url: string }
      setStatus('done')
      onUpload?.(data.url)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={boxStyle}>
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displaySrc}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '1.5rem', color: '#686868' }}>+</span>
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
        disabled={status === 'uploading'}
        onClick={() => inputRef.current?.click()}
      >
        {status === 'uploading' ? t.upload.uploading : t.upload.upload}
      </AdminButton>
      {statusText && (
        <p style={{ fontSize: '0.75rem', color: statusColor }}>{statusText}</p>
      )}
    </div>
  )
}
