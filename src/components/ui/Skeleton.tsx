import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }): React.JSX.Element {
  return (
    <div className={cn('animate-pulse rounded-md bg-fill-secondary', className)} />
  )
}

export function SoftwareCardSkeleton(): React.JSX.Element {
  return (
    <div className="p-5 rounded-xl border border-border bg-bg-surface">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
