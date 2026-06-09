import type { Metadata } from 'next'
import { getAnnouncements } from '@/lib/api'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Announcements — Tiny Thinkers Learning Center',
  description: 'Latest announcements from Tiny Thinkers Learning Center.',
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements().catch(() => [])

  return (
    <div className="min-h-screen">
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #FFF5FB 0%, #F0FFF8 100%)' }}
      >
        <h1
          className="text-4xl sm:text-5xl font-900 text-ink mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Announcements
        </h1>
        <p className="text-ink/60 max-w-xl mx-auto">
          Stay up to date with news and important updates from Tiny Thinkers.
        </p>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          {announcements.length === 0 ? (
            <p className="text-center text-ink/40 py-20">No announcements at this time.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => {
                const isUrgent = a.severity === 'urgent'
                return (
                  <div
                    key={a.id}
                    className="rounded-2xl p-6"
                    style={{
                      background: isUrgent ? '#FFF5F5' : '#F0F9FF',
                      borderLeft: `4px solid ${isUrgent ? '#EF4444' : '#3B82F6'}`,
                      boxShadow: '0 2px 8px rgba(26,26,46,0.05)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{isUrgent ? '🚨' : 'ℹ️'}</span>
                      <div className="flex-1">
                        <p className="text-ink/80 leading-relaxed">{a.message}</p>
                        {a.publishDate && (
                          <p
                            className="text-xs text-ink/40 mt-2 font-600"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {new Date(a.publishDate).toLocaleDateString('en-PH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-xs font-700 px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: isUrgent ? '#FEE2E2' : '#DBEAFE',
                          color: isUrgent ? '#DC2626' : '#1D4ED8',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {isUrgent ? 'Urgent' : 'Info'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
