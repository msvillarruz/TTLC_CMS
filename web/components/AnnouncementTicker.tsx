'use client'

import type { Announcement } from '@/lib/api'

export default function AnnouncementTicker({ announcements }: { announcements: Announcement[] }) {
  if (!announcements.length) return null

  const items = [...announcements, ...announcements]

  return (
    <div
      className="overflow-hidden bg-pink py-2"
      style={{ fontFamily: 'var(--font-display)' }}
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
            {a.message}
          </span>
        ))}
      </div>
    </div>
  )
}
