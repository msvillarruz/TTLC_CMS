import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEvent, getEvents } from '@/lib/api'
import { serializeLexical } from '@/lib/lexical'
import EventCarousel from '@/components/EventCarousel'
import JsonLd from '@/components/JsonLd'
import { pageMetadata, webPageStructuredData } from '@/lib/seo'
import { latestContentDate, recordPath, STATIC_CONTENT_UPDATED_AT } from '@/lib/seo-utils'

export const revalidate = 60

export async function generateStaticParams() {
  const events = await getEvents().catch(() => [])
  return events.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ev = await getEvent(slug).catch(() => null)
  if (!ev) return { title: 'Event — Tiny Thinkers Learning Center' }

  const ogImage =
    ev.highlightImages?.[0]?.image?.url ??
    ev.heroImage?.url ??
    undefined

  const descriptionText = typeof ev.description === 'string'
    ? ev.description.slice(0, 160)
    : `Join us for ${ev.title} at Tiny Thinkers Learning Center.`

  return pageMetadata({ path: recordPath('events', slug), title: `${ev.title} | Tiny Thinkers`, description: descriptionText, image: ogImage ? { url: ogImage, alt: ev.title } : undefined })
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  upcoming:  { bg: '#DCFCE7', color: '#16A34A', label: 'Upcoming' },
  past:      { bg: '#F3F4F6', color: '#6B7280', label: 'Past' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' },
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ev = await getEvent(slug).catch(() => null)
  if (!ev) notFound()

  const descHtml = serializeLexical(ev.description)
  const s = STATUS_STYLE[ev.status] ?? STATUS_STYLE.upcoming

  const carouselImages = (ev.highlightImages ?? [])
    .map((item) => item.image)
    .filter((img): img is { url: string; alt?: string } => Boolean(img?.url))

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={webPageStructuredData(recordPath('events', slug), ev.title, latestContentDate(STATIC_CONTENT_UPDATED_AT, ev.updatedAt))} />
      {/* Hero */}
      {ev.heroImage?.url && (
        <div className="relative w-full" style={{ aspectRatio: '21/9', maxHeight: '420px', overflow: 'hidden', background: '#f3f4f6' }}>
          <Image
            src={ev.heroImage.url}
            alt={ev.heroImage.alt || ev.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm font-700 text-ink/50 hover:text-ink mb-8 transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ← All Events
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-700 px-3 py-1 rounded-full"
            style={{ background: s.bg, color: s.color, fontFamily: 'var(--font-display)' }}
          >
            {s.label}
          </span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-900 text-ink mb-5 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {ev.title}
        </h1>

        {/* Event details */}
        <div
          className="rounded-2xl p-6 mb-10 space-y-3"
          style={{ background: 'linear-gradient(135deg, #FFF8E7, #F0FFF8)', border: '1px solid #e5e7eb' }}
        >
          <div className="flex items-start gap-3 text-sm">
            <span className="text-lg">📅</span>
            <div>
              <p className="font-700 text-ink" style={{ fontFamily: 'var(--font-display)' }}>
                {new Date(ev.date).toLocaleDateString('en-PH', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              {ev.endDate && ev.endDate !== ev.date && (
                <p className="text-ink/60 mt-0.5">
                  Until {new Date(ev.endDate).toLocaleDateString('en-PH', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          {ev.location && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-lg">📍</span>
              <p className="text-ink/80">{ev.location}</p>
            </div>
          )}
          {ev.registrationLink && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-lg">🔗</span>
              <a
                href={ev.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline font-600"
              >
                Register here
              </a>
            </div>
          )}
        </div>

        {/* Description */}
        {descHtml ? (
          <div
            className="prose prose-ink max-w-none mb-10"
            style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'rgba(26,26,46,0.85)' }}
            dangerouslySetInnerHTML={{ __html: descHtml }}
          />
        ) : (
          <p className="text-ink/40 italic mb-10">No description available.</p>
        )}

        {/* Highlight photo carousel */}
        {carouselImages.length > 0 && (
          <div className="mb-10">
            <h2
              className="text-lg font-800 text-ink mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Event Highlights
            </h2>
            <EventCarousel images={carouselImages} />
          </div>
        )}
      </div>
    </div>
  )
}
