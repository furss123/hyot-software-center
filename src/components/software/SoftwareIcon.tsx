import { cn, slugToHue } from '@/lib/utils'
import type { SoftwareMeta } from '@/types'

type SoftwareIconProps = {
  app: Pick<SoftwareMeta, 'slug' | 'name' | 'icon'>
  size?: 'sm' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-12 h-12 rounded-xl text-lg',
  lg: 'w-20 h-20 rounded-2xl text-3xl shadow-sm',
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
        className={cn(
          'flex-shrink-0 object-cover',
          sizeClasses[size],
          className,
        )}
      />
    )
  }

  return (
    <div
      style={{ background: `hsl(${slugToHue(app.slug)}, 60%, 45%)` }}
      className={cn(
        'flex items-center justify-center text-white font-bold flex-shrink-0',
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      {app.name.en.charAt(0).toUpperCase()}
    </div>
  )
}
