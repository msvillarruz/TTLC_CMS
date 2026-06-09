import { getAnnouncements } from '@/lib/api'

export default async function AnnouncementTicker() {
  const announcements = await getAnnouncements().catch(() => [])
  if (!announcements.length) return null

  const items = [...announcements, ...announcements]
  const hasUrgent = announcements.some((a) => a.severity === 'urgent')
  const bg = hasUrgent ? '#EF4444' : '#E91E8C'

  return (
    <div
      className="overflow-hidden py-2"
      style={{ background: bg, fontFamily: 'var(--font-display)' }}
    >
      <div
        className="flex whitespace-nowrap animate-ticker"
        style={{ width: 'max-content' }}
      >
        {items.map((a, i) => (
          <span
            key={`${a.id}-${i}`}
            className="inline-flex items-center gap-2 px-8 text-sm font-700 text-white"
          >
            <span
              className="inline-block w-2 h-2 rounded-full bg-white opacity-80"
              aria-hidden="true"
            />
            {a.severity === 'urgent' && (
              <span className="font-900 mr-1">⚠️</span>
            )}
            {a.message}
          </span>
        ))}
      </div>
    </div>
  )
}
