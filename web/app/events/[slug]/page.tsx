import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEvent, getEvents } from '@/lib/api'
import { serializeLexical } from '@/lib/lexical'

export const revalidate = 3600

export async function generateStaticParams() {
  const events = await getEvents().catch(() => [])
  return events.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ev = await getEvent(slug).catch(() => null)
  if (!ev) return { title: 'Event — Tiny Thinkers Learning Center' }
  return {
    title: `${ev.title} — Tiny Thinkers Learning Center`,
    openGraph: ev.heroImage?.url ? { images: [ev.heroImage.url] } : undefined,
  }
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

  return (
    <div className="min-h-screen bg-white">
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
            className="prose prose-ink max-w-none"
            style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'rgba(26,26,46,0.85)' }}
            dangerouslySetInnerHTML={{ __html: descHtml }}
          />
        ) : (
          <p className="text-ink/40 italic">No description available.</p>
        )}
      </div>
    </div>
  )
}
