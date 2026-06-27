import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }): React.JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-text-tertiary mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-text-disabled" />}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-text-secondary transition-colors duration-[var(--duration-fast)]"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(i === items.length - 1 && 'text-text-primary font-medium')}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
