import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'

import { SoftwareForm } from '@/components/SoftwareForm'
import { DATA_DIR } from '@/lib/data'
import { readJson } from '@/lib/content'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SoftwareEditPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const metaPath = path.join(DATA_DIR, 'software', slug, 'meta.json')
  if (!fs.existsSync(metaPath)) notFound()
  const meta = readJson(metaPath)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit: {slug}</h1>
      <SoftwareForm meta={meta as Parameters<typeof SoftwareForm>[0]['meta']} />
    </div>
  )
}
