import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Custom domain: delete public/CNAME content, set GITHUB_PAGES_REPO='' in Actions vars
// Subdomain (hyot.github.io/repo): set GITHUB_PAGES_REPO=your-repo-name in Actions vars
const repo = process.env.GITHUB_PAGES_REPO
const basePath = repo ? `/${repo}` : ''

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
