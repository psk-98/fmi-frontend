import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,
  // output: 'standalone',
  poweredByHeader: false,
}

export default nextConfig
