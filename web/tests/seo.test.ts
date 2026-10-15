import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parentFaqs } from '../lib/faqs.ts'
import { jsonLdIssues } from '../lib/jsonld.ts'
import { llmsDocument } from '../lib/llms.ts'
import { PERMANENT_REDIRECTS } from '../lib/redirects.ts'
import { faqPageStructuredData, programCourseStructuredData, schoolStructuredData } from '../lib/seo.ts'
import { canonicalFacebookUrl, canonicalProgramSlug, classSizeLabel, contentDate, displayPhone, formatAddress, latestContentDate, pageUrl, postalAddress, programAgeRange, programFocuses, programLookupSlugs, recordPath, SCHOOL_PHONE, serializeJsonLd, withCanonicalProgramSlug } from '../lib/seo-utils.ts'
import { getArticle, getProgram, getSitemapContent } from '../lib/api.ts'
import type { Program } from '../lib/api.ts'

test('program outcomes support the CMS item field and legacy focus field without empty bullets', () => {
  assert.deepEqual(programFocuses({ focuses: [{ item: ' Literacy ' }, { focus: 'Social skills' }, { item: ' ' }, {}] }), ['Literacy', 'Social skills'])
})

test('age labels use the CMS display value and never reinterpret decimal notation', () => {
  assert.equal(programAgeRange({ ageMin: '3.7 years', ageMax: '4.11 years', ageRange: '3 years 7 months to 4 years 11 months' }), '3 years 7 months to 4 years 11 months')
  assert.equal(programAgeRange({ ageMin: '4.5 Years', ageMax: '5 Years' }), '4.5 Years–5 Years')
  assert.equal(programAgeRange({ ageMin: 1.5, ageMax: 2.5 }), '1.5–2.5 years old')
})

test('metadata URLs use one host and encoded record slugs', () => {
  assert.equal(pageUrl('/programs/'), 'https://www.tinythinkers.edu.ph/programs')
  assert.equal(pageUrl(), 'https://www.tinythinkers.edu.ph/')
  assert.equal(recordPath('articles', 'parent Q&A'), '/articles/parent%20Q%26A')
})

test('freshness uses actual timestamps and omits absent or invalid dates', () => {
  assert.equal(contentDate(undefined), undefined)
  assert.equal(contentDate('invalid'), undefined)
  assert.equal(latestContentDate(undefined, '2026-08-26T07:00:00Z', '2026-09-01'), '2026-09-01T00:00:00.000Z')
  assert.equal(latestContentDate(), undefined)
})

test('CMS text cannot close a JSON-LD script tag', () => {
  const value = { name: '</script><script>alert(1)</script>' }
  const serialized = serializeJsonLd(value)
  assert.equal(serialized.includes('<'), false)
  assert.deepEqual(JSON.parse(serialized), value)
})

test('sitemap discovery paginates all public collections and excludes drafts', async (t) => {
  const requests: URL[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = new URL(String(input))
    requests.push(url)
    const collection = url.pathname.split('/').at(-1)
    const page = Number(url.searchParams.get('page'))
    const docs = collection === 'programs'
      ? [{ slug: page === 1 ? 'first' : 'second' }]
      : collection === 'articles'
        ? [{ slug: 'public', status: 'published' }, { slug: 'private', status: 'draft' }]
        : [{ slug: 'school-event', status: 'upcoming' }]
    return Response.json({ docs, hasNextPage: collection === 'programs' && page === 1, nextPage: 2 })
  })
  const result = await getSitemapContent()
  assert.deepEqual(result.programs.map((p) => p.slug), ['first', 'second'])
  assert.deepEqual(result.articles.map((a) => a.slug), ['public'])
  assert.deepEqual(result.events.map((e) => e.slug), ['school-event'])
  assert.equal(requests.find((url) => url.pathname.endsWith('/articles'))?.searchParams.get('where[status][equals]'), 'published')
  assert.equal(requests.every((url) => !/trial-requests|users|parents/.test(url.pathname)), true)
})

test('a CMS failure rejects sitemap discovery instead of returning a partial inventory', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('Unavailable', { status: 503 }))
  await assert.rejects(getSitemapContent(), /CMS fetch failed/)
})

const sampleProgram = {
  id: 3,
  name: 'Discovery Drivers',
  slug: 'discovery-driveres',
  classType: 'Kinder Readiness',
  ageMin: '4.5 Years',
  ageMax: '5 Years',
  ageRange: '4.5 years to 5 years old',
  duration: '4 hours',
  focuses: [],
  schedule: '10:00 - 2:00PM',
  classSize: '8',
} satisfies Program

test('the misspelled Discovery Drivers slug canonicalizes and redirects', () => {
  assert.equal(canonicalProgramSlug('discovery-driveres'), 'discovery-drivers')
  assert.equal(canonicalProgramSlug('discovery-drivers'), 'discovery-drivers')
  assert.deepEqual(programLookupSlugs('discovery-drivers'), ['discovery-drivers', 'discovery-driveres'])
  assert.equal(withCanonicalProgramSlug(sampleProgram).slug, 'discovery-drivers')
  assert.equal(PERMANENT_REDIRECTS[0].source, '/programs/discovery-driveres')
  assert.equal(PERMANENT_REDIRECTS[0].destination, '/programs/discovery-drivers')
  assert.equal(PERMANENT_REDIRECTS[0].statusCode, 301)
})

test('school facts keep one phone, one Facebook profile, postal code and hours', () => {
  assert.equal(displayPhone('0967 201 8214'), SCHOOL_PHONE)
  assert.equal(displayPhone('+63 967 201 8214'), SCHOOL_PHONE)
  assert.equal(formatAddress('113 West Avenue Brgy. Bungad, Quezon City'), '113 West Avenue Brgy. Bungad, Quezon City 1105')
  assert.equal(postalAddress('113 West Avenue Brgy. Bungad, Quezon City').postalCode, '1105')
  assert.equal(postalAddress('113 West Avenue Brgy. Bungad, Quezon City').streetAddress, '113 West Avenue Brgy. Bungad')
  assert.equal(canonicalFacebookUrl('https://www.facebook.com/share/1BDRvgw8Ud/'), 'https://www.facebook.com/TTLCph/')
  assert.equal(canonicalFacebookUrl('https://www.facebook.com/tinythinkersph'), 'https://www.facebook.com/TTLCph/')
  assert.equal(canonicalFacebookUrl(), 'https://www.facebook.com/TTLCph/')
  assert.equal(classSizeLabel('8'), 'Maximum of 8 children')
  const school = schoolStructuredData({ facebookUrl: 'https://www.facebook.com/share/1BDRvgw8Ud/', phone: '09672018214', address: '113 West Avenue Brgy. Bungad, Quezon City' })
  assert.deepEqual(jsonLdIssues(school), [])
  const schoolNode = school['@graph'].find((node) => Array.isArray(node['@type']))
  assert.deepEqual(schoolNode && 'sameAs' in schoolNode ? schoolNode.sameAs : [], ['https://www.facebook.com/TTLCph/'])
  assert.equal(JSON.stringify(school).includes('285270287994540'), false)
})

test('parent FAQs stay within 8-12, publish no tuition amount, and mark missing owner facts', () => {
  const faqs = parentFaqs([withCanonicalProgramSlug(sampleProgram)], { address: '113 West Avenue Brgy. Bungad, Quezon City', phone: '+63 967 201 8214' })
  assert.ok(faqs.length >= 8 && faqs.length <= 12)
  const schema = faqPageStructuredData(faqs)
  assert.deepEqual(jsonLdIssues(schema), [])
  const tuition = faqs.find((faq) => faq.id === 'tuition')
  const requirements = faqs.find((faq) => faq.id === 'requirements')
  assert.match(tuition?.ownerTodo || '', /TODO\(owner\)/)
  assert.match(requirements?.ownerTodo || '', /TODO\(owner\)/)
  const published = JSON.stringify(schema)
  assert.equal(published.includes('TODO'), false)
  for (const id of ['tuition', 'requirements']) {
    const text = schema.mainEntity.find((question) => question.name === faqs.find((faq) => faq.id === id)?.question)?.acceptedAnswer.text || ''
    assert.equal(/\d|₱|php|pesos/i.test(text), false, id)
  }
  assert.match(published, /4\.5 years to 5 years old/)
  assert.match(published, /discovery-drivers/)
  assert.equal(published.includes('discovery-driveres'), false)
  const course = programCourseStructuredData(withCanonicalProgramSlug(sampleProgram))
  assert.deepEqual(jsonLdIssues(course), [])
  const summary = llmsDocument({ facebookUrl: 'https://www.facebook.com/share/1BDRvgw8Ud/' }, [sampleProgram], true)
  assert.match(summary, /\/programs\/discovery-drivers/)
  assert.equal(summary.includes('discovery-driveres'), false)
  assert.equal(summary.includes('TODO'), false)
  assert.match(summary, /Monday to Saturday, 8:00 AM to 5:00 PM/)
})

test('slug input cannot alter CMS filters', async (t) => {
  const requests: URL[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    requests.push(new URL(String(input)))
    return Response.json({ docs: [] })
  })
  const slug = 'hello&where[status][equals]=draft'
  await getProgram(slug)
  await getArticle(slug)
  for (const url of requests) assert.equal(url.searchParams.get('where[slug][equals]'), slug)
  assert.equal(requests[1].searchParams.get('where[status][equals]'), 'published')
})
