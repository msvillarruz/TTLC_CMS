import type { Program } from './api'

export const SITE_URL = 'https://www.tinythinkers.edu.ph'
export const SCHOOL_NAME = 'Tiny Thinkers Learning Center'
export const SCHOOL_ID = `${SITE_URL}/#school`
export const SITE_DESCRIPTION = 'Play-based learning in Quezon City. Explore toddler, nursery and kinder readiness classes at Tiny Thinkers and book a free trial.'

// This release changes page content and structured data. Advance this reviewed
// date only when these static pages receive a significant content/schema update.
export const STATIC_CONTENT_UPDATED_AT = '2026-10-15'

export const SCHOOL_PHONE = '+63 967 201 8214'
export const SCHOOL_EMAIL = 'hello@tinythinkers.edu.ph'
export const SCHOOL_POSTAL_CODE = '1105'
export const SCHOOL_LOCALITY = 'Quezon City'
export const SCHOOL_ADDRESS_FALLBACK = '113 West Avenue, Brgy. Bungad, Quezon City'
// Month precision only. The site says the school opened in August 2024, not a specific day.
export const SCHOOL_FOUNDED = '2024-08'
export const SCHOOL_FOUNDED_LABEL = 'August 2024'
// Center hours from the Google Business Profile listing (Mon–Sat 08:00–17:00).
export const SCHOOL_HOURS = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const,
  opens: '08:00',
  closes: '17:00',
  label: 'Monday to Saturday, 8:00 AM to 5:00 PM',
}
// Approximate pin for 113 West Avenue, Brgy. Bungad. Not a new survey.
export const SCHOOL_GEO = { latitude: 14.6514, longitude: 121.0289 }
// The CMS share link currently resolves here. Publish this one profile URL.
export const CANONICAL_FACEBOOK_URL = 'https://www.facebook.com/TTLCph/'
export const SCHOOL_MAPS_URL = 'https://maps.app.goo.gl/g4ggoVGcMD2jqskeA'

const FACEBOOK_ALIASES = new Set([
  'https://www.facebook.com/share/1BDRvgw8Ud',
  'https://www.facebook.com/share/1BDRvgw8Ud/',
  'https://facebook.com/share/1BDRvgw8Ud',
  'https://facebook.com/share/1BDRvgw8Ud/',
  'https://www.facebook.com/tinythinkersph',
  'https://www.facebook.com/tinythinkersph/',
  'https://facebook.com/tinythinkersph',
  'https://facebook.com/tinythinkersph/',
])

// Live CMS saved this typo. The public canonical slug is discovery-drivers.
export const PROGRAM_SLUG_ALIASES: Record<string, string> = {
  'discovery-driveres': 'discovery-drivers',
}

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

export function canonicalProgramSlug(slug: string) {
  return PROGRAM_SLUG_ALIASES[slug] ?? slug
}

export function programLookupSlugs(slug: string) {
  const canonical = canonicalProgramSlug(slug)
  const aliases = Object.entries(PROGRAM_SLUG_ALIASES)
    .filter(([, target]) => target === canonical)
    .map(([alias]) => alias)
  return [...new Set([canonical, ...aliases, slug])]
}

export function withCanonicalProgramSlug<T extends { slug: string }>(program: T): T {
  const slug = canonicalProgramSlug(program.slug)
  return slug === program.slug ? program : { ...program, slug }
}

export function displayPhone(phone?: string) {
  const digits = (phone ?? '').replace(/\D/g, '')
  if (!digits || digits === '639672018214' || digits === '09672018214') return SCHOOL_PHONE
  return phone!.trim()
}

export function phoneHref(phone?: string) {
  return `tel:${displayPhone(phone).replace(/[^\d+]/g, '')}`
}

export function formatAddress(address?: string) {
  const base = (address?.trim() || SCHOOL_ADDRESS_FALLBACK).replace(/\s+/g, ' ')
  if (base.includes(SCHOOL_POSTAL_CODE)) return base
  return `${base} ${SCHOOL_POSTAL_CODE}`
}

export function postalAddress(address?: string) {
  const full = formatAddress(address)
  const match = full.match(/^(.*?),?\s*Quezon City\s*1105$/i)
  const streetAddress = match ? match[1].replace(/,\s*$/, '').trim() : full
  return {
    '@type': 'PostalAddress' as const,
    streetAddress,
    addressLocality: SCHOOL_LOCALITY,
    postalCode: SCHOOL_POSTAL_CODE,
    addressCountry: 'PH',
  }
}

export function canonicalFacebookUrl(url?: string) {
  const trimmed = url?.trim()
  if (!trimmed) return CANONICAL_FACEBOOK_URL
  const withoutSlash = trimmed.replace(/\/+$/, '')
  if (FACEBOOK_ALIASES.has(trimmed) || FACEBOOK_ALIASES.has(withoutSlash) || FACEBOOK_ALIASES.has(`${withoutSlash}/`)) {
    return CANONICAL_FACEBOOK_URL
  }
  return trimmed
}

export function classSizeLabel(value?: string) {
  const text = value?.trim()
  if (!text) return undefined
  if (/^\d+$/.test(text)) return `Maximum of ${text} children`
  return text
}

export function classCapacity(value?: string) {
  const text = value?.trim()
  if (!text) return undefined
  const exact = text.match(/^\d+$/)
  if (exact) return Number(exact[0])
  const max = text.match(/max(?:imum)?(?:\s+of)?\s*(\d+)/i)
  if (max) return Number(max[1])
  return undefined
}

export function programScheduleLine(program: Pick<Program, 'schedule' | 'duration'>) {
  return [program.schedule, program.duration].map((part) => part?.trim()).filter(Boolean).join(', ')
}
