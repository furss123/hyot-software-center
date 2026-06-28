import { MDXRemote } from 'next-mdx-remote/rsc'

import { prepareMarkdownContent } from '@/lib/markdown'
import { cn } from '@/lib/utils'

type MarkdownContentProps = {
  source: string
  className?: string
}

export function MarkdownContent({
  source,
  className,
}: MarkdownContentProps): React.JSX.Element {
  return (
    <div className={cn('prose', className)}>
      <MDXRemote source={prepareMarkdownContent(source)} />
    </div>
  )
}
