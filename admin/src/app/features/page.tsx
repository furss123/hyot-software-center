import path from 'path'

import { FeaturesForm } from '@/components/FeaturesForm'
import { DATA_DIR } from '@/lib/data'
import { readJson } from '@/lib/content'

export default function FeaturesPage(): React.JSX.Element {
  const flags = readJson(path.join(DATA_DIR, 'config', 'features.json'))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Feature Flags</h1>
      <FeaturesForm flags={flags as Parameters<typeof FeaturesForm>[0]['flags']} />
    </div>
  )
}
