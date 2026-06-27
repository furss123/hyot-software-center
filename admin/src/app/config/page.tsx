import path from 'path'

import { SiteConfigForm } from '@/components/SiteConfigForm'
import { DATA_DIR } from '@/lib/data'
import { readJson } from '@/lib/content'

export default function ConfigPage(): React.JSX.Element {
  const config = readJson(path.join(DATA_DIR, 'config', 'site.config.json'))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Config</h1>
      <SiteConfigForm config={config as Parameters<typeof SiteConfigForm>[0]['config']} />
    </div>
  )
}
