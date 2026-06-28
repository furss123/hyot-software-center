import { cn, slugToHue } from '@/lib/utils'
import type { SoftwareMeta } from '@/types'

type SoftwareIconProps = {
  app: Pick<SoftwareMeta, 'slug' | 'name' | 'icon'>
  size?: 'sm' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-11 h-11 rounded-[var(--radius-lg)] text-lg',
  lg: 'w-20 h-20 rounded-[var(--radius-xl)] text-3xl shadow-[var(--shadow-sm)]',
}

export function SoftwareIcon({
  app,
  size = 'sm',
  className,
}: SoftwareIconProps): React.JSX.Element {
  if (app.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export; lazy-loaded icons from /public
      <img
        src={app.icon}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn('flex-shrink-0 object-cover', sizeClasses[size], className)}
      />
    )
  }

  const hue = slugToHue(app.slug)

  return (
    <div
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 35%), hsl(${hue + 30}, 60%, 25%))`,
      }}
      className={cn(
        'relative flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden',
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '6px 6px',
        }}
      />
      <span className="relative z-10">{app.name.en.charAt(0).toUpperCase()}</span>
    </div>
  )
}
