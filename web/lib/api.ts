const CMS = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.tinythinkers.edu.ph'
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

export function resolveMediaUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('/') && R2_PUBLIC_URL) return `${R2_PUBLIC_URL}${url}`
  return url
}

export type Program = {
  id: number
  name: string
  slug: string
  classType: string
  ageMin: number
  ageMax: number
  duration: string
  focuses: { focus: string }[]
  accentColor?: string
  classSize?: string
  schedule?: string
  specialNote?: string
  classRoutine?: { time: string; activity: string }[]
}

export type Author = {
  id: number
  name: string
  role: string
  photo?: { url: string; alt?: string }
}

export type SiteSettings = {
  mission?: string
  address?: string
  phone?: string
  email?: string
  mapEmbedUrl?: string
  logo?: { url: string; alt?: string }
  footerLogo?: { url: string; alt?: string }
}

export type HomePage = {
  heroHeadline?: string
  heroSubline?: string
}

export type Announcement = {
  id: number
  message: string
  severity: 'info' | 'urgent'
  isActive: boolean
  publishDate?: string
  updatedAt: string
}

export type Category = {
  id: number
  name: string
  slug: string
  color?: string
}

export type Article = {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  publishedAt?: string
  excerpt?: string
  body?: unknown
  heroImage?: { url: string; alt?: string }
  author?: { id: number; name: string; role?: string }
  categories?: Category[]
}

export type Event = {
  id: number
  title: string
  slug: string
  date: string
  endDate?: string
  location?: string
  description?: unknown
  heroImage?: { url: string; alt?: string }
  status: 'upcoming' | 'past' | 'cancelled'
  registrationLink?: string
}

export type TrialRequestPayload = {
  childName: string
  childBirthday: string
  parentName: string
  email: string
  preferredDate: string
  preferredProgram: number
}

async function fetchCMS<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${CMS}/api${path}`, {
    next: { revalidate },
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`CMS fetch failed: ${path} — ${res.status}`)
  return res.json()
}

export async function getPrograms(): Promise<Program[]> {
  const data = await fetchCMS<{ docs: Program[] }>('/programs?limit=100&sort=createdAt')
  return data.docs
}

export async function getProgram(slug: string): Promise<Program | null> {
  const data = await fetchCMS<{ docs: Program[] }>(`/programs?where[slug][equals]=${slug}&limit=1`)
  return data.docs[0] ?? null
}

export async function getAuthors(): Promise<Author[]> {
  const data = await fetchCMS<{ docs: Author[] }>('/authors?limit=100&sort=createdAt')
  return data.docs.map((a) => ({
    ...a,
    photo: a.photo ? { ...a.photo, url: resolveMediaUrl(a.photo.url) ?? a.photo.url } : undefined,
  }))
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchCMS<SiteSettings>('/globals/site-settings')
}

export async function getHomePage(): Promise<HomePage> {
  return fetchCMS<HomePage>('/globals/home-page')
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await fetchCMS<{ docs: Announcement[] }>(
    '/announcements?where[isActive][equals]=true&sort=-publishDate&limit=50'
  )
  return data.docs
}

export async function getArticles(): Promise<Article[]> {
  const data = await fetchCMS<{ docs: Article[] }>(
    '/articles?where[status][equals]=published&depth=1&limit=20&sort=-publishedAt'
  )
  return data.docs
}

export async function getArticle(slug: string): Promise<Article | null> {
  const data = await fetchCMS<{ docs: Article[] }>(
    `/articles?where[slug][equals]=${slug}&where[status][equals]=published&depth=1&limit=1`
  )
  return data.docs[0] ?? null
}

export async function getEvents(): Promise<Event[]> {
  const data = await fetchCMS<{ docs: Event[] }>('/events?depth=1&limit=20&sort=date')
  return data.docs
}

export async function getEvent(slug: string): Promise<Event | null> {
  const data = await fetchCMS<{ docs: Event[] }>(`/events?where[slug][equals]=${slug}&depth=1&limit=1`)
  return data.docs[0] ?? null
}

export async function submitTrialRequest(payload: TrialRequestPayload): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${CMS}/api/trial-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { ok: false, message: err?.errors?.[0]?.message || 'Submission failed' }
  }
  return { ok: true }
}

export const COLOR_MAP: Record<string, string> = {
  pink:   '#E91E8C',
  teal:   '#009688',
  orange: '#FF6D3B',
  yellow: '#FFD600',
  green:  '#5A9E2F',
  purple: '#7C4DFF',
}

export function resolveColor(accentColor?: string): string {
  if (!accentColor) return '#009688'
  return COLOR_MAP[accentColor.toLowerCase()] ?? accentColor
}
