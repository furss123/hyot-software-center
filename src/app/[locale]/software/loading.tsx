import { SoftwareCardSkeleton } from '@/components/ui/Skeleton'

export default function Loading(): React.JSX.Element {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="h-8 w-48 bg-fill-secondary rounded-md animate-pulse mb-2" />
        <div className="h-4 w-24 bg-fill-secondary rounded-md animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SoftwareCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
