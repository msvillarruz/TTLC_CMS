import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getEvents } from '@/lib/api'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Events — Tiny Thinkers Learning Center',
  description: 'Upcoming and past events at Tiny Thinkers Learning Center.',
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  upcoming:  { bg: '#DCFCE7', color: '#16A34A', label: 'Upcoming' },
  past:      { bg: '#F3F4F6', color: '#6B7280', label: 'Past' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' },
}

export default async function EventsPage() {
  const allEvents = await getEvents().catch(() => [])

  const upcoming = allEvents.filter((e) => e.status === 'upcoming')
  const past     = allEvents.filter((e) => e.status === 'past')
  const other    = allEvents.filter((e) => e.status !== 'upcoming' && e.status !== 'past')
  const sorted   = [...upcoming, ...other, ...past]

  return (
    <div className="min-h-screen">
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #F0FFF8 100%)' }}
      >
        <h1
          className="text-4xl sm:text-5xl font-900 text-ink mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Events
        </h1>
        <p className="text-ink/60 max-w-xl mx-auto text-lg">
          School activities, open houses, and community events.
        </p>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          {sorted.length === 0 ? (
            <p className="text-center text-ink/40 py-20">No events at this time.</p>
          ) : (
            <div className="space-y-6">
              {sorted.map((ev) => {
                const s = STATUS_STYLE[ev.status] ?? STATUS_STYLE.upcoming
                return (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.slug}`}
                    className="group flex gap-5 bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
                    style={{ boxShadow: '0 2px 12px rgba(26,26,46,0.07)', border: '1px solid #f3f4f6' }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative flex-shrink-0 w-32 sm:w-48"
                      style={{ background: '#f9fafb' }}
                    >
                      {ev.heroImage?.url ? (
                        <Image
                          src={ev.heroImage.url}
                          alt={ev.heroImage.alt || ev.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[100px] flex items-center justify-center text-3xl">
                          🎉
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center py-4 pr-5 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs font-700 px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, color: s.color, fontFamily: 'var(--font-display)' }}
                        >
                          {s.label}
                        </span>
                        {ev.location && (
                          <span className="text-xs text-ink/40">📍 {ev.location}</span>
                        )}
                      </div>

                      <h2
                        className="text-lg font-800 text-ink mb-1 group-hover:text-teal transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {ev.title}
                      </h2>

                      <p className="text-sm text-ink/50 mb-2">
                        {new Date(ev.date).toLocaleDateString('en-PH', {
                          weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
                        })}
                        {ev.endDate && ev.endDate !== ev.date && (
                          <> — {new Date(ev.endDate).toLocaleDateString('en-PH', {
                            weekday: 'short', month: 'long', day: 'numeric',
                          })}</>
                        )}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
