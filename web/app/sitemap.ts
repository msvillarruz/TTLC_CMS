import type { MetadataRoute } from 'next'
import { getHomePage, getSiteSettings, getSitemapContent } from '@/lib/api'
import { contentDate, latestContentDate, pageUrl, recordPath, STATIC_CONTENT_UPDATED_AT } from '@/lib/seo-utils'

// Fetch at request time so content changes do not require a website rebuild.
// A failed CMS request must fail the sitemap rather than emit an incomplete 200.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ programs, articles, events }, home, settings] = await Promise.all([
    getSitemapContent(), getHomePage(), getSiteSettings(),
  ])
  const baseDate = latestContentDate(STATIC_CONTENT_UPDATED_AT, settings.updatedAt)
  const entry = (path: string, updatedAt?: string): MetadataRoute.Sitemap[number] => {
    const lastModified = contentDate(updatedAt)
    return { url: pageUrl(path), ...(lastModified && { lastModified }) }
  }
  const urls = [
    entry('/', latestContentDate(baseDate, home.updatedAt, ...programs.map((p) => p.updatedAt))),
    entry('/about', baseDate), entry('/contact', baseDate),
    entry('/programs', latestContentDate(baseDate, ...programs.map((p) => p.updatedAt))),
    entry('/articles', latestContentDate(baseDate, ...articles.map((a) => a.updatedAt))),
    entry('/events', latestContentDate(baseDate, ...events.map((e) => e.updatedAt))),
    // Announcements change independently; omit a date without a complete history.
    entry('/announcements'),
    ...programs.map((p) => entry(recordPath('programs', p.slug), latestContentDate(STATIC_CONTENT_UPDATED_AT, p.updatedAt))),
    ...articles.map((a) => entry(recordPath('articles', a.slug), latestContentDate(STATIC_CONTENT_UPDATED_AT, a.updatedAt))),
    ...events.map((e) => entry(recordPath('events', e.slug), latestContentDate(STATIC_CONTENT_UPDATED_AT, e.updatedAt))),
  ]
  return [...new Map(urls.map((item) => [item.url, item])).values()]
}
