import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'

import { ReleasesDetail } from '@/components/ReleasesDetail'
import { DATA_DIR } from '@/lib/data'
import { readJson } from '@/lib/content'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ReleaseSlugPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const file = path.join(DATA_DIR, 'software', slug, 'releases.json')
  if (!fs.existsSync(file)) notFound()
  const data = readJson<{ releases: Parameters<typeof ReleasesDetail>[0]['releases'] }>(file)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Releases: {slug}</h1>
      <ReleasesDetail slug={slug} releases={data.releases} />
    </div>
  )
}
