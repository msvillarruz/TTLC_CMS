import type { NextConfig } from 'next'
import path from 'path'
import { PERMANENT_REDIRECTS } from './lib/redirects.ts'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../'),
  async redirects() {
    return PERMANENT_REDIRECTS
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.tinythinkers.edu.ph',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-8405156a37534ba6a6153480e5de5d7d.r2.dev',
      },
    ],
  },
}

export default nextConfig
