import path from 'path'
import type { NextConfig } from 'next'

const config: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  experimental: { serverActions: { allowedOrigins: ['localhost:3001'] } },
}

export default config
