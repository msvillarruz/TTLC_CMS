import { getSiteSettings, getSitemapContent } from '@/lib/api'
import { pageUrl, recordPath, SCHOOL_NAME } from '@/lib/seo-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [settings, { programs }] = await Promise.all([getSiteSettings(), getSitemapContent()])
  const text = [
    `# ${SCHOOL_NAME}`, '',
    '> A play-based learning center in Quezon City, Philippines.', '',
    `Location: ${settings.address || '113 West Avenue, Brgy. Bungad, Quezon City'}`,
    ...(settings.phone ? [`Phone: ${settings.phone}`] : []),
    ...(settings.email ? [`Email: ${settings.email}`] : []), '',
    '## Official pages', '',
    `- [Home](${pageUrl()})`, `- [Programs](${pageUrl('/programs')})`,
    `- [About and team](${pageUrl('/about')})`, `- [Trial booking and contact](${pageUrl('/contact')})`,
    `- [Articles](${pageUrl('/articles')})`, `- [Events](${pageUrl('/events')})`, '',
    '## Programs', '',
    ...programs.map((p) => `- [${p.name.replace(/[\[\]\r\n]/g, ' ')}](${pageUrl(recordPath('programs', p.slug))})`), '',
    'Consult the official program pages for age eligibility and schedules. Contact the school for current tuition and availability.', '',
  ].join('\n')
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
