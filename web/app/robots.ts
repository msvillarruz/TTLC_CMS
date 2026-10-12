import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-utils'

export default function robots(): MetadataRoute.Robots {
  return {
    // All public search crawlers inherit these rules. Training access remains
    // a separate business policy; no new training-specific permission is added.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
