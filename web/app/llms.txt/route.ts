import { getSiteSettings, getSitemapContent } from '@/lib/api'
import { llmsDocument } from '@/lib/llms'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [settings, { programs }] = await Promise.all([getSiteSettings(), getSitemapContent()])
  return new Response(llmsDocument(settings, programs), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
