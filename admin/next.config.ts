import type { NextConfig } from 'next'

const config: NextConfig = {
  // Admin is local-only — never export
  experimental: { serverActions: { allowedOrigins: ['localhost:3001'] } },
}

export default config
