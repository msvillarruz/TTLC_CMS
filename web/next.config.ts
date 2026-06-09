import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../'),
  images: {
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
