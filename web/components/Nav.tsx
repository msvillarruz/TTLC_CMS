'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { SCHOOL_MAPS_URL } from '@/lib/seo-utils'

const links = [
  { label: 'Programs', href: '/programs' },
  { label: 'Articles', href: '/articles' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav({ logoUrl, mapsUrl }: { logoUrl?: string; mapsUrl?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-gray-100"
      style={{ boxShadow: '0 2px 12px rgba(28,43,74,0.07)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Tiny Thinkers Learning Center"
              width={160}
              height={80}
              priority
              sizes="160px"
              className="h-20 w-auto object-contain"
            />
          ) : (
            <>
              <span className="text-2xl font-black tracking-tight text-pink">
                Tiny Thinkers
              </span>
              <span className="text-xs font-bold text-teal uppercase tracking-widest hidden sm:block">
                Learning Center
              </span>
            </>
          )}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-ink hover:text-pink transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={mapsUrl || SCHOOL_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-ink hover:text-pink transition-colors"
          >
            📍 Find Us
          </a>
          <Link
            href="/contact"
            className="px-5 py-2 rounded-xl text-sm font-extrabold text-white bg-pink hover:bg-pink/90 transition-colors"
          >
            Book a Trial
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open ? (
              <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — animated max-height */}
      <div
        className={`md:hidden border-t border-gray-100 bg-white px-4 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] pb-4' : 'max-h-0'}`}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="block py-3 text-sm font-bold text-ink border-b border-gray-50 last:border-0"
          >
            {l.label}
          </Link>
        ))}
        <a
          href={mapsUrl || SCHOOL_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="block py-3 text-sm font-bold text-ink border-b border-gray-50 hover:text-pink transition-colors"
        >
          📍 Find Us
        </a>
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="mt-3 block text-center px-5 py-2 rounded-xl text-sm font-extrabold text-white bg-pink"
        >
          Book a Trial
        </Link>
      </div>
    </nav>
  )
}
