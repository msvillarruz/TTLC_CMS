import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'

// Run after `npm run build`. This script performs only public GET requests.
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3032', '--hostname', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'],
})
let stderr = ''
server.stderr.on('data', (chunk) => { stderr += String(chunk) })

try {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timeout: ${stderr}`)), 15000)
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

  for (const url of urls) {
    const path = new URL(url).pathname
    const response = await fetch(origin + path)
    assert.equal(response.status, 200, path)
    const html = await response.text()
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || ''
    const canonical = [...head.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map((m) => new URL(m[1]).href)
    // Next normalizes a root canonical's trailing slash; URL equality preserves this.
    assert.deepEqual(canonical, [new URL(url).href], `${path}: canonical`)
    for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
      assert.ok(head.includes(`property="${property}"`), `${path}: ${property}`)
    }
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
    assert.ok(schemas.some((s) => s['@graph']?.some((n: { '@type': string }) => n['@type'] === 'EducationalOrganization')), `${path}: school schema`)
    assert.ok(schemas.some((s) => s['@type'] === 'WebPage' || s['@type'] === 'Article'), `${path}: page schema`)
    if (path === '/') assert.ok(html.includes('What ages are the classes for?'), 'Visible parent FAQ')
  }

  for (const path of ['/robots.txt', '/llms.txt', '/opengraph-image']) {
    const response = await fetch(origin + path)
    assert.equal(response.status, 200, path)
    if (path === '/robots.txt') {
      const text = await response.text()
      assert.ok(text.includes('Sitemap: https://www.tinythinkers.edu.ph/sitemap.xml'))
      assert.ok(text.includes('Allow: /'))
    }
    if (path === '/opengraph-image') assert.ok(response.headers.get('content-type')?.includes('image/png'))
  }
  assert.equal((await fetch(`${origin}/programs/nonexistent-program`)).status, 404)
  const home = await (await fetch(origin)).text()
  const image = home.match(/property="og:image" content="([^"]+)"/)?.[1]
  assert.ok(image)
  const imageResponse = await fetch(image.replaceAll('&amp;', '&'))
  assert.equal(imageResponse.status, 200, 'Public CMS sharing image')
  assert.ok(imageResponse.headers.get('content-type')?.startsWith('image/'))
  console.log(`Verified ${urls.length} sitemap URLs, canonical and sharing tags, JSON-LD, parent FAQ, public endpoints, image response and unknown-program 404.`)
} finally {
  server.kill('SIGTERM')
  if (server.exitCode === null) await once(server, 'exit')
}
