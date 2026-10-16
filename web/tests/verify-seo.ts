import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { jsonLdIssues, schemaTypes } from '../lib/jsonld.ts'

function hasType(schemas: { '@type'?: unknown; '@graph'?: { '@type'?: unknown }[] }[], type: string) {
  return schemas.some((schema) => schemaTypes(schema).includes(type) || schema['@graph']?.some((node) => schemaTypes(node).includes(type)))
}

// Run after `npm run build`. This script performs only public GET requests.
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3032', '--hostname', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'],
})
let stderr = ''
server.stderr.on('data', (chunk) => { stderr += String(chunk) })

try {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timeout: ${stderr}`)), 45000)
    server.on('error', (error) => { clearTimeout(timer); reject(error) })
    server.on('exit', (code) => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${stderr}`)) })
    server.stdout.on('data', (chunk) => {
      if (String(chunk).includes('Ready')) { clearTimeout(timer); resolve() }
    })
  })

  const origin = 'http://127.0.0.1:3032'
  const sitemap = await fetch(`${origin}/sitemap.xml`)
  assert.equal(sitemap.status, 200)
  assert.ok(sitemap.headers.get('content-type')?.includes('xml'))
  const xml = await sitemap.text()
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'))
  assert.ok(urls.length >= 7)
  assert.equal(new Set(urls).size, urls.length)
  assert.equal(urls.every((url) => new URL(url).origin === 'https://www.tinythinkers.edu.ph'), true)
  assert.equal(urls.some((url) => /\/admin|\/api|\/parents|\/trial-requests/.test(new URL(url).pathname)), false)
  assert.equal(xml.includes('discovery-driveres'), false)
  assert.ok(xml.includes('/programs/discovery-drivers'))
  assert.ok(xml.includes('<lastmod>'))

  const titles: string[] = []
  const descriptions: string[] = []
  for (const url of urls) {
    const path = new URL(url).pathname
    const response = await fetch(origin + path)
    assert.equal(response.status, 200, path)
    const html = await response.text()
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || ''
    const canonical = [...head.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map((m) => new URL(m[1]).href)
    // Next normalizes a root canonical's trailing slash; URL equality preserves this.
    assert.deepEqual(canonical, [new URL(url).href], `${path}: canonical`)
    assert.match(head, /hreflang="en-PH"|hrefLang="en-PH"/, `${path}: hreflang`)
    for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
      assert.ok(head.includes(`property="${property}"`), `${path}: ${property}`)
    }
    const ogUrl = head.match(/property="og:url" content="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&')
    assert.equal(ogUrl ? new URL(ogUrl).href : '', new URL(url).href, `${path}: og:url`)
    const title = head.match(/<title>([^<]*)<\/title>/)?.[1]
    const description = head.match(/name="description" content="([^"]*)"/)?.[1]
    assert.ok(title && description, `${path}: title and description`)
    titles.push(title)
    descriptions.push(description)
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]))
    for (const schema of schemas) assert.deepEqual(jsonLdIssues(schema), [], `${path}: ${JSON.stringify(jsonLdIssues(schema))}`)
    assert.ok(hasType(schemas, 'EducationalOrganization'), `${path}: school schema`)
    assert.ok(hasType(schemas, 'Preschool') && hasType(schemas, 'ChildCare'), `${path}: preschool and childcare types`)
    assert.ok(hasType(schemas, 'WebPage') || hasType(schemas, 'Article'), `${path}: page schema`)
    if (path !== '/') assert.ok(hasType(schemas, 'BreadcrumbList'), `${path}: breadcrumb`)
    if (path === '/') {
      assert.ok(hasType(schemas, 'FAQPage'), 'homepage FAQPage')
      assert.ok(html.includes('What ages are the classes for?'), 'Visible parent FAQ')
      assert.ok(html.includes('Play-based preschool in Quezon City'), 'Homepage H1 keyword')
      assert.equal(html.includes('discovery-driveres'), false)
    }
    if (path === '/programs') assert.ok(hasType(schemas, 'ItemList'), 'program list schema')
    if (path.startsWith('/programs/') && path !== '/programs') assert.ok(hasType(schemas, 'Course'), `${path}: course schema`)
  }
  assert.equal(new Set(titles).size, titles.length, `Duplicate titles: ${titles.join(' | ')}`)
  assert.equal(new Set(descriptions).size, descriptions.length, `Duplicate descriptions: ${descriptions.join(' | ')}`)

  for (const path of ['/robots.txt', '/llms.txt', '/llms-full.txt', '/opengraph-image']) {
    const response = await fetch(origin + path)
    assert.equal(response.status, 200, path)
    if (path === '/robots.txt') {
      const text = await response.text()
      assert.ok(text.includes('Sitemap: https://www.tinythinkers.edu.ph/sitemap.xml'))
      assert.ok(text.includes('Allow: /'))
    }
    if (path === '/llms.txt' || path === '/llms-full.txt') {
      const text = await response.text()
      assert.match(text, /Monday to Friday, 8:00 AM to 5:00 PM; closed Saturdays/)
      assert.match(text, /\/programs\/discovery-drivers/)
      assert.equal(text.includes('discovery-driveres'), false)
      assert.equal(text.includes('TODO'), false)
    }
    if (path === '/opengraph-image') assert.ok(response.headers.get('content-type')?.includes('image/png'))
  }
  const legacy = await fetch(`${origin}/programs/discovery-driveres`, { redirect: 'manual' })
  assert.equal(legacy.status, 301)
  assert.equal(new URL(legacy.headers.get('location') || '', origin).pathname, '/programs/discovery-drivers')
  const missing = await fetch(`${origin}/programs/nonexistent-program`)
  assert.equal(missing.status, 404)
  const missingHtml = await missing.text()
  assert.match(missingHtml, /Page not found \| Tiny Thinkers Learning Center/)
  assert.match(missingHtml, /noindex/)
  const home = await (await fetch(origin)).text()
  const image = home.match(/property="og:image" content="([^"]+)"/)?.[1]
  assert.ok(image)
  const imageResponse = await fetch(image.replaceAll('&amp;', '&'))
  assert.equal(imageResponse.status, 200, 'Public CMS sharing image')
  assert.ok(imageResponse.headers.get('content-type')?.startsWith('image/'))

  try {
    const validatorBody = new URLSearchParams()
    validatorBody.set('html', home)
    const validator = await fetch('https://validator.schema.org/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: validatorBody,
      signal: AbortSignal.timeout(15000),
    })
    const validatorText = await validator.text()
    console.log(`Schema.org validator HTTP ${validator.status}: ${validatorText.slice(0, 1500)}`)
  } catch (error) {
    console.log(`Schema.org validator was not reachable: ${error instanceof Error ? error.message : error}`)
  }
  console.log(`Verified ${urls.length} sitemap URLs, canonical and sharing tags, hreflang, JSON-LD, parent FAQ, llms files, Discovery Drivers redirect, 404 and sharing image.`)
} finally {
  server.kill('SIGTERM')
  if (server.exitCode === null) await once(server, 'exit')
}
