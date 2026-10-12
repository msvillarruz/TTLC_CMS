import type { Program } from './api'

export const SITE_URL = 'https://www.tinythinkers.edu.ph'
export const SCHOOL_NAME = 'Tiny Thinkers Learning Center'
export const SCHOOL_ID = `${SITE_URL}/#school`
export const SITE_DESCRIPTION = 'Play-based learning in Quezon City. Explore toddler, nursery and kinder readiness classes at Tiny Thinkers and book a free trial.'

// This release changes page content and structured data. Advance this reviewed
// date only when these static pages receive a significant content/schema update.
export const STATIC_CONTENT_UPDATED_AT = '2026-10-13'

export function pageUrl(path = '/') {
  return `${SITE_URL}${path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`}`
}

export function contentDate(value?: string): string | undefined {
  if (!value || !Number.isFinite(Date.parse(value))) return undefined
  return new Date(value).toISOString()
}

export function latestContentDate(...values: (string | undefined)[]): string | undefined {
  return values.map(contentDate).filter((v): v is string => Boolean(v)).sort().at(-1)
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function programAgeRange(program: Pick<Program, 'ageMin' | 'ageMax' | 'ageRange'>) {
  // The CMS owns the meaning of decimal age notation. Do not reinterpret it.
  if (program.ageRange?.trim()) return program.ageRange.trim()
  const min = String(program.ageMin).trim()
  const max = String(program.ageMax).trim()
  return `${min}–${max}${/years?|yrs?\b/i.test(`${min} ${max}`) ? '' : ' years old'}`
}

export function programFocuses(program: Pick<Program, 'focuses'>): string[] {
  return (program.focuses ?? [])
    .map((f) => f.item?.trim() || f.focus?.trim() || '')
    .filter(Boolean)
}

export function recordPath(collection: 'programs' | 'articles' | 'events', slug: string) {
  return `/${collection}/${encodeURIComponent(slug)}`
}
