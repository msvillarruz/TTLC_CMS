import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contentDate, latestContentDate, pageUrl, programAgeRange, programFocuses, recordPath, serializeJsonLd } from '../lib/seo-utils.ts'
import { getArticle, getProgram, getSitemapContent } from '../lib/api.ts'

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
