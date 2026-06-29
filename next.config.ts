import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Custom domain (hyot.dev): basePath empty. For github.io/repo subpath, set GITHUB_PAGES_REPO.
const basePath = ''

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath && { basePath, assetPrefix: basePath }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default withNextIntl(config)
