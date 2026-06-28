import { cn, getAssetUrl, slugToColor } from '@/lib/utils'
import type { SoftwareMeta } from '@/types'

type SoftwareIconProps = {
  app: Pick<SoftwareMeta, 'slug' | 'name' | 'icon'>
  size?: 'sm' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: { width: '52px', height: '52px', fontSize: '1.25rem', borderRadius: '12px' },
  lg: { width: '80px', height: '80px', fontSize: '1.875rem', borderRadius: '14px' },
}

export function SoftwareIcon({
  app,
  size = 'sm',
  className,
}: SoftwareIconProps): React.JSX.Element {
  const dims = sizeStyles[size]

  if (app.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export; lazy-loaded icons from /public
      <img
        src={getAssetUrl(app.icon)}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn('flex-shrink-0 object-cover', className)}
        style={{
          width: dims.width,
          height: dims.height,
          borderRadius: dims.borderRadius,
        }}
      />
    )
  }

  return (
    <div
      style={{
        background: slugToColor(app.slug),
        width: dims.width,
        height: dims.height,
        borderRadius: dims.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: dims.fontSize,
        fontWeight: 800,
        color: 'white',
        letterSpacing: '-0.02em',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
      className={className}
      aria-hidden
    >
      {app.name.en.charAt(0).toUpperCase()}
    </div>
  )
}
